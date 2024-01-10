import { _decorator, Component, Node, find, Label } from 'cc';
import {getSprite} from "db://assets/src/views/pages/MapController";
import {SpriteController} from "db://assets/src/views/pages/sprite/SpriteController";
import {move, number_format} from "db://assets/src/engine/sys";
const { ccclass, property } = _decorator;

@ccclass('moneyController')
export class moneyController extends Component {

    private my : any = null;
    private time : number = 1000;

    private run = 0;
    private lastGold = -9999;
    start() {

    }

    GetMy() : void {
        let sprite = getSprite();
        if(!sprite) return;
        let my = sprite.getComponent(SpriteController).my;
        this.my = my;
    }

    retur(value : any): boolean {
        if( this.lastGold === null) return true;
        if(value == this.lastGold) return false;
        return true;
    }

    updateMoney(): void {
        let value = this.my.tien[this.node.name];

        if(value === undefined) return;
        if(this.run === 1) return;
        if(!this.retur(value)) return;
        this.run = 1;
        let start = {x : this.lastGold};
        let end = {x : value};
        let time = 0.5;

        let label = find("bery_text",this.node);
        let text = null;
        if(label) {
            text = label.getComponent(Label);
        }

        move(start, end, time, 'easeOutCirc', (data : any) => {
            this.run = 0;
            this.lastGold = end.x;
        }, () => {
            let a = Math.round(start.x);
            if(text != null) {
                text.string = number_format(a);
            }
        });

    }

    update(deltaTime: number) {
        if(this.my === null) {
            this.GetMy();
        }
        else {
            this.time += deltaTime;
            if(this.time < 1) return;
            this.time = 0;
            this.updateMoney();
        }
    }
}


