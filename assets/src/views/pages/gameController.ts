import { _decorator, Component, Node, systemEvent, BoxCollider2D, RigidBody2D, find, Intersection2D, Label, tween } from 'cc';
import cache from "db://assets/src/engine/cache";
import {getSprite} from "./MapController";
import {SpriteController} from "db://assets/src/views/pages/sprite/SpriteController";
import {spriteController} from "db://assets/src/views/editor/spriteController";
const { ccclass, property } = _decorator;

@ccclass('gameController')
export class gameController extends Component {
    @property(Node)
    public camera: Node = null;
    public key: object = {};
    public nhanvat: Node = null;
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

        this.resetEvent(event.keyCode)
    }

    public resetEvent(key: number): void {
        if(cache.my.id && (key === 37 || key === 39 )) {
            let nhanVat = getSprite(cache.my.id);
            if(this.roitudo === false && this.jumUp === false) {
                nhanVat.getComponent(SpriteController).updateAction('dungyen');
            }
        }
    }

    public  onDat(sprite :Node = null): any {
        let map = find("game/dat");
        if(sprite === null) sprite = this.nhanvat;
        if(this.nhanvat === null) return false;
        //get all children name = dat
        let getChild = map.children
        let block = sprite.getComponent(SpriteController).quan.getComponent(BoxCollider2D);
        if(!block) return -1;
        for(let i = 0; i < getChild.length; i++) {
            let e = getChild[i];
            if(e.name === 'dat' && e.getPosition().y < sprite.getPosition().y) {
                let collider = e.getComponent(BoxCollider2D);
                let t = Intersection2D.rectRect(collider.worldAABB, block.worldAABB);
                if(t) {
                    return {
                        x : e.getPosition().x,
                        y : e.getPosition().y,
                        width : e.getContentSize().width,
                        height : e.getContentSize().height
                    }
                }
            }
        }
        return false;
    }

    public async setOnDat(sprite: any = null, data: object = {}): Promise<void> {
        if(sprite === null) sprite = this.nhanvat;
        if(this.nhanvat === null) return;
        if(typeof sprite === "string" || typeof sprite === "number") {
            sprite = getSprite(sprite);
        }
        if(!sprite) return;
        if(data) {
         //   this.nhanvat.setScale(1.5,1.5)
            sprite.getComponent(SpriteController).updateAction('dungyen');

            let quanSize = await sprite.getComponent(SpriteController).getSizeObject('quan');
            let pos = sprite.getPosition();
            pos.y = data.y + data.height/2 + quanSize.height/2 - 28
            sprite.setPosition(pos);
        }
    }

    private direction = 'left';
    private roitudo :boolean = true;
    private jumUp : boolean = false;
    private vOld : number = 0;
    private timeRoi : number = 0;
    public spriteRoitudo(deltaTime : number): void {
        if(this.roitudo === true && this.jumUp === false) {
            if(this.docao === null) this.docao = this.nhanvat.getPosition().y;
            let vacham = this.onDat();
            if(vacham === -1) {

            }
            else
            if(vacham) {
                this.roitudo = false;
                this.vOld = 0;
                this.timeRoi = 0;
                this.setOnDat(null, vacham);

                this.valueUp = this.valueUpDefault;
                if(this.docao != null) {
                    let dy = Math.abs(this.docao - vacham.y);
                    this.docao = null;
                }

            }
            else {
                this.timeRoi += deltaTime;
                if(this.vOld <=0) this.vOld = 1;
                let v = 9.8 * this.timeRoi + (96*0.8)/2 * this.timeRoi;
                let pos = this.nhanvat.getPosition();
                pos.y -= v
                this.nhanvat.setPosition(pos);
                this.nhanvat.getComponent(SpriteController).updateAction('roi');
            }
        }
    }

    public dangChayThiRoi():void {
        if(this.key[37] || this.key[39] && this.roitudo === false && this.jumUp === false ) {
            let chamdat = this.onDat();
            if(!chamdat) {
                this.roitudo = true;
            }
            else {
                this.valueUp = this.valueUpDefault;
                this.vOld = 0;
                this.timeRoi = 0;
            }
        }
    }
    private valueUpDefault: number = 120;
    private  valueUp: number = this.valueUpDefault;
    private  docao: number = 0;
    public nhayLen():void {
        if(this.key[38] && this.jumUp === false) {
            this.nhanvat.getComponent(SpriteController).testDemo();
            this.jumUp = true;
            // using tween Quadratic.out
            let clone = this.nhanvat.getPosition().clone();
            this.vOld = 0;
            this.timeRoi = 0;
            this.roitudo = false;

            let done = () => {
                this.jumUp = false;

                this.nhanvat.getComponent(SpriteController).updateAction('roi');
                setTimeout(() => {
                    this.roitudo = true;
                },100);
            }
            this.nhanvat.getComponent(SpriteController).updateAction('nhay');

            let speed = 0.5;
            if(this.roitudo && this.valueUp === this.valueUpDefault) {
                this.valueUp+= 48;
            }
            if(this.valueUp != this.valueUpDefault) speed = 0.5;
            clone.y += this.valueUp;
            let old = this.nhanvat.getPosition().clone();
            tween(old).
            to(speed,
                {y: clone.y },
                { easing: 'quartOut',onUpdate : () => {
                        let pos = this.nhanvat.getPosition();
                        pos.y = old.y;
                        this.nhanvat.setPosition(pos);
                        this.nhanvat.getComponent(SpriteController).updateAction('nhay');
                    },onComplete : () => {done()}}
            ).start()

        }
    }

    async MOVE( deltaTime : number): Promise <void> {
        let sprite = this.nhanvat;
        let speed = 240 * 2;

        this.nhayLen();

        this.spriteRoitudo(deltaTime);
        this.dangChayThiRoi();


        if(this.key[39] || this.key[37]) {
            let map = find("game/dat");
            //get all children name = dat
            let getChild = map.children;
            let get = sprite.getComponent(SpriteController)
            let block = get.quan.getComponent(BoxCollider2D);
            for(let i = 0; i < getChild.length; i++) {
                let e = getChild[i];

                let sosanh;
                if(this.key[39]) sosanh = e.name === 'camdi' && e.getPosition().x > sprite.getPosition().x;
                if(this.key[37]) sosanh = e.name === 'camdi' && e.getPosition().x < sprite.getPosition().x;

                if(sosanh) {
                    let collider = e.getComponent(BoxCollider2D);
                    let block = sprite.getComponent(SpriteController).quan.getComponent(BoxCollider2D);
                    let t = Intersection2D.rectRect(collider.worldAABB, block.worldAABB);
                    if(t) {
                        speed = 0;
                        break;
                    }
                }
            }
        }


        let position = sprite.getPosition();
        if(this.key[37]) {
            position.x -= speed*deltaTime;
            if(this.direction !== 'left') {
                this.direction = 'left';
                sprite.getComponent(SpriteController).upDataMove(this.direction);
            }
        }

        if(this.key[39]) {
            position.x += speed*deltaTime;
            if(this.direction !== 'right') {
                this.direction = 'right';
                sprite.getComponent(SpriteController).upDataMove(this.direction);
            }
        }

        if(this.key[37] ||  this.key[39]) {
            sprite.setPosition(position);
            let action = 'move';
            if(this.roitudo === true || this.jumUp) {
                action = 'roi'
            }

            sprite.getComponent(SpriteController).updateAction(action);
        }
    }

    update(deltaTime: number) {
        if(cache.my.id != null) {

            if(this.nhanvat === null) {
                this.nhanvat = getSprite(cache.my.id);
                if(this.nhanvat === null) {
                    return;
                }
            }

            let XY = find("UI/XY");
            if(XY) {
                let label = XY.getComponent(Label);
                label.string = 'X: '+this.nhanvat.getPosition().x.toFixed(2) + ' Y: '+this.nhanvat.getPosition().y.toFixed(2);
            }

            this.MOVE(deltaTime);
            let target_postion = this.nhanvat.getPosition()
            let minX = 0;
            let maxX = 1000;
            let minY = 0;
            let maxY = 1000;
            /*
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

             */
            let current_position = this.camera.getPosition()
            current_position.lerp(target_postion, 0.04, current_position)
            this.camera.setPosition(current_position)
        }
    }
}


