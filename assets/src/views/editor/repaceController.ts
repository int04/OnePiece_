import { _decorator, Component, Node, find, instantiate, Sprite, UITransform } from 'cc';
import {edittorController} from "db://assets/src/views/editor/edittorController";
import cache from "db://assets/src/engine/cache";
import {coverSpriteFrame} from "db://assets/src/engine/draw";
const { ccclass, property } = _decorator;

@ccclass('repaceController')
export class repaceController extends Component {
    @property({
        type: Node,
    })
    private layout: Node = null;
    start() {
        this.node.active = true;
        setTimeout(() => {
            this.updateController();
        },1000);
    }

    close():void {
        this.node.active = false;
    }

    updateChange(oldName:string, newName:string):void {
        console.log(oldName,newName);
        let data = find("Canvas/editor");
        let list = data.getComponent(edittorController).list;
        let img = [];
        for(let tendata in list) {
            let data = cache.images.find(e => e.name == list[tendata]);
            if(data) {
                let actions = data.actions;
                for(let action in actions) {
                    let frames = actions[action][0];
                    frames.forEach((item: any, index: number) => {
                        if(item === oldName) {
                            frames[index] = newName;
                        }
                    });
                }
            }
        }
    }

    updateController(name:string = null):void {
        let data = find("Canvas/editor");
        let list = data.getComponent(edittorController).list;
        let img = [];
        for(let tendata in list) {
            if(name) tendata = name;
            let data = cache.images.find(e => e.name == list[tendata]);
            if(data) {
                let actions = data.actions;
                for(let action in actions) {
                    let frames = actions[action][0];
                    frames.forEach((item: any, index: number) => {
                        if(!img.find(x => x === item)) {
                            img.push(item);
                        }
                    });
                }
            }
        }

        let old = this.layout.children;
        old.forEach((item: Node) => {
            if(item.name !== 'demo') {
                item.destroy();
            }
        });

        let demo = find("edit/ScrollView/view/content/main_goc/demo");
        demo.active = false;

        img.forEach((item: string) => {
            let node = instantiate(demo);
            node.active = true;
            node.name = item;
            node.parent = this.layout;
            let sprite = find("sprite",node);
            sprite.name = item;
            coverSpriteFrame(item).then((res: any) => {
                sprite.getComponent(Sprite).spriteFrame = res;
                sprite.getComponent(UITransform).width = res.getOriginalSize().width;
                sprite.getComponent(UITransform).height = res.getOriginalSize().height;
            });
        });

    }

}


