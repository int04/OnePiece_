import { _decorator, Component, Node, assetManager, AnimationClip, Animation, Texture2D, UITransform , Sprite, find } from 'cc';
import {coverImg, crop} from "db://assets/src/engine/draw";
const { ccclass, property } = _decorator;

@ccclass('animationController')
export class animationController extends Component {
    public script: any = null;
    public type : string = 'npc';
    public id : string = '';
    start() {
    }

    updateScript(script):void {
        this.script = script.data;
        this.type = script.type;
        this.id = script.id;
    }

    async updateAction(action: string = 'dungyen'): Promise<void> {
        let name_animation= this.script.script.src + '_' + action;
        // check exitst animation from node

        let sprite = this.node.getComponent(Sprite);
        if(!sprite) {
            sprite = this.node.addComponent(Sprite);
        }

        let animation = this.node.getComponent(Animation);
        if(!animation) {
            animation = this.node.addComponent(Animation);
        }
        let clip = animation.getState(name_animation);
        if(!clip) {
            let isExist = assetManager.assets.get(name_animation) as AnimationClip;
            if(isExist) {
                animation.addClip(isExist, name_animation);
                animation.play(name_animation);
                return;
            }
            let texture = await coverImg(this.script.script.src);
            let farmes = [];

            // @ts-ignore
            let width = texture.width;
            // @ts-ignore
            let height = texture.height/this.script.script.num;
            let fps = this.script.script.fps || 30;
            this.node.getComponent(UITransform).setContentSize(width, height);
            let actions = this.script.script.action[action];
            let scale = this.script.script.scale || [1,1];
            this.node.setScale(scale[0], scale[1]);
            if(actions) {
                actions.forEach(i => {
                    let frame = crop(texture, 0, height*i, width, height);
                    farmes.push(frame);
                })
                let clip = AnimationClip.createWithSpriteFrames(farmes, fps);
                clip.name = name_animation;
                if(action === 'dungyen' || action === 'move') {
                    clip.wrapMode = AnimationClip.WrapMode.loop;
                }
                else {
                    clip.wrapMode = AnimationClip.WrapMode.Normal;
                }
                clip.speed = 0.1;
                animation.addClip(clip, name_animation);
                animation.play(name_animation);
                animation.playOnLoad = true;

                animation.on('finished', () => {
                    this.updateAction('dungyen');
                })
                // add to cache
                assetManager.assets.add(name_animation, clip);
            }
        }
        else {
            animation.play(name_animation);
        }

    }

    public caculatorDXDY(position1 : object, position2 : object) : number {
        let dx  = position1['x'] - position2['x'];
        let dy  = position1['y'] - position2['y'];
        let d = Math.sqrt(dx*dx + dy*dy);
        return d;
    }

    public async updateOndat(type: string, position : any, self : any): Promise<any> {
        let loading = find("UI/loading");
        if(loading && loading.active === true) return setTimeout(() => {
            this.updateOndat(type, position, self);
        },100);
        let dat: Node = find("game/dat");
        let k : number = null;
        let dx : number = null;
        for(let i = 0; i < dat.children.length; i++) {
            if(dat.children[i].name !== 'dat') continue;
            let pos = dat.children[i].getPosition();
            let d = this.caculatorDXDY(position, pos);
            if(dx === null || dx > d) {
                dx = d;
                k = i;
            }
        }
        let data  = {
            y :  dat.children[k].getPosition().y,
            height : dat.children[k].getComponent(UITransform).height,
        };
        let quanSize = await this.getSize();
        let pos = position;

        let bouns = 10;
        if(type ==='mob') {
            bouns = 28;
        }

        pos.y = data.y + data.height/2 + quanSize.height/2 - bouns;
        pos.z = 0;
        self.node.setPosition(pos);

    }

    async getSize(): Promise<any> {
        // @ts-ignore
        let size = this.node.getContentSize();
        size.width = size.width * this.node.getScale().x;
        size.height = size.height * this.node.getScale().y;
        return size;
    }

    update(deltaTime: number) {
        
    }
}


