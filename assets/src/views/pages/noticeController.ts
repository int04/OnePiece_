import { _decorator, Component, Node, NodeEventType, Label,
    ScrollView, Vec2, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import * as system from "db://assets/src/engine/sys";
import cache from "db://assets/src/engine/cache";
@ccclass('noticeController')
export class noticeController extends Component {
    @property({
        type: Node,
    })
    private background;

    @property({
        type: Node,
        tooltip : 'Lớp của label',
    })
    private label: Node = null;

    @property({
        type: Node,
        tooltip : 'Lớp của label',
    })
    private scrollview: Node = null;

    @property({
        type: Node,
        tooltip : 'Lớp của button',
    })
    private button: Node = null;
    private time: number = 0;
    private show: boolean = false;
    private create: boolean = false;
    start() {
        this.node.active = true;
    }

    private created(): void {
        if(this.create === false) {
            this.background.on(NodeEventType.TOUCH_START, () => {}, this);
            this.button.on(NodeEventType.TOUCH_START, this.TOUCH_START, this);
            this.button.on(NodeEventType.TOUCH_END, this.TOUCH_END, this);
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.KEY_UP, this);
        }
    }

    KEY_UP(e):void {
        if(e.keyCode == 13 && this.button.active === true) {
            this.TOUCH_START();
            this.TOUCH_END();
        }
    }
    TOUCH_START() {
        this.time = system.time();
    }

    deleteNotice(): void {
        this.node.active = false;
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.KEY_UP, this);
    }

    TOUCH_END():void {
        if(system.time() - this.time < 200) {
            this.deleteNotice()
        }
    }

    private oldPosition: Vec3 = null;
    private effectButton(): void {
        if(this.button.active === false) return;
        let oldPosition = this.button.getPosition().clone();
        let to = oldPosition.clone();
        to.x += cache.game.width/2;
        this.button.setPosition(to);
        if(this.oldPosition === null) {
            this.oldPosition = oldPosition;
        }

        system.move(this.button, {
            position : this.oldPosition,
        }, 0.5, 'bounceOut')
    }

    public setText(text: string, show : boolean = true): void {
        this.node.active = true;
        this.show = show;
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.KEY_UP, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.KEY_UP, this);
        this.label.getComponent(Label).string = text;
        this.label.getComponent(Label).updateRenderData(true);
        let labe = this.label.getContentSize()
        this.scrollview.getComponent(ScrollView).content.setContentSize(labe.width, labe.height+20)
        if(this.show === true) {
            this.button.active = true;
        }
        else {
            this.button.active = false;
        }
        this.created();
        this.effectButton()
    }

}


