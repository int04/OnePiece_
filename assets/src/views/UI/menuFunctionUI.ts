import { _decorator, Component, Node, Label, Sprite, find } from 'cc';
import {coverSpriteFrame} from "db://assets/src/engine/draw";
const { ccclass, property } = _decorator;

@ccclass('menuFunctionUI')
export class menuFunctionUI extends Component {

    public func : Function | string | (() => void) = null;

    @property(Label)
    public title: Label = null;

    @property(Sprite)
    public icon: Sprite = null;

    private btnClick():void {
        if(typeof this.func == 'function') {
            if(this.func) {
                this.func();
            }
        }
        let menu : Node = find("UI/menu");
        if(menu) {
            menu.active = false;
        }
    }

    private async updateIcon(icon: any = null): Promise<void> {
        this.icon.node.active = true;
        this.icon.spriteFrame = await coverSpriteFrame(icon);
    }

    public updateUI(icon: any = null, title: any, func: Function | string | (() => void) = null): void {
        if(icon) {
            this.updateIcon(icon);
        }
        else {
            this.icon.node.active = false;
        }
        if(title) {
            this.title.string = title;
        }
        if(func) {
            this.func = func;
        }
    }
}


