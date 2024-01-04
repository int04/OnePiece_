import { _decorator, Component, Node, Label, ProgressBar, find } from 'cc';
import cache from "db://assets/src/engine/cache";
import {getSprite} from "db://assets/src/views/pages/MapController";
import {SpriteController} from "db://assets/src/views/pages/sprite/SpriteController";
const { ccclass, property } = _decorator;

@ccclass('previewInfoPlayerController')
export class previewInfoPlayerController extends Component {

    @property(Node)
    UI: Node = null;

    @property(Label)
    namePlayer: Label = null;

    @property(Label)
    levelPlayer: Label = null;

    @property(Label)
    hpPlayerText: Label = null;

    @property(ProgressBar)
    hpPlayer: ProgressBar = null;

    private dx : object = {
        player : 300,
        npc : 200,
        mob : 400,
    }

    private caculatorDistance(x1 : number, y1 : number, x2 : number, y2 : number) : number {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx*dx + dy*dy);
    }
    private logPlayerClick : Array<string> = [];

    public clickChange():void {
        /*
        * @todo: xử lý khi click vào đối tượng nào đó
        * */
        let mySprite = getSprite();
        if(!mySprite) return;
        let myX = mySprite.getPosition().x;
        let myY = mySprite.getPosition().y;
        let have = 0;
        let listPlayer = find("game/player").children.filter(e => e.name !== cache.my.id);
        for(let i = 0; i < listPlayer.length; i++) {
            let element = listPlayer[i];
            let x = element.getPosition().x;
            let y = element.getPosition().y;
            let dx = this.caculatorDistance(myX, myY, x, y);
            let getMy = element.getComponent(SpriteController).my;
            if(getMy.type == 'mob' && getMy.info && getMy.info.chiso && getMy.info.chiso.hp <=0) continue;
            let dx_max = this.dx[getMy.type];
            if(dx <= dx_max && !this.logPlayerClick.find(e => e == getMy.id)) {
                have = 1;
                cache.click = getMy.id;
                this.logPlayerClick.push(getMy.id);
                break;
            }
        }
        if(have === 0) {
            this.logPlayerClick = [];
            if(cache.click != null) {
                this.logPlayerClick.push(cache.click);
            }
        }
    }

    private noClick(): void {
        /*
        * @todo: xử lý khi không click vào đối tượng nào
        *
        *
        * */
        let mySprite = getSprite();
        if(!mySprite) return;
        let myX = mySprite.getPosition().x;
        let myY = mySprite.getPosition().y;
        let list = find("game/player").children.filter(e => e.name !== cache.my.id);
        let old = null;
        list.forEach(e => {
            let getMy = e.getComponent(SpriteController).my;
            if(getMy.type == 'mob' && getMy?.info && getMy?.info?.chiso && getMy?.info?.chiso?.hp <=0) {

            }
            else {
                let dxMax = this.dx[getMy.type];
                let x = e.getPosition().x;
                let y = e.getPosition().y;
                let dx = this.caculatorDistance(myX, myY, x, y);
                if((old === null || old > dx) && dx < dxMax) {
                    old = dx;
                    cache.click = getMy.id;
                }
            }
        });
    }

    private isClick():void {
        let mySprite = getSprite();
        if(!mySprite) return;
        let myX = mySprite.getPosition().x;
        let myY = mySprite.getPosition().y;

        let element = getSprite(cache.click);
        if(!element) {
            cache.click = null;
            return;
        }
        let x = element.getPosition().x;
        let y = element.getPosition().y;
        let dx = this.caculatorDistance(myX, myY, x, y);
        let getMy = element.getComponent(SpriteController).my;
        let max = this.dx[getMy.type];

        if(dx > max) {
            cache.click = null;
            return;
        }

        if(getMy.type === 'mob' && getMy.info && getMy?.info?.chiso && getMy?.info?.chiso?.hp <=0) {
            cache.click = null;
            return;
        }

        // Update UI
        this.namePlayer.string = getMy.name;
        this.levelPlayer.string = getMy.info?.coban?.level || 0;

        let hp = getMy.info?.chiso?.hp || 0;
        let hpMax = getMy.info?.chiso?.hpmax || 0;
        this.hpPlayer.progress = hp/hpMax;
        this.hpPlayerText.string = hp+"/"+hpMax;

    }


    update(deltaTime: number) {
        if(cache.my.id === null) return;
        if(cache.click === null) {
            this.UI.active = false;
            this.noClick();
        }
        else {
            this.UI.active = true;
            this.isClick();
        }
    }
}


