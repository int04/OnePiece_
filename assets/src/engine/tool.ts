import { _decorator, Component, Node, UITransform, Sprite, SpriteFrame, AnimationClip, Animation, Texture2D, UIOpacity  } from 'cc';
const { ccclass, property } = _decorator;

function getTotalContentSize(node, parent = true) {
    let totalSize;
    if(parent !== true) {
        totalSize = {
            width : node.getComponent(UITransform).width,
            height : node.getComponent(UITransform).height
        }
    }
    else {
        totalSize = {
            width : 0,
            height : 0
        }
    }

    for (let i = 0; i < node.childrenCount; ++i) {
        let childNode = node.children[i];
        let childContentSize = getTotalContentSize(childNode,false);

        totalSize.width = Math.max(totalSize.width, childContentSize.width );
        totalSize.height = Math.max(totalSize.height, childContentSize.height );
    }


    return totalSize;
}


let tool = (node) => {
    /*
    * getComponentsInChildren(cc.Sprite) => [cc.Sprite, cc.Sprite, cc.Sprite]
    * */

    node.alpha = (value) => {
        value = value < 1 ? value * 255 : value;
        node.addComponent(UIOpacity).opacity = value
    }

    node.xy = (x = null,y = null) => {
        return Position(node, x, y)
    }
    node.getSize = () => {
        return node.getComponent(UITransform).getContentSize();
    }
    node.x = node.getPosition()?.x;
    node.y = node.getPosition()?.y;

    node.noAnchor = () => {
        node.setAnchorPoint(0,0)
    }

    node.getRealSize = () => {
        return getTotalContentSize(node);
    }

    node.getBounds = () => {
        return node.getComponent(UITransform).getBoundingBoxToWorld();
    }
    node.Text = (dataaa) => {
        let label = node.getComponent(cc.Label);
        if(!label) {
            label = node.addComponent(cc.Label);
        }
        label.string = dataaa;

    }

    node.to = (ParentNode : Node) => {
        let layer = ParentNode.layer;
        node.layer = layer;
        ParentNode.addChild(node);
    }

    node.setX = (x = 0) => {
        let pos = node.getPosition();
        x = pos.x + x;
        node.setPosition(x, pos.y, 0)
    }

    node.setY = (y = 0) => {
        let pos = node.getPosition();
        y = pos.y + y;
        node.setPosition(pos.x, y, 0)
    }

    node.size = (width, height) => {
        return size(node, width, height)
    }

    node.sizeReal = (width, height) => {
        return sizeReal(node, width, height)
    }

    node.sizeAll = (width, height) => {
        return sizeAll(node, width, height)
    }

    node.scales = (scaleX = null, scaleY = null) => {
        return scale(node, scaleX, scaleY)
    }
    node.anchor = (x = null, y = null) => {
        return anchor(node, x, y)
    }

    node.anchorAll = (x = null, y = null) => {
        if(x === false) x = 0
        if(y === false) y = 0
        node.setAnchorPoint(x, y);
        function setSize(node2, parent = true) {
            console.log(node2.name, node2.childrenCount)
            if(parent !== true) {
                node2.setAnchorPoint(x, y);
            }
            else {

            }

            for (let i = 0; i < node2.childrenCount; ++i) {
                let childNode = node2.children[i];
                let childContentSize = setSize(childNode,false);

            }
        }
        setSize(node);
    }


    node.click = (callback = false) => {
        node.on(Node.EventType.TOUCH_START, (event) => {
            if(callback) callback()
        });
    }
    node.clickTime = (callback = false) => {
        let time = 0;
        // check click or press
        node.on(Node.EventType.TOUCH_START, (event) => {
            time = new Date().getTime();
        });
        node.on(Node.EventType.TOUCH_END, (event) => {
            let time2 = new Date().getTime();
            if(time2 - time < 200) {
                if(callback) callback()
            }
        });
    }


    node.zoom = (width, height) => {
        node.editedInt = node.editedInt || 0;
        let old = node.getComponent(UITransform);
        let oldw = old.width;
        let oldh = old.height;
        if(node.editedInt === 0) {
            node.editedInt = 1;
            node.intCache = {
                width : oldw,
                height : oldh
            }
        }
        else {
            oldw = node.intCache.width;
            oldh = node.intCache.height;
        }

        console.log(width, height, oldw, oldh)

        width = width || oldw;
        height = height || oldh;

        if(width && width > oldw) width = oldw;
        if(height && height > oldh) height = oldh;

        let oldScaleX = node.scale.x;
        let oldScaleY = node.scale.y;
        let scaleX = oldw/width * oldScaleX;
        let scaleY = oldh/height * oldScaleY;
        node.setScale(scaleX, scaleY);
    }

    return node;
}

