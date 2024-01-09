import { _decorator, Component, Node, Label, Sprite, Animation, Graphics, UITransform, Color, tween, Vec3, find } from 'cc';
import {coverColor, coverImg, coverSpriteFrame} from "db://assets/src/engine/draw";
import cache from "db://assets/src/engine/cache";
import {createClipY} from "db://assets/src/engine/animation";
import {grahics} from "db://assets/src/engine/canvas";
import {preViewItemUI} from "db://assets/src/views/UI/preViewItemUI";
const { ccclass, property } = _decorator;
/*
* @int04
* @class boxItemUI
* @what: hiển thị ra item UI
* */
@ccclass('boxItemUI')
export class boxItemUI extends Component {
    @property(Sprite)
    private background: Sprite = null;
    @property(Node)
    private avatar: Node = null;
    @property(Node)
    private UIQuantity: Node = null;
    @property(Label)
    private quantity: Label = null;

    private data : any = null;
    start() {
        this.node.active = true;
    }

    public clickButton(event = null): void {
        let UI = find("UI/previewItem");
        if(UI) {
            UI.getComponent(preViewItemUI).updatePrview(this.data, event);
        }
    }

    async updateAvatar(item : any) {
        let img = item.img;
        let num = img.num; // số lượng sheet
        let src = img.src; // ảnh
        if(num <=1) {
            this.avatar.getComponent(Sprite).spriteFrame = await coverSpriteFrame(src);
        }
        else {
            let checkExitAnimation = this.avatar.getComponent(Animation);
            if(checkExitAnimation) {
                this.avatar.removeComponent(Animation);
            }
            let texture = await coverImg(src);
            let width = texture.width;
            let height = texture.height;
            let clip = await createClipY(src, width, height, num, 0.1, 120);
            this.avatar.addComponent(Animation);
            let animation = this.avatar.getComponent(Animation);
            animation.addClip(clip, clip.name);
            animation.play(clip.name);
        }
    }

    updateItem(data :any) {
        let item = cache.item.find( e=> e.id === data.item);
        if(!item) {
            this.node.active = false;
            return;
        }
        this.data = data;

        this.node.active = true;

        let phamchat = 1;
        phamchat = data.phamchat || 1;
        let _back = [0,0,"#20B2AA","#8B658B","#FF7F24"];
        if(item.type === 'item') phamchat = item.phamchat || phamchat;
        let color_background = _back[phamchat];
        this.updateBackground(color_background); // cập nhật nền

        // nếu là trang bị hoặc item có số lượng <=1 thì ẩn số lượng đi
        if(item.type === 'trangbi' || data.soluong <= 1) {
            this.UIQuantity.active = false;
        }
        else {
            this.UIQuantity.active = true;
            this.quantity.string = data.soluong;
        }
        this.updateAvatar(item);

        let level = 0;
        if(data.level <=0) level = 0;
        if(data.level >=1 && data.level <=3) level = 1;
        if(data.level >3 && data.level <=5) level = 2;
        if(data.level >5 && data.level <=8) level = 3;
        if(data.level >= 9) level = 4;
        let o_level : Array<any> = [0,"#9AC0CD","#54FF9F","#FF1493","#CD0000"];
        let o_level_run : Array<any> = [0,"#68838B","#2E8B57","#8B0A50","#8B0000"];
        if(level >=1) {
            let border = new Node("border");
            border.parent = this.avatar;
            border.layer = this.avatar.layer;
            border.addComponent(Graphics);
            let graphics = border.getComponent(Graphics);


            graphics.fillColor = new Color(255, 0, 0, 0.5)
            graphics.rect(0, 0, 50, 50);
            // hide rect
            graphics.lineWidth = 3;
            graphics.strokeColor = coverColor(o_level[level]);
            graphics.stroke();

            graphics.fill();
            border.getComponent(UITransform).setAnchorPoint(1,1);
            let pos = border.getPosition();
            pos.x-= 25;
            pos.y-= 25;
            border.setPosition(pos)

            let border_run1 = this.createCicle((o_level_run[level]));
            let pos2 = border_run1.getPosition();
            pos2.x-= 25;
            pos2.y+= 25 - 7/2;
            border_run1.setPosition(pos2);

            let pos2Old = pos2.clone();

            let run_1_1 = () => {
                border_run1.setPosition(pos2Old);
                tween(border_run1)
                    .to(0.5, {position: new Vec3(border_run1.getPosition().x + 50, border_run1.getPosition().y, 0)},
                        {
                            onComplete: () => {
                                run_1_2();
                            }
                        }
                    )
                    .start();
            }

            let run_1_2 = () => {
                tween(border_run1)
                    .to(0.5, {position:  new Vec3(border_run1.getPosition().x-7/2 , border_run1.getPosition().y - 50, 0)}, {
                        onComplete: () => {
                            run_1_1();
                        }
                    })
                    .start();
            }

            run_1_1();


            let border_run2 = this.createCicle((o_level_run[level]));
            let pos3 = border_run2.getPosition();
            pos3.x-= 25;
            pos3.y+= 25 - 7/2;
            border_run2.setPosition(pos3);
            let oldPos3 = pos3.clone();
            let run_2_1 = () => {
                border_run2.setPosition(oldPos3);
                tween(border_run2)
                    .to(0.5, {position: new Vec3(border_run2.getPosition().x, border_run2.getPosition().y - 50, 0)},
                        {
                            onComplete: () => {
                                run_2_2();
                            }
                        }
                    )
                    .start();
            }

            let run_2_2 = () => {
                tween(border_run2)
                    .to(0.5, {position:  new Vec3(border_run2.getPosition().x+50 , border_run2.getPosition().y, 0)}, {
                        onComplete: () => {
                            run_2_1();
                        }
                    })
                    .start();
            }
            run_2_1();



        }
    }

    createCicle(co : string): Node {
        let border_run = new Node("border_run_1");
        border_run.parent = this.avatar
        border_run.layer = this.avatar.layer;
        border_run.addComponent(Graphics);
        let graphics_run1 = border_run.getComponent(Graphics);
        graphics_run1.fillColor = coverColor(co)
        graphics_run1.roundRect(0, 0, 5, 5,10);
        graphics_run1.fill();

        return border_run;
    }

    updateBackground(color : any) {
        if(color === 0) {
            this.background.node.active = false;
            return;
        }
        color = coverColor(color);
        this.background.node.active = true;
        this.background.color = color;
    }


}


