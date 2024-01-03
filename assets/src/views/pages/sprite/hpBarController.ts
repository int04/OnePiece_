import { _decorator, Component, Node } from 'cc';
import {SpriteController} from "db://assets/src/views/pages/sprite/SpriteController";
const { ccclass, property } = _decorator;

@ccclass('hpBarController')
export class hpBarController extends Component {
    @property(SpriteController)
    public sprite : SpriteController = null;
    start() {

    }

    update(deltaTime: number) {
        
    }
}


