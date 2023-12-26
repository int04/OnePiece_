import { _decorator, Component, Node, find } from 'cc';
import {edittorController} from "db://assets/src/views/editor/edittorController";
const { ccclass, property } = _decorator;

@ccclass('spriteController')
export class spriteController extends Component {
    @property({
        type: Node
    })
    private body: Node = null;
    private time: number = 0;
    private updated: boolean = false;
    public list : string = null;
    start() {
    }

    updatedSprite():void {
        let speed = 3;
        let pos = this.body.getPosition();
        if(this.updated === false) {
            pos.y-=speed;
            this.updated = true;
        }
        else {
            pos.y+=speed;
            this.updated = false;
        }
        this.body.setPosition(pos);
    }

    private  timeUpdate: number = 0;
    update(deltaTime: number) {
        this.time += deltaTime;
        if(this.time >=0.5) {
            this.time = 0;
            this.updatedSprite();
        }
        this.timeUpdate += deltaTime;
        if(this.timeUpdate <=2) {
            return;
        }
        this.timeUpdate = 0;
        let parent = this.node.getParent();
        let hide = parent.getComponent(edittorController).hide;
        for(let name in hide)
        {
            let node;
            if(name === 'quan') node = find("foot/quan", this.node)
            else node = find("body/"+name, this.node)

            let show = hide[name] === true ? false : true;
            node.active = show;

        }
    }
}


