import { _decorator, Component, Node, Label, find, UITransform, Sprite, EditBox } from 'cc';
import {edittorController} from "db://assets/src/views/editor/edittorController";
import {spriteController} from "db://assets/src/views/editor/spriteController";
import cache, {getImages} from "db://assets/src/engine/cache";
import {coverSpriteFrame} from "db://assets/src/engine/draw";
const { ccclass, property } = _decorator;

@ccclass('spriteObjectController')
export class spriteObjectController extends Component {
    private action: string = null;
    private num: number = 0;
    public imagesID: string = null;
    public scale: number = 0.65;
    public time:number = 0;
    start() {
        // click
        this.node.on(Node.EventType.TOUCH_START, this.ClickSprite, this);
        let parent = this.node.getParent().getParent()
        let list = parent.getComponent(spriteController).list;
        let action = this.node.getParent().getParent();
        this.action = action.name;
        let name = this.node.name;
        this.imagesID = list[name];
        let data = getImages(this.imagesID, this.action);
    }

    ClickSprite():void {
        let action = this.node.getParent().getParent();
        this.action = action.name;
        let textAction = find("edit/text/action");
        textAction.getComponent(Label).string = this.action;
        let textObjectID = find("edit/text/objectID");
        textObjectID.getComponent(Label).string = this.node.name;

        let parent = find("Canvas/editor");
        parent.getComponent(edittorController).action = this.action;
        parent.getComponent(edittorController).objectID = this.node.name;

        parent.getComponent(edittorController).encodeJson();
        parent.getComponent(edittorController).encodeJsonObject(this.node.name);
        parent.getComponent(edittorController).updateForm();



    }

    updateFrame(deltaTime : number): void {
        let data = getImages(this.imagesID, this.action);
        let frame = data[0][this.num];
        let pos = data[1];
        let x = pos[0];
        let y = pos[1];
        if(!frame) {
            this.num = 0;
            frame = data[0][this.num];
        }

        if(this.time >= 0.3) {
            this.time = 0;
            this.num++;
        }

        coverSpriteFrame(frame).then((spriteFrame) => {
            let size = spriteFrame.getOriginalSize();
            let sizeSprite = this.node.getComponent(UITransform);
            sizeSprite.setContentSize(size);
            this.node.setScale(this.scale, this.scale);
            // set new frame
            this.node.getComponent(Sprite).spriteFrame = spriteFrame;
            this.node.setPosition(x, y);
        });
    }

    update(deltaTime: number) {
        this.time += deltaTime;
        if(this.imagesID != null) {
            this.updateFrame(deltaTime);
        }
    }
}


