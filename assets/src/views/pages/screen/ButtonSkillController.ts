import { _decorator, Component, Node, Label, Sprite, Animation } from 'cc';
import cache from "db://assets/src/engine/cache";
import {getSprite} from "db://assets/src/views/pages/MapController";
import {SpriteController} from "db://assets/src/views/pages/sprite/SpriteController";
import {coverImg, coverSpriteFrame} from "db://assets/src/engine/draw";
import {createClipY} from "db://assets/src/engine/animation";
import {getTime} from "db://assets/src/engine/sys";
const { ccclass, property } = _decorator;

@ccclass('ButtonSkillController')
export class ButtonSkillController extends Component {
    @property(Label)
    public timeSKill: Label = null;
    @property(Node)
    public sprite: Node = null;
    public id: Number = 0;
    start() {
        this.node.active = true;
        let id: any = this.node.name;
        id = id * 1; // convert to number
        this.id = id;
    }

    useSkilL(EVENT_OLD: any, id : any): void {
        if(!id) {
            id = this.node.name;
            id = id * 1; // convert to number
        }
    }

    private key : any = null; // id đối tượng
    private type: string = null; // skill or item
    private skill : object = {};
    updateSkill():void {
        let sprite = getSprite();
        if(!sprite) return;
        let my = sprite.getComponent(SpriteController).my;
        let skill = my.oskill;
        // @ts-ignore
        let infoSkill = skill[this.id];
        if(infoSkill === 0 || infoSkill === -1) {
            this.timeSKill.node.active = false;
            this.sprite.active = false;
            return;
        }
        else {
            let key : any = infoSkill;
            if(this.key === null || this.key !== key) {
                this.key = key;
                this.type = null;
            }

            if(this.type === null) {
                let skill = cache.skill.find(e => e.id === key);
                if(skill) {
                    this.type = 'skill';
                    this.skill = skill;
                }
                else {
                    this.skill = {};
                    let checkItem = my.ruong.data.find( e=> e.active === 'hanhtrang' && e.id === key);
                    if(checkItem) {
                        this.type = 'item';
                    }
                    else {
                        // @ts-ignore
                        my.oskill[this.id] = -1;
                    }
                }
                this.updateAvatar(my);
            }

            this.sprite.active = true;

            if(this.type === 'item') {
                this.isItem(my);
            }
            else {
                this.isSkill(my);
            }
        }
    }

    isSkill(my : any):void {
        let id = this.key;
        let myskill = my.skill.find(e => e[0] == id);
        if(myskill) {
            let time_await = myskill[2];
            let time_last_use = myskill[4];
            time_await = !time_await ? 0 : time_await;
            time_last_use = !time_last_use ? 0 : time_last_use;
            time_last_use = !time_last_use ? 0 : time_last_use;
            if(time_await > getTime()) {
                let time = time_await - getTime();
                let txt = Math.fround(time / 1000);


                let time_await_con = getTime() - myskill[4]
                let time_await_sudung =  myskill[2] - myskill[4];

                let tinhtoan = time_await_con/ time_await_sudung * 100;
                let cover = tinhtoan/100;
                cover = cover <= 0.2 ? 0.2 : cover;

                this.timeSKill.node.active = true;
                this.timeSKill.string =  txt.toFixed(2);
            }
            else
            {
                this.timeSKill.node.active = false;
            }
        }
        else {
            // @ts-ignore
            my.oskill[this.id] = -1;
        }
    }
    isItem(my : any):void {
        let ruong = my.ruong.data.find( e=> e.active === 'hanhtrang' && e.id === this.key);
        if(ruong && ruong.soluong >=1) {
            this.timeSKill.node.active = true;
            this.timeSKill.string = ruong.soluong;
        }
        else {
            // @ts-ignore
            my.oskill[this.id] = -1;
        }
    }

    async updateAvatar(my : any): Promise<void> {
        if(this.type === 'skill') {
            let src = this.skill['avatar'];
            let frame = await coverSpriteFrame(src);
            this.sprite.getComponent(Sprite).spriteFrame = frame;
        }
        else {
            let checkItem = my.ruong.data.find( e=> e.active === 'hanhtrang' && e.id === this.key);
            if(checkItem) {
                let item = cache.item.find(e => e.id === checkItem.item);
                if(item) {
                    // remove component animation
                    let animation = this.sprite.getComponent(Animation);
                    if(animation) {
                        this.sprite.removeComponent(Animation);
                    }

                    let img = item.img;
                    let num = img.num; // số lượng sheet
                    let src = img.src; // ảnh
                    if(num <=1) {
                        this.sprite.getComponent(Sprite).spriteFrame = await coverSpriteFrame(src);
                    }
                    else {
                        let texture = await coverImg(src);
                        let width = texture.width;
                        let height = texture.height;
                        let clip = await createClipY(src, width, height, num, 0.1, 120);
                        this.sprite.addComponent(Animation);
                        animation = this.sprite.getComponent(Animation);
                        animation.addClip(clip, clip.name);
                        animation.play(clip.name);
                    }
                }
                else {
                    // @ts-ignore
                    my.oskill[this.id] = -1;
                }
            }
        }
    }

    update(deltaTime: number) {
        if(cache.my.id != null) {
            this.updateSkill();
        }
    }
}


