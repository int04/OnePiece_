import { _decorator, Component, Node, Label, NodeEventType, find, BoxCollider2D, RigidBody2D, ERigidBody2DType } from 'cc';
import cache, {getImages} from "db://assets/src/engine/cache";
import {SpriteImagesController} from "db://assets/src/views/pages/sprite/SpriteImagesController";
import {ChatController} from "db://assets/src/views/pages/sprite/ChatController";
import {sprite} from "db://assets/src/sprite";
import {CaiBongController} from "db://assets/src/views/pages/sprite/CaiBongController";
const { ccclass, property } = _decorator;

@ccclass('SpriteController')
export class SpriteController extends Component {

    @property(CaiBongController)
    public caiBong: CaiBongController = null;
    @property(Node)
    public body: Node = null;
    public my : any = {};
    @property(Node)
    public mu: Node = null;
    @property(Node)
    public toc: Node = null;
    @property(Node)
    public dau: Node = null;
    @property(Node)
    public ao: Node = null;
    @property(Node)
    public lung: Node = null;
    @property(Node)
    public tay: Node = null;
    @property(Node)
    public quan: Node = null;
    @property(Label)
    public fullName: Label = null;

    @property(Node)
    public chat: Node = null;

    public size: object = {};


    start() {

        this.my.action = {
            action : 'dungyen',
            move : 'left'
        }
        this.node.active = true;
        //this.updateMy();
    }


    getSizeObject = async (nameObject: string) => {
        let object = this[nameObject];
        let size = await object.getComponent(SpriteImagesController).getSize();
        if(size.width === 0 || size.height === 0) {
           return  new Promise(async (res, fai) => {
                setTimeout(async () => {
                     res(await this.getSizeObject(nameObject));
                },100);
           })
        }
        return size;
    }

    caculatorSize = async () => {
        let objectNeed = ["ao", "quan", "dau"];
        let size = {
            width : 0,
            height : 0,
            y : 0
        }
        for(let i = 0; i < objectNeed.length; i++) {
            let name = objectNeed[i];
            let sizeObject = await this.getSizeObject(name);
            if(sizeObject.width > size.width) size.width = sizeObject.width;
            if(sizeObject.y < size.y) size.y = sizeObject.y;
            size.height += sizeObject.height;
        }
        return size;
    }

    updateName = async (name: string) => {
        let wait = await this.getSizeObject('dau');
        if(wait.y == 0) {
            setTimeout(() => {
                this.updateName(name);
            },100);
            return;
        }
        let size = wait.height/2 + wait.y + 30;
        this.fullName.string = name;
        this.fullName.updateRenderData();
        this.fullName.node.setPosition(0, size);
    }

    updateChat = (message:string) => {
        this.chat.getComponent(ChatController).createChat(message);
    }

    updateMy = () => {
        this.my.type = 'player';

        this.my.name = 'Luffy';
        this.updateName(this.my.name);
        this.updateSpriteFrame();
    }

    updateSkinCreateNew = (skin: object, action: string, name: string) => {
        this.my.skin = skin;
        this.my.action = {
            action : action,
            move : 'left'
        }
        this.my.type = 'player';
        this.my.name = name;
        this.updateName(this.my.name);
        this.updateSpriteFrame();
    }

    updateSpriteFrame = () => {
        let objectNeed = ["ao", "quan", "lung", "tay", "dau", "toc", "mu"];

        let check = getImages(this.my.skin['quan'],this.my.action.action);
        let y = 0;
        let x = 0;
        if(check) {
            let ycheck = check[1][1];
            if(ycheck !=0) {
                if(ycheck < 0) y+= Math.abs(ycheck);
                else y= -Math.abs(ycheck);
            }

            let xcheck = check[1][0];
            if(xcheck !=0) {
                if(xcheck < 0) x+= Math.abs(xcheck);
                else x= -Math.abs(xcheck);
            }
        }

        objectNeed.forEach((e) => {
           let images = this.my.skin[e];
           let action = this.my.action.action;
           this[e].getComponent(SpriteImagesController).updateSprite(action, images, y, this.my.skin, x);
        });
    }




    updateClick = (event: Function) => {
        let objectNeed = ["ao", "quan", "lung", "tay", "dau", "toc", "mu"];
        objectNeed.forEach((e) => {
            this[e].on(NodeEventType.TOUCH_START, () => {
                event(e);
            }, this)
        });
    }

    updateAction = (action: string) => {
        if(this.my.action.action === action) return;
        this.my.action.action = action;
        this.updateSpriteFrame();
    }

    private timeAwait: number = 0;
    private updateSprite:boolean = false;
    private playerAddCollision:boolean = false;
    updatePlayer(deltaTime: number): void {
        if(this.my.type != 'player') return;
        if(this.playerAddCollision === false) {
            this.createCollision2d();
        }
        this.timeAwait += deltaTime;
        if(this.timeAwait < 0.3) return;
        this.timeAwait = 0;
        let pos = this.body.getPosition();
        if(this.updateSprite === false) {
            pos.y -=2;
            this.updateSprite = true;
        }
        else {
            pos.y +=2;
            this.updateSprite = false;
        }
        this.body.setPosition(pos);
    }

    update(deltaTime: number) {
        this.updatePlayer(deltaTime);
        if(this.my.pos.y != this.node.getPosition().y) {
            this.my.pos.y = this.node.getPosition().y;
            this.caiBong.updateThat();
        }

    }

    private async createCollision2d():Promise<void> {
        this.playerAddCollision = true;
        let size = await this.caculatorSize();
        if(this.my.action.action != 'dungyen') {
            this.playerAddCollision = false;
            return;
        }
        let box = this.node.getComponent(BoxCollider2D);
        if(!box) {
            box = this.node.addComponent(BoxCollider2D);
        }
        box.size.width = size.width *1
        box.size.height = size.height;
        let body = this.node.getComponent(RigidBody2D);
        if(!body) {
            body = this.node.addComponent(RigidBody2D);
        }
        body.type = ERigidBody2DType.Static;
    }

    upDataMove(direct : string = 'left'):void {
        let getScale = this.node.getScale();
        let change:boolean = false;
        this.my.action.move = direct;
        if(this.my?.action?.move === 'left') {
            if(getScale.x === -1) {
                getScale.x = 1;
                change = true;
            }
        }
        if(this.my?.action?.move === 'right') {
            if(getScale.x === 1) {
                getScale.x = -1;
                change = true;
            }
        }
        if(change) {
            let clone = getScale.clone();
            clone.x  = 1
            if(this.fullName.node.getScale().x === 1) {
                clone.x = -1;
            }
            this.fullName.node.setScale(clone);
            this.node.setScale(getScale);
        }
    }

    createSprite(my : any) :void {
        this.my = my;
        this.my.action = this.my.action || {};
        this.my.action.action = this.my.action.action || 'dungyen';
        this.my.action.move = this.my.action.move || 'left';
        if(this.my.type === 'player') {
            this.updateName(this.my.name);
            this.updateSpriteFrame();
        }
    }
}


