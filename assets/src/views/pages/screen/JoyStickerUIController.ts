import { _decorator, Component, Node, NodeEventType, UITransform, Vec3, EventTouch  } from 'cc';
import {gameController} from "db://assets/src/views/pages/gameController";
const { ccclass, property } = _decorator;

@ccclass('JoyStickerUIController')
export class JoyStickerUIController extends Component {
    /*
    * @int04
    * @packge Name: JoyStickerUIController
    * @class Name：JoyStickerUIController
    * @implements Name: IJoyStickerUIController
    * @doc：JoyStickerUIController class, using move sprite with joystick
    * */

    private joyStickerMax : number = 100; // max distance of joystick
    private joyStickerVec: Vec3 = new Vec3(0, 0); // vector of joystick
    @property(gameController)
    private gameController: gameController = null;
    start() {
        this.node.on(NodeEventType.TOUCH_MOVE, this.joyTouchMove, this);
        this.node.on(NodeEventType.TOUCH_START, this.joyTouchStart, this);
        this.node.on(NodeEventType.TOUCH_END, this.joyTouchEnd, this);

    }

    private joyTouchMove(event : any): void{
        let touch = event.getTouches()[0];
        let touchPos = touch.getLocation();
        let vec3 = new Vec3(touchPos.x, touchPos.y, 0);
        let localPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(vec3);

        let distance = localPos.length();
        if(distance > this.joyStickerMax) {
            localPos.normalize();
            localPos.multiplyScalar(this.joyStickerMax);
        }
        this.node.setPosition(localPos);
        this.joyStickerVec = localPos;

        // cover to up, down, left, right
        let x = localPos.x;
        let y = localPos.y;
        let angle = Math.atan2(y, x);
        let degree = angle * 180 / Math.PI;
        let direction: number = 0;
        if(degree < 0) degree += 360;
        if(degree > 45 && degree < 135) direction = 38;
        else if(degree > 135 && degree < 225) direction = 37;
        else if(degree > 225 && degree < 315) direction = 40;
        else direction = 39;
        this.reset();
        this.gameController.key[direction] = true;
        if(direction == 37 || direction == 39) {
            this.gameController.key[38] = false;
            this.gameController.key[40] = false;
        }

    }
    private joyTouchStart(event: any): void {
        let touchPos = event.getTouches()[0].getLocation();
        let v3 = new Vec3(touchPos.x, touchPos.y, 0);
        let localPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(v3);
        this.joyStickerVec = localPos;
        this.node.setPosition(localPos);

    }
    private joyTouchEnd(event: any): void {
        this.node.setPosition(new Vec3(0, 0));
        this.joyStickerVec = new Vec3(0, 0);
        this.reset();

    }

    private reset():void {
        this.gameController.key[38] = false;
        this.gameController.key[37] = false;
        this.gameController.key[39] = false;
        this.gameController.resetEvent(37);
        this.gameController.resetEvent(38);
        this.gameController.resetEvent(39);
    }

    update(deltaTime: number) {

    }
}


