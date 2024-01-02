import cache from "db://assets/src/engine/cache";
import { _decorator, Component, Node, find, instantiate, TiledMap, assetManager, TiledMapAsset, TiledTile, TiledLayer, resources, SpriteFrame , Texture2D , Sprite, UITransform, BoxCollider2D, RigidBody2D, ERigidBody2DType , RenderTexture  } from 'cc';
import {SpriteController} from "db://assets/src/views/pages/sprite/SpriteController";
import {getTile} from "db://assets/src/views/pages/map/getTile";
import {exportTitled} from "db://assets/src/views/pages/map/exportTiled";
import {LoadingController} from "db://assets/src/views/pages/map/LoadingController";
const { ccclass, property } = _decorator;

export function resetAll() {
    let node = find("game/player");
    if(node) {
        node.destroyAllChildren();
    }
}

export function reset() {
    // reset all, but not reset cache.my.id
    let node = find("game/player");
    let getChild = node.children;
    getChild.forEach(e => {
        if(e.name !== cache.my.id) {
            e.destroy();
        }
    });
}

export let getSprite = (id: any) => {
    if(typeof id === 'number') {
        id = id.toString();
    }
    let node = find("game/player/"+id);
    if(node) {
        return node;
    }
    return null;
}

export function createSprite(my : any) {
    if(typeof my.id === 'number') {
        my.id = my.id.toString();
    }
    let uid = find("game/player/"+my.id);
    if(uid) {
        let sprite = uid.getComponent(SpriteController);
        sprite.createSprite(my);
    }
    else {
        let demo = find("game/demo/0");
        let clone = instantiate(demo);
        clone.parent = find("game/player");
        clone.name = my.id;
        clone.active = true;
        clone.setPosition(my.pos.x, my.pos.y);
        clone.getComponent(SpriteController).createSprite(my);
    }
}

export function goto(id: any, zone : any = null, x: any = null, y: any = null) {
    cache.my.pos.map = id;
    loadMap('map6')
    return;
    if(x !== null && y !== null) {
        // @ts-ignore
        if(self.my.id >=1) {
            // @ts-ignore
            let sprite = self.getSprite(self.my.id);
            sprite.x = x;
            sprite.y = y;
            // @ts-ignore
            self.my.pos.x = x;
            // @ts-ignore
            self.my.pos.y = y;
        }
    }
}






export async function loadMap(name:string): Promise<any> {

    let loading = find("UI/loading");
    if(loading) {
        loading.active = true;
        loading.getComponent(LoadingController).updateMap(name);
    }
    return;

}