let anchor = (node, x = null, y = null) => {
    let old = node.getComponent(UITransform);
    let oldAnchorX = old.anchorX;
    let oldAnchorY = old.anchorY;
    x = x || oldAnchorX;
    y = y || oldAnchorY;
    if(x === false) x = 0
    if(y === false) y = 0
    node.setAnchorPoint(x, y);

}

let scale = (node, scaleX = null, scaleY = null) => {
    let oldScaleX = node.scale.x;
    let oldScaleY = node.scale.y;


    scaleX = scaleX || oldScaleX;
    scaleY = scaleY || oldScaleY;

    if(scaleX === 1 || scaleX === -1) {
        if(scaleX === -1 && oldScaleX < 0) {
            scaleX = -1;
        }
        else {
            scaleX = scaleX * oldScaleX;
        }
    }
    if(scaleY === 1 || scaleY === -1) {
        scaleY = scaleY * oldScaleY;
    }
    node.setScale(scaleX, scaleY);
}

let size = (node, width = null, height = null) => {
    // get real size
    node.editedInt = node.editedInt || 0;
    let old = node.getComponent(UITransform);
    let oldw = old.width;
    let oldh = old.height;
    if(node.editedInt === 0) {
        node.editedInt = 1;
        node.intCache = {
            width : oldw,
            height : oldh
        }
    }
    else {
        oldw = node.intCache.width;
        oldh = node.intCache.height;
    }

    console.log(width, height, oldw, oldh)

    width = width || oldw;
    height = height || oldh;

    let oldScaleX = node.scale.x;
    let oldScaleY = node.scale.y;
    let scaleX = width/oldw * oldScaleX;
    let scaleY = height/oldh * oldScaleY;
    node.setScale(scaleX, scaleY);
}

let sizeReal = (node, width = null, height = null) => {
    // get real size
    node.editedInt = node.editedInt || 0;
    let old = node.getComponent(UITransform);
    let oldw = old.width;
    let oldh = old.height;
    if(node.editedInt === 0) {
        node.editedInt = 1;
        node.intCache = {
            width : oldw,
            height : oldh
        }
    }
    else {
        oldw = node.intCache.width;
        oldh = node.intCache.height;
    }

    if(width && width > oldw) {
        width = oldw;
    }
    if(height && height > oldh) {
        height = oldh;
    }

    width = width || oldw;
    height = height || oldh;

    let oldScaleX = node.scale.x;
    let oldScaleY = node.scale.y;
    let scaleX = width/oldw * oldScaleX;
    let scaleY = height/oldh * oldScaleY;
    node.setScale(scaleX, scaleY);
}


let sizeAll = (node, width = null, height = null) => {
    // get real size
    node.editedInt = node.editedInt || 0;
    let old = node.getComponent(UITransform);
    let oldw = old.width;
    let oldh = old.height;
    if(node.editedInt === 0) {
        node.editedInt = 1;
        node.intCache = {
            width : oldw,
            height : oldh
        }
    }
    else {
        oldw = node.intCache.width;
        oldh = node.intCache.height;
    }

    width = width || oldw;
    height = height || oldh;

    let oldScaleX = node.scale.x;
    let oldScaleY = node.scale.y;
    let scaleX = width/oldw * oldScaleX;
    let scaleY = height/oldh * oldScaleY;
    node.setScale(scaleX, scaleY);

    function setSize(node, parent = true) {
        if(parent !== true) {
            console.log(scaleX, scaleY, node.name)
            //node.setScale(scaleX, scaleY);
        }
        else {

        }

        for (let i = 0; i < node.childrenCount; ++i) {
            let childNode = node.children[i];
            setSize(childNode,false);
        }
    }
    setSize(node);
}

let Position = (node:Node, x = null, y = null) => {
    let old = node.getPosition();

    let gameWidth = cc.view.getFrameSize().width
    let gameHeight = cc.view.getFrameSize().height

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


export {
    tool
}