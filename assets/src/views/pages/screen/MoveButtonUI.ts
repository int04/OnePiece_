import { _decorator, Component, Node, NodeEventType, Animation, AnimationState, Sprite   } from 'cc';
import {gameController} from "db://assets/src/views/pages/gameController";
const { ccclass, property } = _decorator;

@ccclass('MoveButtonUI')
export class MoveButtonUI extends Component {
    @property(Node)
    private up: Node = null;
    @property(Node)
    private left: Node = null;
    @property(Node)
    private right: Node = null;
    @property(gameController)
    private gameController: gameController = null;
    start() {
        this.node.active = true;
        this.createEvent(this.up, 38);
        this.createEvent(this.left, 37);
        this.createEvent(this.right, 39);
    }

    createEvent(name: Node, key: number): void {
        name.on(NodeEventType.TOUCH_START, () => {
            this.clickOn(key, name)
        }, this);
        name.on(NodeEventType.TOUCH_END, () => {
            this.clickOff(key, name)
        }, this);
    }

    clickOn(event: number, button : Node):void {
        this.gameController.key[event] = true;

        let animation = button.getComponent(Animation);
        if(animation) {
            animation.play();
        }


    }

    clickOff(event: number, button: Node):void {
        let animation = button.getComponent(Animation);
        if(animation) {
            // reset animation
            let state = animation.getState(animation.defaultClip.name)
            console.log(state)
            state.time = 0;
            // set frame for sprite
            let sprite = button.getComponent(Sprite);

            // reset sprite
            if(sprite) {
              //  sprite.spriteFrame = null;
            }

        }

        this.gameController.key[event] = false;
        delete this.gameController.key[event];
        if(this.gameController.nhanvat === null) return;
        this.gameController.resetEvent(event);

    }

    update(deltaTime: number) {
        
    }
}


