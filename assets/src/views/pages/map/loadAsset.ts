import cache from "db://assets/src/engine/cache";
import { _decorator, native, UITransform, UIOpacity, assetManager, find, SpriteFrame, Texture2D} from 'cc';


let srcHas = [];
let PromiseLoadAsset = [];
let countLoaded = 0;



let CallPromise = (url, callback) => {
    if(typeof url != 'string') url = url.toString();
    return new Promise((res,fai) => {
        let fullurl = cache.path + url+'';
        // check is exist
        let isExist = assetManager.assets.get(fullurl) as Texture2D;
        if(isExist) {
            return res(isExist)
        }
        assetManager.loadRemote(fullurl, (err, images) => {
            // cover to texture
            let texture = new Texture2D();
            texture.image = images;
            assetManager.assets.add(fullurl, texture);
            res(texture);
        });
    })
}

let insert = (url, callback) => {
    if(srcHas.indexOf(url) === -1) {
        srcHas.push(url);
        PromiseLoadAsset.push(CallPromise(url, callback));
    }
}



export function loadAssetsImages(dataMap)  {
    srcHas = [];
    PromiseLoadAsset = [];
    countLoaded = 0;

    console.log(dataMap)

    let updatedText = () => {
        console.log();
    }


    return new Promise(async  (res,fai) => {
        dataMap.forEach(e => {
            let url = 'maps/'+e.src;
            insert(url, updatedText);
            if(e.animation) {
                e.animation.forEach(e2 => {
                    let url = 'maps/'+e2.src;
                    insert(url, updatedText);
                });
            }
        });
        let timeLoad = Date.now();
        await Promise.all(PromiseLoadAsset);
        //console.log('load assetImg',Date.now() - timeLoad,'ms')
        res(true);
    })

}