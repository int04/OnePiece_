import { _decorator, Component, Node, Layout,  ScrollView, find, instantiate, Sprite , Label, NodeEventType} from 'cc';
const { ccclass, property } = _decorator;
import {coverSpriteFrame, XHR} from "db://assets/src/engine/draw";
import {edittorController} from "db://assets/src/views/editor/edittorController";
import cache from "db://assets/src/engine/cache";


let fetchCurl = (url) => {
    let link =  cache.home + url;
    return new Promise((res, fai) => {
        fetch(link)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                res(data);
            })
            .catch((err) => {
                fai(err);
            });
    });
}


@ccclass('resourceController')
export class resourceController extends Component {

    @property({
        type: Node
    })
    private srcollView: Node;

    @property({
        type: Node
    })
    private layout: Node;

    @property({
        type: Node
    })

    private button: Node = null;

    @property({
        type: Node
    })

    private reload: Node = null;

    private chonnhanh: boolean = false;

    ClickChonNhanh(): void {
        this.chonnhanh = !this.chonnhanh;
        let text = find("Label", this.button);
        text.getComponent(Label).string = this.chonnhanh === true ? "Chọn(ON)" : "Chọn(OFF)";
    }
    start() {
        this.updateImg();
        this.button.on(Node.EventType.TOUCH_START, this.ClickChonNhanh, this);
        this.reload.on(Node.EventType.TOUCH_START, this.updateImg, this);

        let path = find("edit/listimg/ScrollView/view/content");

        path.on(NodeEventType.MOUSE_WHEEL, (event) => {
            let pos = path.getPosition();
            let scale =path.getScale();
            let delta = event.getScrollY();
            if(delta > 0) {
                scale.x *= 1.1;
                scale.y *= 1.1;
            } else {
                scale.x /= 1.1;
                scale.y /= 1.1;
            }
            path.setScale(scale);
        });

    }

    callbackname(name: string) : void {
        if(this.chonnhanh === true) {
            let path = find("Canvas/editor");
            path.getComponent(edittorController).updateImagesFromClick(name);
        }
    }

    async updateImg(): Promise<void> {
        let data: any = await  fetchCurl('get');
        let object: any = (data);
        let file: Array<string> = [];
        object.forEach(e => {
            let sprilit = e.split(".");
            let name = sprilit[0];
            file.push(name);
        })

        let list = find("edit/listimg/ScrollView/view/content/resource/");
        list.children.forEach(e => {
            let layout = this.layout;
            if(e.name !== "demo") {
                e.destroy()
            }
        });

        console.log(list.children)

        let demo = find("edit/listimg/ScrollView/view/content/resource/demo")
        demo.active = false;
        file.forEach(e => {
            let clone = instantiate(demo);
            clone.setParent(this.layout);
            clone.active = true;
            clone.name = e;
            let sprite = find("sprite", clone);
            coverSpriteFrame(e).then((spriteFrame) => {
                sprite.getComponent(Sprite).spriteFrame = spriteFrame;
            });
            sprite.setScale(0.7, 0.7);
            let name = find("name", clone);
            name.getComponent(Label).string = e;
        });


    }

}


