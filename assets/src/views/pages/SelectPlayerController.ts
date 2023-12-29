import { _decorator, Component, Node, find, instantiate, NodeEventType } from 'cc';
import {bottom, deleteNotice, notice} from "db://assets/src/engine/UI";
import {coverImg} from "db://assets/src/engine/draw";
import {getListImagesSrc} from "db://assets/src/engine/cache";
import {SpriteController} from "db://assets/src/views/pages/sprite/SpriteController";
import {random} from "db://assets/src/engine/sys";
import socket from "db://assets/src/engine/socket";
const { ccclass, property } = _decorator;

@ccclass('SelectPlayerController')
export class SelectPlayerController extends Component {
    @property(Node)
    private button:Node = null;
    start() {
        this.node.active = true;
        bottom(this.button);
    }

    public outGame():void {
        this.node.active = false;
        let sceneLogin: Node = find("UI/mainLogin");
        if(sceneLogin) {
            sceneLogin.active = true;
        }
    }
    public OpenScene():void {
        this.node.active = true;
        let sceneLogin: Node = find("UI/mainLogin");
        if(sceneLogin) {
            sceneLogin.active = false;
        }
    }

    loadResource = (images: any, action: Function = null) => {
        return new Promise(async (res, fai) => {
            let loadImages = await coverImg(images);
            if(action) action();
            res(loadImages);
        });
    }

    public async loadAssets(data : any): Promise<void> {
        console.log('load nè')
        let list = [];
        let players: any = data.players;
        players.forEach(e => {
            let skin = e.skin;
            for(let name in skin) {
                let object = skin[name];
                let resource = getListImagesSrc(object);
                resource.forEach(ex => {
                    if(list.find(x => x === ex) === undefined) list.push(ex);
                });
            }
        })
        let all = [];
        let i = 0;
        let t = () => {
            i++;
            notice('LoadAssets: '+i+'/'+list.length,false);
        }
        list.forEach(e => {
            all.push(this.loadResource(e, t));
        });
        let wait = await Promise.all(all);
    }

    public async createSprite(data :any): Promise<void> {
        this.OpenScene();
        await this.loadAssets(data);
        deleteNotice();
        this.insertPlayer(data.players)
    }

    public async insertPlayer(data): void {
        for(let i = 0; i < 3; i++) {
            let list: Node = find("list/"+i, this.node);
            let caibong: Node = find("caibong", list);
            let taomoi: Node = find("taomoi", list);

            let player = find("player", list);
            if(!player) {
                player = this.clonePlayer();
                list.addChild(player);
            }

            if(data[i]) {
                if(i ===1) {
                    setTimeout(() => {
                        this.InterGame(data[i].id);
                    },200);
                }
                taomoi.active = false;
                let dataPlayer = data[i];
                let sprite: SpriteController = player.getComponent(SpriteController);
                sprite.updateSkinCreateNew(dataPlayer.skin,'dungyen',dataPlayer.name);

                let positison = caibong.getPosition();
                let postionNhanVat = player.getPosition();
                let quan = await sprite.getSizeObject('quan');
                postionNhanVat.x = positison.x;
                postionNhanVat.y = positison.y + caibong.getContentSize().height/2 + quan.height/2 -15;
                player.setPosition(postionNhanVat);
                player.active = true;
                let getALlSize = await sprite.caculatorSize();
                player.setContentSize(getALlSize.width, getALlSize.height);

                sprite.updateClick(() => {
                    this.InterGame(dataPlayer.id);
                    sprite.updateAction('a1');
                    setTimeout(() => {
                        sprite.updateAction('dungyen');
                    },500);
                });

            }
            else {
                taomoi.active = true;
                player.active = false;
            }

        }
    }

    public InterGame(id: string): void {
        console.log(id);
        socket().send(-1,[4, id]);
        notice('Đang tiến vào biển cả, xin chờ...',false);
    }

    public clonePlayer(): any {
        let coppy = instantiate(find("UI/nhanvat/0"));
        coppy.active = true;
        coppy.name = "player";
        return coppy;
    }

    newGame():void {
        let scene = find("UI/taoNV");
        if(scene) scene.active = true;
        else {
            notice('Chưa thể tạo nhân vật, vui lòng thử lại sau ít phút.');
        }
    }

    update(deltaTime: number) {
        
    }
}


