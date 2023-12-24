import { _decorator, Component, Node, UITransform, Sprite, SpriteFrame, AnimationClip, Animation, Texture2D  } from 'cc';
const { ccclass, property } = _decorator;

let grahics = (data: any) => {
    data.x = data.x || 0;
    data.y = data.y || 0;
    data.width = data.width || 0;
    data.height = data.height || 0;
    data.color = data.color || cc.color(255, 0, 0);
    data.lineWidth = data.lineWidth || 0;
    data.stroke = data.stroke || false;
    data.fill = data.fill || false;
    data.lineColor = data.lineColor || cc.color(255, 0, 0);

    let node = new cc.Node();
    node.name = data.name || 'node';
    node.addComponent(cc.Graphics);
    node.getComponent(cc.Graphics).rect(data.x, data.y, data.width, data.height);
    node.getComponent(cc.Graphics).lineWidth = data.lineWidth;
    node.getComponent(cc.Graphics).strokeColor = data.lineColor;
    node.getComponent(cc.Graphics).stroke();
    node.getComponent(cc.Graphics).fillColor = data.color;
    node.getComponent(cc.Graphics).fill();

    if(data.line) {
        // draw line abound rect

    }

    node.getComponent(UITransform).width = data.width;
    node.getComponent(UITransform).height = data.height;
    node.setPosition(data.x, data.y, 0);
    return node;
}

let color = (color: string) => {
    // example: #ffffff
    let r = parseInt(color.substr(1,2), 16);
    let g = parseInt(color.substr(3,2), 16);
    let b = parseInt(color.substr(5,2), 16);
    return cc.color(r,g,b);
}

let node = () => {
    let c = new cc.Node();
    c.addComponent(cc.Sprite);
    return c;
}

let coppy = (node: Node) => {
    let child = cc.instantiate(node);
    return child;
}

let getBoundingBox = (node: Node) => {
    let b = node.getComponent(UITransform).getBoundingBox();
    return b;
}

let setXY = (node: Node, x: number, y: number) => {
    return node.setPosition(x, y, 0);
}

let getXY = (node: Node) => {
    return node.getPosition();

}

let size = (node: Node) => {
    return node.getComponent(UITransform);
}
let getBoundingBoxToWorld = (node: Node) => {
    let b = node.getComponent(UITransform).getBoundingBoxToWorld();
    return b;

}

let findAndChangeSize = (children, width, height) => {
    let find = (node: Node) => {
        node.getComponent(UITransform).width = width;
        node.getComponent(UITransform).height = height;
        for(let i = 0; i < node.children.length; i++) {
            console.log('có')
            find(node.children[i]);
        }
    }

    for(let i = 0; i < children.length; i++) {
        find(children[i]);
    }
}

let rand = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);

}

let scene = () => {
    return {

    }
}

let sizeReal = (node: Node) => {
    return node.getComponent(UITransform).getBoundingBoxToWorld();
}

let Position = (node:Node, x = null, y = null) => {
    let old = node.getPosition();

    let gameWidth = cc.winSize.width;
    let gameHeight = cc.winSize.height;

    let neoY = gameHeight/2;
    let neoX = gameWidth/2;
    let xMin = -gameWidth/2;
    let yMin = gameHeight/2;

    x = xMin + x
    y = yMin - y

    let xnew = x || old.x;
    let ynew = y || old.y;
    node.setPosition(xnew,ynew, 0);
}


let spriteFrame = async(name: string, path:string = 'int04') => {
    return new Promise(async (res,fai) => {
        let texture = await getImg(name, path);
        const node = new Node();
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = texture;
        const sprite = node.addComponent(Sprite);
        sprite.spriteFrame = spriteFrame;

        res(node)
    })
}


let getImg = async (name : string, path : string = 'icon') => {
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


let nSprite = async (name, path = 'int04') => {
    // @ts-ignore
    return new Promise(async (res,fai) => {
        let texture = await getImg(name, path);
        const node = new Node();
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = texture;
        const sprite = node.addComponent(Sprite);
        sprite.spriteFrame = spriteFrame;

        node.xy = (x = null,y = null) => {
            return Position(node, x, y)
        }

        res(node)
    })
}

export  {
    nSprite,
    getImg,
    Position,
    grahics,
    color,
    node,
    coppy,
    setXY,
    size,
    findAndChangeSize,
    getXY,
    rand,
    scene,
    sizeReal
}