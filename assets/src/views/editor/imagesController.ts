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

    public copyToClipboard(str: string): void {
        let el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        let selected =
            document.getSelection().rangeCount > 0
                ? document.getSelection().getRangeAt(0)
                : false;
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        if (selected) {
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(selected);
        }

    }

    ClickImagesEND(): void {
        if(Date.now() - this.time < 200) {
            let parent = find("edit/listimg");
            let name = this.node.getParent().name
            let path = find("edit/listimg");
            path.getComponent(resourceController).callbackname(name);
            this.copyToClipboard(name);
        }
    }

}


