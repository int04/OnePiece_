import { _decorator, Component, Node, find } from 'cc';
import {getSprite} from "db://assets/src/views/pages/MapController";
import {SpriteController} from "db://assets/src/views/pages/sprite/SpriteController";
import {boxItemUI} from "db://assets/src/views/UI/boxItemUI";
const { ccclass, property } = _decorator;

@ccclass('CallBoxItemUI')
export class CallBoxItemUI extends Component {
    start() {

    }

    private i : number = null;
    private type : string = null; // type: hanhtrang, trangbi, ruongdo
    private uid : string = null;
    private source : string = null;
    public SetData(i : number,source : string, type : string, uid : string) {
        this.i = i;
        this.type = type;
        this.uid = uid;
        this.source = source;
    }

    private updateItem(): void {
        let sprite = getSprite(this.uid);
        if(!sprite) return;
        let my = sprite.getComponent(SpriteController).my;
        if(!my) return;
        let ruong = my.ruong.data.filter(e=> e.active === this.type);
        ruong.sort((a,b) => {
            return a.time - b.time;
        });

        if(ruong[this.i]) {
            let clone = JSON.parse(JSON.stringify(ruong[this.i]));
            clone.source = this.source;
            let child : Node = find("item",this.node);
            child.getComponent(boxItemUI).updateItem(clone);
        }

    }

    private time : number = 999;
    update(deltaTime: number) {
        this.time += deltaTime;
        if(this.time >= 0.3 && this.i !== null) {
            this.time = 0;
            this.updateItem();
        }
    }
}


