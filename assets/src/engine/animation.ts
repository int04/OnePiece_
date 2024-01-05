import { _decorator, Component, Node, assetManager, AnimationClip, Animation, Texture2D, UITransform , Sprite, find } from 'cc';
import {coverImg, crop} from "db://assets/src/engine/draw";

export async function createClipY(src : string, bigWidth : number, bigHeight : number, num : number, speed : number = 0.1, fps : number = 30, loop : boolean = true, path = null): Promise<AnimationClip> {
    let name = src;
    if(path) name = path + '/' + name;
    let isExist = assetManager.assets.get(name) as AnimationClip;
    if(isExist) return isExist;

    let texture = await coverImg(src,path);
    let farmes = [];

    let width = bigWidth;
    let height = bigHeight/num;
    for(let i = 0; i < num; i++) {
        let frame = crop(texture, 0, height*i, width, height);
        farmes.push(frame);
    }
    let clip = AnimationClip.createWithSpriteFrames(farmes, fps);
    clip.wrapMode = loop ? AnimationClip.WrapMode.Loop : AnimationClip.WrapMode.Normal;
    clip.speed = speed;
    clip.name = name;
    // add to cache
    assetManager.assets.add(name, clip);
    return clip;
}