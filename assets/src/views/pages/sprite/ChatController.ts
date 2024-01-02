import { _decorator, Component, Node, Label, Graphics, UITransform, Color, instantiate } from 'cc';
import {coverColor} from "db://assets/src/engine/draw";
import {SpriteController} from "db://assets/src/views/pages/sprite/SpriteController";
const { ccclass, property } = _decorator;

@ccclass('ChatController')
export class ChatController extends Component {
    start() {

    }
    public chat:boolean = false;
    public time: number = 0;

    public resetChat(): void {
        this.node.removeAllChildren();
    }
    async createChat (text : string): Promise<void> {

        // delete old chat
        this.resetChat();
        this.time = 0;
        this.chat = true;

        let parent = this.node.parent;
        let object =  parent.getComponent(SpriteController).fullName.node;
        const bubblePadding = 10;
        let node = new Node();
        node.layer = this.node.layer;
        let label = node.addComponent(Label);
        label.string = text;
        // align center
        label.horizontalAlign = Label.HorizontalAlign.CENTER;
        label.verticalAlign = Label.VerticalAlign.CENTER;
        // set font size
        label.fontSize = 14;
        // whitespace
        label.enableWrapText = true;
        label.lineHeight = 20;
        // word wrap
        label.overflow = Label.Overflow.RESIZE_HEIGHT;
        // word wrap width
        label.getComponent(UITransform).width = 200 - bubblePadding * 2;
        // set color
        label.color = new Color(0, 0, 0);

        // draw bubble
        let node2 = new Node();
        node2.parent = this.node;
        node2.layer = this.node.layer;
        let graphics = node2.addComponent(Graphics);
        graphics.lineWidth = 2;
        graphics.strokeColor = new Color(0, 0, 0);
        graphics.fillColor = coverColor('#febd6c');


        let size = label.getComponent(UITransform).contentSize;


        graphics.rect(-size.width/2, 0, size.width, size.height);

        label.node.setPosition(10, size.height/2);
        graphics.fill();

        node.parent = this.node;

        let sizeReal = label.updateRenderData();
        let size2 = label.getComponent(UITransform).contentSize;

        let width =  size2.width + bubblePadding * 2 < 150 ?
            150 :
            size2.width + bubblePadding * 2;

        let height = size2.height + bubblePadding * 2 < 50 ?
            50 :
            size2.height + bubblePadding * 2;


        // change size graphics
        graphics.clear();



        // @ts-ignore
        let y = object.getPosition().y + object.getContentSize().height/2

        graphics.roundRect(-size2.width/2, y, width, height, 10);
        graphics.fill();

        let textCoppy = instantiate(label.node);
        graphics.node.addChild(textCoppy);

        textCoppy.setPosition(10, y + height/2);

        label.node.destroy();

        // stroke
        graphics.strokeColor = coverColor("#331c34");
        graphics.lineWidth = 2;
        graphics.stroke();

        // create trangle
        let node3 = new Node();
        node3.parent = this.node;
        node3.layer = this.node.layer;
        let graphics2 = node3.addComponent(Graphics);
        graphics2.lineWidth = 2;
        graphics2.strokeColor = coverColor("#331c34");
        graphics2.fillColor = coverColor('#febd6c');
        graphics2.moveTo(0, 0);
        graphics2.lineTo(-10, -10);
        graphics2.lineTo(-20, 0);
        graphics2.close();
        graphics2.fill();
        graphics2.stroke();
        node3.setPosition(0+10, y);




    }

    update(deltaTime: number) {
        if(this.chat === true) {
            this.time += deltaTime;
            if(this.time > 5) {
                this.resetChat();
                this.chat = false;
            }
        }
    }
}


