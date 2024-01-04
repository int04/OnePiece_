import { _decorator, Component, Node, Label, LabelOutline, tween, find, TTFFont, assetManager  } from 'cc';
import {coverColor} from "db://assets/src/engine/draw";
import {getSprite, getSpriteComponent} from "db://assets/src/views/pages/MapController";
import {SpriteController} from "db://assets/src/views/pages/sprite/SpriteController";
import {random} from "db://assets/src/engine/sys";
const { ccclass, property } = _decorator;

@ccclass('hpTextSKill')
export class hpTextSKill extends Component {
    start() {

    }

    async play(element : any) : Promise<void> {
        let uid = element.from;
        let sprite = getSprite(uid);
        if(!sprite) {
            this.node.destroy();
            return;
        }
        this.node.addComponent(Label);
        this.node.addComponent(LabelOutline);
        let value = element.value;
        let color = '#ffffff';
        let type = element.type;
        if(type === 2) color = '#800080';
        if(type ===3) color = '#FFFF00';
        this.node.getComponent(LabelOutline).width = 2;
        this.node.getComponent(LabelOutline).color = coverColor("#000000");

        let string : Label = this.node.getComponent(Label);
        string.string = value;
        string.fontSize = 30;
        string.color = coverColor(color);


        string.font = find("game/demo/font/font1").getComponent(Label).font;


        let post = sprite.getPosition().clone();

        this.node.setPosition(post);

        let my = getSpriteComponent(sprite);
        let size = await my.caculatorSize();
        post.y += 50 + size.height/2;
        post.y += random(50,100);


        // TWEEN.Easing.Back.Out
        tween(this.node)
            .to(0.5, {
                position: post,
            }, {
                easing: 'backOut',
                onComplete: () => {
                    setTimeout(() => {
                        this.node.destroy();
                    },200);
                }
            } ).start();



    }

}


