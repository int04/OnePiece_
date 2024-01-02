import { _decorator, Component, Node, Label } from 'cc';
import cache from "db://assets/src/engine/cache";
const { ccclass, property } = _decorator;

@ccclass('ButtonSkillController')
export class ButtonSkillController extends Component {
    @property(Label)
    public timeSKill: Label = null;
    @property(Node)
    public sprite: Node = null;
    public id: Number = -1;
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

    updateSkill():void {
        let skill = cache.my.oskill;
        // @ts-ignore
        let infoSkill = skill[this.id];
        if(!infoSkill) {
            this.timeSKill.node.active = false;
            this.sprite.active = false;
            return;
        }
    }

    update(deltaTime: number) {
        if(cache.my.id != null) {
            this.updateSkill();
        }
    }
}


