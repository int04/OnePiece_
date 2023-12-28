import { _decorator, Component, Node, systemEvent } from 'cc';
import cache from "db://assets/src/engine/cache";
import {getSprite} from "db://assets/src/views/pages/sprite/MapController";
import {SpriteController} from "db://assets/src/views/pages/sprite/SpriteController";
const { ccclass, property } = _decorator;

@ccclass('gameController')
export class gameController extends Component {
    @property(Node)
    public camera: Node = null;
    private key: object = {};
    start() {
        this.node.active = true;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.KEY_DOWN, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.KEY_UP, this);
    }

    KEY_DOWN(event): void {
        this.key[event.keyCode] = true;
    }
    KEY_UP(event): void {
        this.key[event.keyCode] = false;
        delete this.key[event.keyCode];

        if(cache.my.id && (event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40)) {
            let nhanVat = getSprite(cache.my.id);
            nhanVat.getComponent(SpriteController).updateAction('dungyen');
        }
    }

    private direction = 'left';

    MOVE(sprite : Node, deltaTime : number): void {

        let position = sprite.getPosition();
        let speed = 240;
        if(this.key[37]) {
            position.x -= speed*deltaTime;
            if(this.direction !== 'left') {
                this.direction = 'left';
                sprite.getComponent(SpriteController).upDataMove(this.direction);
            }
        }
        if(this.key[38]) {
            position.y += speed*deltaTime;
        }
        if(this.key[39]) {
            position.x += speed*deltaTime;
            if(this.direction !== 'right') {
                this.direction = 'right';
                sprite.getComponent(SpriteController).upDataMove(this.direction);
            }
        }
        if(this.key[40]) {
            position.y -= speed*deltaTime;
        }
        if(this.key[37] || this.key[38] || this.key[39] || this.key[40]) {
            sprite.setPosition(position);
            sprite.getComponent(SpriteController).updateAction('move');
        }
    }

    update(deltaTime: number) {
        if(cache.my.id != null) {
            let nhanVat = getSprite(cache.my.id);
            if(!nhanVat) return;
            this.MOVE(nhanVat, deltaTime);
            let target_postion = nhanVat.getPosition()
            let minX = 0;
            let maxX = 1000;
            let minY = 0;
            let maxY = 1000;
            if(target_postion.x < minX) {
                target_postion.x = minX
            }
            if(target_postion.x > maxX) {
                target_postion.x = maxX
            }
            if(target_postion.y < minY) {
                target_postion.y = minY
            }
            if(target_postion.y > maxY) {
                target_postion.y = maxY
            }
            let current_position = this.camera.getPosition()
            current_position.lerp(target_postion, 0.1, current_position)
            this.camera.setPosition(current_position)
        }
    }
}


