import { _decorator, Component, Node, Label, NodeEventType, find, BoxCollider2D, RigidBody2D, ERigidBody2DType, UITransform, Color, ProgressBar } from 'cc';
import cache, {getImages} from "db://assets/src/engine/cache";
import {SpriteImagesController} from "db://assets/src/views/pages/sprite/SpriteImagesController";
import {ChatController} from "db://assets/src/views/pages/sprite/ChatController";
import {sprite} from "db://assets/src/sprite";
import {CaiBongController} from "db://assets/src/views/pages/sprite/CaiBongController";
import {coverColor, coverImg} from "db://assets/src/engine/draw";
import {animationController} from "db://assets/src/views/pages/sprite/animationController";
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

    @property(Node)
    public animation: Node = null;

    public size: object = {};

    @property(ProgressBar)
    public hp: ProgressBar = null;

    @property(Node)
    public click: Node = null;

    start() {

        this.my.action = {
            action : 'dungyen',
            move : 'left'
        }
        this.node.active = true;
        //this.updateMy();
    }

    getOnly = async () => {
        if(this.my.img === 'only') return await this.getSizeObject('animation');
        return await this.getSizeObject('quan');
    }

    getSizeObject = async (nameObject: string) => {
        let object = this[nameObject];

        if(nameObject === 'animation') {
            if(object.getContentSize().width === -1) {
                return  new Promise(async (res, fai) => {
                    setTimeout(async () => {
                        res(await this.getSizeObject(nameObject));
                    },100);
                })
            }
            return {
                width : object.getContentSize().width * object.getScale().x,
                height : object.getContentSize().height * object.getScale().y,
                x : 0,
                y : 1,
            }
        }
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
        let size = {
            width : 0,
            height : 0,
            y : 1
        }
        if(this.my.img === 'only')
        {
            let objectNeed = ["animation"];

            for(let i = 0; i < objectNeed.length; i++) {
                let name = objectNeed[i];
                let sizeObject = await this.getSizeObject(name);
                if(sizeObject.width > size.width) size.width = sizeObject.width;
                if(sizeObject.y < size.y) size.y = sizeObject.y;
                size.height += sizeObject.height;
            }
            size.y = 1;
        }
        else {
            let objectNeed = ["ao", "quan", "dau"];

            for(let i = 0; i < objectNeed.length; i++) {
                let name = objectNeed[i];
                let sizeObject = await this.getSizeObject(name);
                if(sizeObject.width > size.width) size.width = sizeObject.width;
                if(sizeObject.y < size.y) size.y = sizeObject.y;
                size.height += sizeObject.height;
            }
        }
        return size;
    }

    updateName = async (name: string) => {
        let wait;
        if(this.my.img === 'only') wait = await this.getSizeObject('animation');
        else wait = await this.getSizeObject('dau');
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

        let colorName = {
            npc : "#fff200",
            mob : "#ff0000",
            player : "#f4ffe8",
        }
        let colorx = colorName[this.my.type];
        this.fullName.color = coverColor(colorx);
        this.fullName.updateRenderData();

        if(this.hp)
        {
            let bar = this.hp.node;
            bar.setPosition(0, this.fullName.node.getPosition().y + 20);
        }

        if(this.my.type === 'npc') {
            this.hp.node.active = false;
        }

        if(this.click) {
            this.click.setPosition(0, this.hp.node.getPosition().y + 20);
        }



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



    private timeAwait: number = 0;
    private updateSprite:boolean = false;
    private playerAddCollision:boolean = false;
    updatePlayer(deltaTime: number): void {
        if(this.playerAddCollision === false) {
            this.createCollision2d();
        }
        if(this.my.img !== 'object' && this.my.type != 'player') return;
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

    private realy: boolean = false;
    public async loadAssets(): Promise<void> {
        let list = [];
        let PromiseList = [];
        if(this.my.img === 'object') {
            let skin = this.my.skin;
            if(skin.id && skin.id.length >=1) {
                let id = skin.id;
                let get = cache.images.filter(e => e.id === id);
                get.forEach(e => {
                    let name = e.name;
                    let type = e.type;
                    this.my.skin[type] = name;
                })
            }
            let objectNeed = ["ao", "quan", "lung", "tay", "dau", "toc", "mu"];
            objectNeed.forEach((e) => {
                let name = this.my.skin[e];
                let images = cache.images.find(e => e.name === name);
                if(images) {
                    let actions = images.actions;
                    for(let action in actions) {
                        let src = actions[action][0];
                        src.forEach(ex => {
                            if(list.find(x => x === ex) === undefined) list.push(ex);
                        });
                    }
                }
            });
            list.forEach(e => {
                PromiseList.push(coverImg(e));
            })
            await Promise.all(PromiseList);
        }
        else {
            let src = this.my.scripts.script.src;
            await coverImg(src);
        }
        this.realy = true;
    }
    async createSprite(my : any) :Promise<void> {
        this.my = my;
        this.my.action = this.my.action || {};
        this.my.action.action = this.my.action.action || 'dungyen';
        this.my.action.move = this.my.action.move || 'left';
        this.my.img = this.my.img || 'object';
        await this.loadAssets();
        if(this.my.img === 'object') {
            this.updateName(this.my.name);
            this.updateSpriteFrame();
        }
        else {
            this.ao.active = false;
            this.quan.active = false;
            this.dau.active = false;
            this.lung.active = false;
            this.tay.active = false;
            this.toc.active = false;
            this.mu.active = false;
            this.animation.getComponent(animationController).updateScript({
                type : this.my.type,
                data : this.my.scripts,
                id : this.my.id,
            });
            this.animation.getComponent(animationController).updateAction(this.my.action.action);
            this.updateName(this.my.name);
        }
        this.updateOnDat();
    }

    updateOnDat():void {
        let my = this.my;
        if((my.type === 'npc' || my.type === 'mob') && my.img === 'object') {
            this.quan.getComponent(SpriteImagesController).updateOndat(my.type,my.pos, this);
        }
        if((my.type === 'npc' || my.type === 'mob') && my.img === 'only') {
            this.animation.getComponent(animationController).updateOndat(my.type,my.pos, this);
        }
    }

    updateAction = (action: string) => {
        if(this.my.action.action === action) return;
        this.my.action.action = action;
        this.updateSpriteFrame();
    }

    update(deltaTime: number) {
        let loading = find("UI/loading");
        if(loading && loading.active === true) return;
        this.updatePlayer(deltaTime);
        if(this.my.pos && this.my.pos.y != this.node.getPosition().y) {
            this.my.pos.y = this.node.getPosition().y;
            this.caiBong.updateThat();
        }
        if(cache.click === this.my.id) {
            this.click.active = true;
        }
        else {
            this.click.active = false;
        }

    }
}


