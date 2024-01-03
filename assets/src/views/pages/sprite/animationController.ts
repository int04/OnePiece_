import { _decorator, Component, Node, assetManager, AnimationClip, Animation, Texture2D, UITransform , Sprite } from 'cc';
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
        let clip = animation. getState(name_animation);
        if(!clip) {
            let isExist = assetManager.assets.get(name_animation) as AnimationClip;
            if(isExist) {
                animation.addClip(isExist, name_animation);
                animation.play(name_animation);
                return;
            }
            let texture = await coverImg(this.script.script.src);
            let farmes = [];
            let width = texture.width;
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
                clip.wrapMode = AnimationClip.WrapMode.Loop;
                clip.speed = 0.1;
                animation.addClip(clip, name_animation);
                animation.play(name_animation);
                animation.playOnLoad = true;
                // add to cache
                assetManager.assets.add(name_animation, clip);
            }
        }
        else {
            animation.play(name_animation);
        }


    }

    update(deltaTime: number) {
        
    }
}


