import cache from "db://assets/src/engine/cache";
import { _decorator, Component, Node, find, instantiate, TiledMap, assetManager, TiledMapAsset, TiledTile, TiledLayer, resources, SpriteFrame , Texture2D , Sprite, UITransform, BoxCollider2D, RigidBody2D, ERigidBody2DType   } from 'cc';
import {SpriteController} from "db://assets/src/views/pages/sprite/SpriteController";
import {getTile} from "db://assets/src/views/pages/map/getTile";
import {exportTitled} from "db://assets/src/views/pages/map/exportTiled";
import {loadAssetsImages} from "db://assets/src/views/pages/map/loadAsset";
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
        if(self.my.id >=1) {
            let sprite = self.getSprite(self.my.id);
            sprite.x = x;
            sprite.y = y;
            self.my.pos.x = x;
            self.my.pos.y = y;
        }
    }
}

export function getMapTitled(url:string): any {
    if(typeof url != 'string') url = url.toString();
    url = cache.path+'maps/map/' + url+'.tmj';
    return new Promise((res,fai) => {

        // check cache
        let cache = assetManager.assets.get(url);
        if(cache) {
            return res(cache);
        }

        assetManager.loadAny({url : url, type : TiledMap}, (err, data) => {

         //   assetManager.assets.add(url, data);
            // cover to tiledMap


            res(data);
        });
    });
}

let textureSpritePrame = (link: string ) => {
    let name = link+"spritetexture";
    let isExist = assetManager.assets.get(name) as SpriteFrame;
    if(isExist) {
        return (isExist);
    }
    else {
        let isExist = assetManager.assets.get(link) as Texture2D;
        const spriteFramec = new SpriteFrame();
        spriteFramec.texture = isExist;
        assetManager.assets.add(name, spriteFramec);
        return (spriteFramec);
    }
}

let texture = (link: string ) => {
    let name = link+"Node";
    let isExist = assetManager.assets.get(name);
    if(isExist) {
        return instantiate(isExist);
    }
    else {
        let ob = new Node();
        ob.name = 'texure';
        const text = ob.addComponent(Sprite);
        text.spriteFrame = textureSpritePrame(link);
        assetManager.assets.add(name, ob);
        return ob;
    }

}

export async function loadMap(name:string): Promise<any> {
    let map = await getMapTitled(name);

    let json = JSON.parse(map);

    let assets = await getTile(json.tilesets);
    let dataMap = exportTitled(json, assets);
    await loadAssetsImages(dataMap);
    console.log("===============")
    let path = find("game/dat");
    let che = find("game/che");
    dataMap.forEach(e => {
        let link = cache.path+'maps/' + e.src;
        let sprite = texture(link);
        sprite.name = e.name;
        if(e.name === 'che') {
            sprite.parent = che;
        }
        else {
            sprite.parent = path;
        }


        let scale = 0.8;



        let width = e.width * scale
        let height = e.height * scale

        sprite.getComponent(UITransform).width = width;
        sprite.getComponent(UITransform).height = height;

        if(e.name === 'dat' || e.name === 'camdi'){
            //BoxCollider2D, RigidBody2D
            let box = sprite.addComponent(BoxCollider2D);
            box.size.width = width;
            box.size.height = height;
            box.group = 1;
            let body = sprite.addComponent(RigidBody2D);
            body.type = ERigidBody2DType.Static;
            body.group = 1;


        }

        let x = 0;
        let y = 0;
        if(e.type === 'OBJECT') {
            x = e.x * scale
            y = e.y  * scale
            y-= (96 * scale)/2;
            sprite.setAnchorPoint(0.5, 0);

        }
        else {
            x = e.x *  width;
            y = e.y * height
        }

        if(y > 0) {
            y = -y;
        }else {
            y = Math.abs(y)
        }

        if(e.type === 'OBJECT') {

        }



        x += width/2;



        sprite.setPosition(x, y);


    });

}