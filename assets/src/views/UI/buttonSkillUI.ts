import { _decorator, Component, Node, find } from 'cc';
import socket from "db://assets/src/engine/socket";
import {getSprite} from "db://assets/src/views/pages/MapController";
import {SpriteController} from "db://assets/src/views/pages/sprite/SpriteController";
import {menu} from "db://assets/src/engine/UI";
const { ccclass, property } = _decorator;

@ccclass('buttonSkillUI')
export class buttonSkillUI extends Component {
    public data : any = null;
    public skill : any = null;

    public ganBtn(id): void {
        socket().send(-4,[1, [
            this.skill.id,
            id
        ]])
        let sprite = getSprite();
        let my = sprite.getComponent(SpriteController).my;
        my.oskill[id] = this.skill.id;
    }

    public create(): void {
        let list = [];
        for(let i = 0; i < 12; i++) {
            list.push(["9119", "Gán phím "+(i+1), () => {
                this.ganBtn(i);
            }]);
        }

        menu('Gán phím', list);
    }

    public clickBtn(event = null, id = null) : void {
        if(id === 'gan') {
            this.create();
        }
        let ob = find("UI/previewSkill");
        ob.active = false;
    }
}


