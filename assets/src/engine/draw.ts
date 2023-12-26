import { _decorator, native, UITransform, UIOpacity, assetManager, find, SpriteFrame, Texture2D} from 'cc';
import cache from "db://assets/src/engine/cache";
import {tool} from "db://assets/src/engine/tool";
import {node} from "db://assets/src/engine/canvas";
const { ccclass, property } = _decorator;

let getImgLocal = async (name : string, path : string = 'icon') => {
    return new Promise((res,fai) => {
        // check is exist
        let isExist = cc.resources.get(path+"/"+name+"/spriteFrame");
        if(isExist) {
            return res(isExist)
        }
        cc.resources.load(path+"/"+name+"/spriteFrame", cc.spriteFrame ,(err, texture) => {
            res(texture);
        });
    })
}

let coverImg = async (url: string, path = null) => {
    if(typeof url != 'string') url = url.toString();
    return new Promise((res,fai) => {
        let fullurl = cache.path + url+'.png';
        if(path) {
            fullurl = cache.path + path +'/'+ url+'.png';
        }
        let name = fullurl.split('/').pop();
        // check is exist
        let isExist = assetManager.assets.get(name) as Texture2D;
        if(isExist) {
            return res(isExist)
        }
        assetManager.loadRemote(fullurl, (err, images) => {
            // cover to texture
            let texture = new Texture2D();
            texture.image = images;
            assetManager.assets.add(name, texture);
            res(texture);
        });
    })
}

export let coverSpriteFrame = async (url: string, path = null) => {
    return new Promise( async (res, fai) => {
        let texture = await coverImg(url, path);

        // check exist spriteFrame
        let name = url;
        let isExist = assetManager.assets.get(name) as SpriteFrame;
        if(isExist) {
            return res(isExist)
        }

        const spriteFramec = new SpriteFrame();
        spriteFramec.texture = texture;
        assetManager.assets.add(name, spriteFramec);
        res(spriteFramec);
    })
}

let Sprite = async (name, path = null) => {
    // @ts-ignore
    return new Promise(async (res,fai) => {
        let texture = await coverImg(name, path);
        const node = new cc.Node();
        const spriteFrame = new cc.SpriteFrame();
        spriteFrame.texture = texture;
        const sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = spriteFrame;

        res(tool(node))
    })
}

let crop = (texture, x, y, width, height) => {
    /*
    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(texture.image, x, y, width, height, 0, 0, width, height);
    return canvas;
     */
    let rect = new cc.Rect(x, y, width, height);
    let spriteFrame = new cc.SpriteFrame();
    spriteFrame.texture = texture;
    spriteFrame.setRect(rect);
    return spriteFrame;
}


let coverColor = (color: string) => {
    // example: #ffffff
    let r = parseInt(color.substr(1,2), 16);
    let g = parseInt(color.substr(3,2), 16);
    let b = parseInt(color.substr(5,2), 16);
    return cc.color(r,g,b);
}

let square = (fill = [], line = []) => {
    let color = fill[0] || '#ffffff';
    let alpha = fill[1] || 1;
    let width = fill[2] || 100;
    let height = fill[3] || 100;
    let node = new cc.Node('new square');
    let graphics = node.addComponent(cc.Graphics);
    graphics.fillColor = coverColor(color);
    graphics.fillAlpha = alpha;
    graphics.rect(0, 0, width, height);

    let colorLine = line[0] || false;
    let widthLine = line[1] || 1;
    let alphaLine = line[2] || 1;
    if(colorLine) {
        // strokeColor
        graphics.strokeColor = coverColor(colorLine);
        graphics.strokeAlpha = alphaLine;
        graphics.lineWidth = widthLine;
        graphics.stroke();

    }

    graphics.fill();

    node.setAnchorPoint(0,0)
    return tool(node);
}

let Node = (name = '') => {
    let c = new cc.Node(name);
    c.addComponent(cc.Sprite);
    return tool(c);

}

let Text = (text = '', font = null, size = 20, color = '#ffffff') => {
    let node = new cc.Node('new text');
    let label = node.addComponent(cc.Label);
    label.string = text;
    label.fontSize = size;
    label.lineHeight = size;
    label.fontFamily = font;
    label.color = coverColor(color);
    return tool(node);

}

let Link = (url) => {
    return cache.path + url;
}

let rand = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

let clone = (Node) => {
    return tool(cc.instantiate(Node));
}

let menu = (text:string = 'Menu1', data: object = []):void => {
    let root = cc.find('loading/menu');
    let width = cache.game.width * 0.68;
    width = width > 300 ? 300 : width;
    let height = cache.game.height * 0.7;
    height = height > 400 ? 400 : height;
    let newNode = Node('data')
    newNode.to(root)
    let background = clone( cc.find("loading/UI/hide/background"))
    background.active = true;
    background.to(newNode)
    background.size(cache.game.width, cache.game.height)
    background.xy(0,0)
    background.setAnchorPoint(0,1)
    background.alpha(0.5)

    let cloneObject = clone(cc.find('loading/UI/menu'))
    cloneObject.active = true;
    cloneObject.to(newNode)
    cloneObject.name = "menu"
    cloneObject.setPosition(0,0,0)
    cloneObject.sizeReal(width,height)
    cloneObject.getComponent('menuController').setName(text)
}

let deleteNotice = () => {
    let root = cc.find("loading/notice");
    if(root) {
        root.destroy();
    }
}
let deleteMenu = () => {
    let root = cc.find("loading/menu/data");
    if(root) {
        root.destroy();
    }
}


let XHR = (link, event: Function = null) => {
    link = cache.home + link;
     return new Promise((res,fai) => {
         assetManager.loadRemote(link, (err, images) => {
             if(event) {
                 event();
             }
             if(err) {
                    console.log(err)
                    fai(err);
             }
             res(images);
         });
     })
}

let clonePosition = (vec) => {
    return new cc.Vec3(vec.x, vec.y, vec.z);
}


export {
    clonePosition,
    XHR,
    deleteMenu,
    menu,
    coverColor,
    Link,
    clone,
    rand,
    Text,
    coverImg,
    getImgLocal,
    Sprite,
    crop,
    square,
    Node
}