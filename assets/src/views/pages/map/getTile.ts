import cache from "db://assets/src/engine/cache";
import { _decorator, Component, Node, find, instantiate, TiledMap, assetManager, TiledMapAsset, TiledTile, TiledLayer, resources,      } from 'cc';
import {SpriteController} from "db://assets/src/views/pages/sprite/SpriteController";

function getMapTitled(url:string): any {
    if(typeof url != 'string') url = url.toString();
    url = cache.path+'maps/' + url+'.tsj';
    return new Promise((res,fai) => {

        // check cache
        let cache = assetManager.assets.get(url);
        if(cache) {
            return res(cache);
        }

        assetManager.loadAny({url : url, type : TiledMap}, (err, data) => {
            if(err) {
                console.log(err)
                fai(err);
            }
        //    assetManager.assets.add(url, data);
            // cover to tiledMap


            res(data);
        });
    });
}
export async function getTile(data) {
    let awaitList = [];
    for (let info of data) {
        let source = info.source;
        source = source.split('/');
        source = source[source.length-1];
        source = source.split('.');
        source = source[0];
        let link = ''+source+'';
        awaitList.push(getMapTitled(link));
    }
    return new Promise(async (res,fai) => {
        let list = [];
        let wait = await Promise.all(awaitList);
        wait.forEach((tiles, index) => {
            let base = data[index];
            let id = parseInt(base.firstgid);
            tiles = JSON.parse(tiles);
            tiles.tiles.forEach((tile, baseID) => {
                let obb = {
                    id : id,
                    baseID : baseID,
                    src : tile.image,
                    width : tile.imagewidth,
                    height : tile.imageheight,
                };

                if(tile.animation) {
                    obb.animation = [];
                    tile.animation.forEach(e => {
                        let info = tiles.tiles.find(e2 => e2.id === e.tileid);
                        obb.animation.push({
                            src : info.image,
                            duration : e.duration,
                        });
                    });
                }

                list.push(obb);
                id++;
            });
        })
        res(list);
    });
}