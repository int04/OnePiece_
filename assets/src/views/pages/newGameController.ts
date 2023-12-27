import { _decorator, Component, Node, find, NodeEventType, instantiate, EditBox } from 'cc';
import cache, {getListImagesSrc} from "db://assets/src/engine/cache";
import {coverImg} from "db://assets/src/engine/draw";
import {bottom, deleteNotice, notice} from "db://assets/src/engine/UI";
import {coppy} from "db://assets/src/engine/canvas";
import {SpriteController} from "db://assets/src/views/pages/sprite/SpriteController";
import {random} from "db://assets/src/engine/sys";
import socket from "db://assets/src/engine/socket";
const { ccclass, property } = _decorator;

@ccclass('newGameController')
export class newGameController extends Component {
    public sprite: object = {
        ao : ["lETxXc94Cy", "e8UyIzB48T", "J5tu4xb158","tL1wd5mca1",'iYIlvVCAhc'],
        quan: ['TIo6aWotHG','zU1wE8a7vt','tFjHYMY4Hj','B2cZtWgtAk','gprctPUJcF'],
        lung: ['gr0VkEI8d5','gr0VkEI8d5','gr0VkEI8d5','MqYIllkSou','gr0VkEI8d5'],
        tay: ['f8EGgmi32Z','JiECJbgCRK','5iDyrM74ma','qv3QwVEFDA','arh9l3zW7i'],
        dau: ['okeR9y6ukZ','okeR9y6ukZ','okeR9y6ukZ','okeR9y6ukZ','okeR9y6ukZ'],
        toc: ['yGgXC0kOnB','0W0OgjStR3','0ACl0XOh4o','I8l0536BOt','9bDlyCxlMZ'],
        mu: ['1o0381F8Ia','MZCMX3TV2r','Di4UMLqBuz','mEzteA1Mr1','T3YBh6UyL3'],
    };
    public nhanVat:number = 0;
    @property(Node)
    private background:Node = null;
    @property(Node)
    private button1:Node = null;
    @property(Node)
    private button2:Node = null;
    @property(EditBox)
    private nameInput:EditBox = null;
    start() {
        this.node.active = true;
        this.background.on(NodeEventType.TOUCH_START, this.btnClick, this);
        this.prebload();
        bottom(this.button1);
        bottom(this.button2);
    }
    public comeback():void {
        this.node.active = false;
    }

    public submit():void {
        let name = this.nameInput.string;
        if(name.length<4 || name.length>20) {
            notice('Tên nhân vật từ 5 đến 20 ký tự',true);
            return;
        }
        socket().send(-1,[3,[name, this.nhanVat]]);
        notice('Xin chờ...',false)
    }

    public btnClick():void {}

    loadResource = (images: any, action: Function = null) => {
        return new Promise(async (res, fai) => {
           let loadImages = await coverImg(images);
           if(action) action();
           res(loadImages);
        });
    }

    prebload =async () => {
        if(cache.start === false) {
            setTimeout(() => {
                this.prebload();
            },100);
            return;
        }
        // lufy, zoro, sanji, nami, ussop

        let sprite = this.sprite;

        let all = [];
        let list = [];
        for(let name in sprite) {
            let object = sprite[name];
            object.forEach(e => {
                let resource = getListImagesSrc(e);
                resource.forEach(ex => {
                    if(list.find(x => x === ex) === undefined) list.push(ex);
                });
            });
        }

        let i = 0;
        let t = () => {
            i++;
            notice('LoadAssets: '+i+'/'+list.length,false);
        }
        list.forEach(e => {
           all.push(this.loadResource(e, t));
        });
       let wait = await Promise.all(all);
       deleteNotice()
        setTimeout(() => {
            this.choose(0,2);
        },1000);

    }

    public choose(event : any, customData : number):void {
        if(this.nhanVat != 0) {
            let old = find('UI/taoNV/NhanVat/'+this.nhanVat+'/click');
            old.active = false;
        }
        let nhanVat = customData;
        this.nhanVat = nhanVat;
        let New = find('UI/taoNV/NhanVat/'+nhanVat+'/click');
        if(New) {
            New.active = true;
        }

        this.getID(this.nhanVat);
    }

    public async getID(nhanVat : number): Promise<void> {
        let parent: Node = find("show",this.node);
        let caibong : Node = find("caibong",parent);
        let showPre : Node = find("pre",parent);
        if(!showPre) {
            let coppy = instantiate(find("UI/nhanvat/0"));
            coppy.active = true;
            coppy.name = "pre";
            coppy.parent = parent;
            showPre = find("pre",parent);
        }
        let skin = {};
        for(let name in this.sprite) {
            let object = this.sprite[name];
            skin[name] = object[nhanVat-1];
        }
        let name = ['Võ sĩ','Kiếm khách','Đầu bếp','Hoa tiêu','Xạ thủ'];
        let text = [
            "Sức mạnh của ta là nắm đấm, sức mạnh của đôi tay là vô hạn",
            "Thanh kiếm của ta có thể chém đứt mọi kẻ thù, hoặc cũng có thể dùng để gọt táo",
            "Đôi tay của ta dùng để nấu ăn cho mọi người, vũ khí mạnh nhất của ta là đôi chân",
            "Hành trình trên biển không thể thiếu một người có khả năng điều kiển thời tiết, ta sẽ là người đó",
            "Ta có thể bắn trúng mọi thứ, kể cả trái tim của em",
        ];
        let sprite:SpriteController = showPre.getComponent(SpriteController);
        setTimeout(async () => {
            sprite.updateSkinCreateNew(skin,(random(1,100) < 50 ? 'dungyen' : 'move'),name[nhanVat-1]);
            let positison = caibong.getPosition();
            let postionNhanVat = showPre.getPosition();
            let quan = await sprite.getSizeObject('quan');
            postionNhanVat.x = positison.x;
            postionNhanVat.y = positison.y + caibong.getContentSize().height/2 + quan.height/2 -15;
            showPre.setPosition(postionNhanVat);
            sprite.updateChat(text[nhanVat-1]);
        },100);


    }

    private time : number = 10;
    update(deltaTime: number) {
        this.time += deltaTime;
        if(this.time >=10) {
            this.time = 0;
            let value = random(1,100);
            let action = 'dungyen';
            if(value > 50) action = 'move';
            let parent: Node = find("show",this.node);
            let showPre : Node = find("pre",parent);
            if(showPre) {
                let sprite:SpriteController = showPre.getComponent(SpriteController);
                sprite.updateAction(action);
            }
        }
    }
}


