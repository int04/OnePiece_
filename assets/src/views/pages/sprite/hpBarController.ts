import { _decorator, Component, Node, ProgressBar } from 'cc';
import {SpriteController} from "db://assets/src/views/pages/sprite/SpriteController";
const { ccclass, property } = _decorator;

@ccclass('hpBarController')
export class hpBarController extends Component {
    @property(SpriteController)
    public sprite : SpriteController = null;
    public bar : ProgressBar = null;
    start() {
        this.bar = this.getComponent(ProgressBar);
    }

    update(deltaTime: number) {
        if(this.bar) {
            let info = this.sprite.my.info?.chiso;
            if(info) {
                let hp = info?.hp;
                let max = info?.hpmax;
                let percent = hp/max;
                this.bar.progress = percent;
            }
        }
    }
}


