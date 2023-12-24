import { _decorator, Component, Node, find } from 'cc';
import {resourceController} from "db://assets/src/views/editor/resourceController";
const { ccclass, property } = _decorator;

@ccclass('imagesController')
export class imagesController extends Component {
    @property({type: Node})
    private parent: Node = null;
    private time: number = 0;
    start() {
        this.node.on(Node.EventType.TOUCH_START, this.ClickImages, this);
        this.node.on(Node.EventType.TOUCH_END, this.ClickImagesEND, this);
    }

    ClickImages(): void {
        this.time = Date.now();
    }

    ClickImagesEND(): void {
        if(Date.now() - this.time < 200) {
            let parent = find("edit/listimg");
            let name = this.node.getParent().name
            let path = find("edit/listimg");
            path.getComponent(resourceController).callbackname(name);
        }
    }

    update(deltaTime: number) {
        
    }
}


