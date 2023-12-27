import { _decorator, Component, Node, Label } from 'cc';
import {getImages} from "db://assets/src/engine/cache";
import {SpriteImagesController} from "db://assets/src/views/pages/sprite/SpriteImagesController";
import {ChatController} from "db://assets/src/views/pages/sprite/ChatController";
const { ccclass, property } = _decorator;

@ccclass('SpriteController')
export class SpriteController extends Component {

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
    start() {
        this.updateMy();
    }

    getSizeObject = async (nameObject: string) => {
        let object = this[nameObject];
        let size = await object.getComponent(SpriteImagesController).getSize();
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

    updateMy = () => {
        this.my.type = 'player';
        this.my.skin = {
            "ao": "iYIlvVCAhc",
            "quan": "gprctPUJcF",
            "lung": "gr0VkEI8d5",
            "tay": "arh9l3zW7i",
            "dau": "okeR9y6ukZ",
            "toc": "9bDlyCxlMZ",
            "mu": "T3YBh6UyL3"
        }
        this.my.action = {
            action : 'dungyen',
            move : 'left'
        }
        this.my.name = 'Luffy';
        this.updateName(this.my.name);
        setTimeout(() => {
            this.updateSpriteFrame();
            setTimeout(() => {
                this.chat.getComponent(ChatController).createChat('đĩ mẹ vãi lồn thật');
            },300);
        },1000);


    }

    updateSpriteFrame = () => {
        let objectNeed = ["ao", "quan", "lung", "tay", "dau", "toc", "mu"];

        let check = getImages(this.my.skin['quan'],this.my.action.action);
        let y = 0;
        if(check) {
            let ycheck = check[1][1];
            if(ycheck < 0) y+= Math.abs(ycheck);
            else y-= Math.abs(ycheck);
        }

        objectNeed.forEach((e) => {
           let images = this.my.skin[e];
           let action = this.my.action.action;
           this[e].getComponent(SpriteImagesController).updateSprite(action, images, y, this.my.skin);
        });
    }

    private timeAwait: number = 0;
    private updateSprite:boolean = false;
    updatePlayer(deltaTime: number): void {
        if(this.my.type != 'player') return;
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
    }
}


