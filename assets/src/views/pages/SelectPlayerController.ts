import { _decorator, Component, Node, find } from 'cc';
import {bottom, notice} from "db://assets/src/engine/UI";
const { ccclass, property } = _decorator;

@ccclass('SelectPlayerController')
export class SelectPlayerController extends Component {
    @property(Node)
    private button:Node = null;
    start() {
        bottom(this.button);
    }

    public outGame():void {
        this.node.active = false;
        let sceneLogin: Node = find("UI/mainLogin");
        if(sceneLogin) {
            sceneLogin.active = true;
        }
    }

    public createSprite(data :any): void {
        console.log(data)
        this.node.active = true;
        let sceneLogin: Node = find("UI/mainLogin");
        if(sceneLogin) {
            sceneLogin.active = false;
        }
    }

    newGame():void {
        let scene = find("UI/taoNV");
        if(scene) scene.active = true;
        else {
            notice('Chưa thể tạo nhân vật, vui lòng thử lại sau ít phút.');
        }
    }

    update(deltaTime: number) {
        
    }
}


