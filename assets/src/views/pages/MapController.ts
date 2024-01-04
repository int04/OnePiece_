import cache from "db://assets/src/engine/cache";
import { _decorator, Component, Node, find, instantiate, TiledMap, assetManager, TiledMapAsset, TiledTile, TiledLayer, resources, SpriteFrame , Texture2D , Sprite, UITransform, BoxCollider2D, RigidBody2D, ERigidBody2DType , RenderTexture  } from 'cc';
import {SpriteController} from "db://assets/src/views/pages/sprite/SpriteController";
import {getTile} from "db://assets/src/views/pages/map/getTile";
import {exportTitled} from "db://assets/src/views/pages/map/exportTiled";
import {LoadingController} from "db://assets/src/views/pages/map/LoadingController";
import socket from "db://assets/src/engine/socket";
import {loading, notice} from "db://assets/src/engine/UI";
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

export let getSprite = (id: any = null) => {
    if(id === null) {
        id = cache.my.id;
    }
    if(id === null) return null;
    if(typeof id === 'number') {
        id = id.toString();
    }
    let node = find("game/player/"+id);
    if(node) {
        return node;
    }
    return null;
}

export function getSpriteComponent(id : any) {
    if(typeof id === "object") {
        return id.getComponent(SpriteController);
    }
    let node = getSprite(id);
    if(node) {
        return node.getComponent(SpriteController);
    }
    return null;
}

export function createSprite(my : any) {
    if(typeof my.id === 'number') {
        my.id = my.id.toString();
    }
    let parent = find("game/player");
    let uid = find("game/player/"+my.id);
    if(uid) {
        let sprite = uid.getComponent(SpriteController);
        sprite.createSprite(my);
    }
    else {
        let demo = find("game/demo/0");
        let clone = instantiate(demo);
        clone.name = my.id;
        clone.active = true;
        clone.setPosition(my.pos.x, my.pos.y);
        clone.getComponent(SpriteController).createSprite(my);

        parent.insertChild(clone, 0);


    }

    let sort = find("game/player");
    let playerID = cache.my.id;
    sort.children.sort((a,b) => {
        let AMy = a.getComponent(SpriteController).my;
        let BMy = b.getComponent(SpriteController).my;
        const typeOrder = {
            'zone' : 1,
            'npc' : 2,
            'mob' : 3,
            'player' : 4,
        };
        let aType = typeOrder[AMy.type];
        let bType = typeOrder[BMy.type];
        if(aType !== bType) {
            return aType - bType;
        }
        else if(AMy.type === 'player' && BMy.type === 'player') {
            if(AMy.id === playerID) {
                return 1;
            }
            if(BMy.id === playerID) {
                return -1;
            }
        }
        return 0;
    });
}

export function goto(id: any, zone : any = null, x: any = null, y: any = null) {
    loading();
    socket().send(-2,[1, [id, zone, x, y]]);
}

export function updatePos(id: any, zone : any = null, x: any = null, y: any = null) {
    cache.my.pos.map = id;
    if(x !== null && y !== null) {
        // @ts-ignore
        if(cache.my.id != null) {
            // @ts-ignore
            cache.my.pos.x = x;
            // @ts-ignore
            cache.my.pos.y = y;
            let sprite = getSprite(cache.my.id);
            if(sprite) {
                let pos = sprite.getPosition();
                pos.x = x;
                pos.y = y;
                sprite.setPosition(pos);
            }
        }
    }
}


export function listPlayer(data : object): void {
    let npcs = data['npc'];
    npcs.forEach(npc => {
        let my : any = {
            id : npc.id,
            name : npc.name,
            pos : {
                x : npc.pos[0],
                y : npc.pos[1],
            },
            action : {
                action : 'dungyen',
                move : 'left'
            },
            skin: {},
            scripts : npc,
            img : 'object',
        };

        my.type = 'npc';
        if(npc.script && npc.script.type === 'img') {
            my.img = 'object';
            for(let name in npc.script) {
                if(name !== 'type') {
                    my.skin[name] = npc.script[name];
                }
            }
        }

        if(npc.script && npc.script.type === 'only') {
            my.img = 'only';
        }

        createSprite(my);
    })

    let mobs = data['mob'];
    mobs.forEach(mob => {
        let my : any = {};
        my.scripts = mob.data;
        my.id = mob.id;
        my.pos = {
            x : mob.x,
            y : mob.y,
            zone : mob.zone,
            map : mob.map,
        }
        my.name = mob.data.name;
        my.info = mob.info;
        my.eff = mob.eff;
        my.info.coban = mob.coban || {};
        my.info.coban.speed = mob.data.speed || 1;
        my.img = mob.data.script.type;
        if( mob.data.script.type === 'img') {
            my.skin = {};
            for(let name in mob.data.script) {
                if(name !== 'type') {
                    my.skin[name] = mob.data.script[name];
                }
            }
            my.img = 'object';
        }
        my.type = 'mob';
        createSprite(my);
    });

}


export async function loadMap(name:string): Promise<any> {

    let loading = find("UI/loading");
    if(loading) {
        loading.active = true;
        loading.getComponent(LoadingController).updateMap(name);
    }
    return;

}