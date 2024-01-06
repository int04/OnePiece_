import { _decorator, Component, Node, find } from 'cc';
import socket from "db://assets/src/engine/socket";
import {getSprite} from "db://assets/src/views/pages/MapController";
import {SpriteController} from "db://assets/src/views/pages/sprite/SpriteController";
const { ccclass, property } = _decorator;

@ccclass('buttonSkillUI')
export class buttonSkillUI extends Component {
    public data : any = null;
    public skill : any = null;
    public clickBtn(event = null, id = null) : void {
        if(typeof id === 'number') {
            socket().send(-4,[1, [
                this.skill.id,
                id
            ]])
            let sprite = getSprite();
            let my = sprite.getComponent(SpriteController).my;
            my.oskill[id] = this.skill.id;
        }
        let ob = find("UI/previewSkill");
        ob.active = false;
    }
}


