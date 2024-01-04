import { _decorator, Component, Node, Label, LabelOutline, tween, find, TTFFont, assetManager  } from 'cc';
import {getSprite, getSpriteComponent} from "db://assets/src/views/pages/MapController";
import {coverColor} from "db://assets/src/engine/draw";
import {random} from "db://assets/src/engine/sys";

const { ccclass, property } = _decorator;

@ccclass('congExpTextSKill')
export class congExpTextSKill extends Component {
    start() {

    }

    async play(element : any) : Promise<void> {
        this.node.addComponent(Label);
        this.node.addComponent(LabelOutline);
        let sprite = getSprite(element.from);
        if(!sprite) {
            this.node.destroy();
            return;
        }

        let value = element.value;
        let color = '#339900';

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


