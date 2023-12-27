import { _decorator, Component, Node, UITransform, Sprite, SpriteFrame } from 'cc';
import cache, {getImages, getImagesIndex} from "db://assets/src/engine/cache";
import {coverSpriteFrame} from "db://assets/src/engine/draw";
const { ccclass, property } = _decorator;

@ccclass('SpriteImagesController')
export class SpriteImagesController extends Component {
    public IdImages = "";
    public y = 0;
    public action = "";
    public num: number = 0;
    public scale: number = 0.65;
    public moveNum: number = 1;
    public skin: object = {};
    public skinIndex: object  = {};
    private FrameName = '';
    start() {

    }

    private time: number = 0;


    updateFrame(deltaTime : number): void {
        this.time += deltaTime;
        if(this.time <= 0.07) return;
        this.time = 0;

        let action = this.action;
        if(action === 'move') {
            if(this.moveNum >=5) this.moveNum = 1;
            action = 'move'+this.moveNum;
            this.moveNum++;
            if(this.skinIndex['quan'] != -1)
            {
                let check = getImagesIndex(this.skinIndex['quan'], action);
                let y = 0;
                if(check) {
                    let ycheck = check[1][1];
                    if(ycheck < 0) y+= Math.abs(ycheck);
                    else y-= Math.abs(ycheck);
                }
                this.y = y;
            }

        }

        let index = this.skinIndex[this.node.name];
        if(index <= -1) return;
        let data  = getImagesIndex(index, action);
        if(!data) return;
        let frame = data[0][this.num];
        let pos = data[1];
        let x = pos[0];
        let y = pos[1] + this.y;
        if(!frame) {
            this.num = 0;
            frame = data[0][this.num];
        }
        let scale = data[2] || this.scale;
        this.FrameName = frame;
        coverSpriteFrame(frame).then((spritedata : SpriteFrame) => {
            let size = spritedata.getOriginalSize();
            let sizeSprite = this.node.getComponent(UITransform);
            this.node.setScale(scale,scale);

            sizeSprite.setContentSize(size);
            // set new frame
            this.node.getComponent(Sprite).spriteFrame = spritedata;
            this.node.setPosition(x, y);
        });

        this.num++;
    }
    updateSprite(action:string, idImages: string, y : number, skin: object) {
        this.IdImages = idImages;
        this.y = y;
        this.action = action;
        this.num = 0;
        this.skin = skin;
        this.updateFrame(999);
        for(let name in skin) {
            let id = skin[name];
            let findIndex = cache.images.findIndex(e => e.name === id);
            if(findIndex >= 0) {
                this.skinIndex[name] = findIndex;
            }
            else {
                this.skinIndex[name] = -1;
            }
        }
    }

    getSize(): any {
        return new Promise((res, fai) => {
            if(this.FrameName === '') {
                return res({
                    width : 0,
                    height : 0,
                    x : 0,
                    y : 0
                });
            }
            coverSpriteFrame(this.FrameName).then((spritedata : SpriteFrame) => {
                let scale = this.node.getScale();
                let sizeSprite = this.node.getContentSize();
                let XY = this.node.getPosition();
                let sizeSpriteNew = {
                    width : sizeSprite.width * scale.x,
                    height : sizeSprite.height * scale.y,
                    x : XY.x,
                    y : XY.y
                }
                res(sizeSpriteNew);
            });
        });
    }

    update(deltaTime: number) {
        if(this.IdImages != "" && this.action != "") {
            this.updateFrame(deltaTime);
        }
    }
}

