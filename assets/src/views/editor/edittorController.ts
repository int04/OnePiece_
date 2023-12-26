import { _decorator, Component, Node, NodeEventType, find,instantiate, EditBox, Label } from 'cc';
import cache from "db://assets/src/engine/cache";
import {getImages} from "db://assets/src/engine/cache";
import {spriteController} from "db://assets/src/views/editor/spriteController";
import {randomString} from "db://assets/src/engine/sys";
import {XHR} from "db://assets/src/engine/draw";
const { ccclass, property } = _decorator;

let fetchCurl = (url, action:Function = null) => {
    let link =  cache.home + url;
    return new Promise((res, fai) => {
        fetch(link)
            .then((response) => {
                if(action) action();
                return response.json();
            })
            .then((data) => {
                res(data);
            })
            .catch((err) => {
                fai(err);
            });
    });
}

@ccclass('edittorController')
export class edittorController extends Component {
    @property({
        type: Node
    })
    private camera : Node = null;
    @property({
        type: Node
    })
    private buttonMenu : Node = null;

    public action: string = '';
    public objectID: string = '';
    public list: object = {};
    public hide: object = {
        ao : false,
        quan : false,
        lung : false,
        tay : false,
        dau : false,
        toc : false,
        mu : false,
    }

    eventButtonMenu():void {
        let path = find("edit/ScrollView");
        path.active = !path.active;
    }
     start() {
        this.buttonMenu.on(NodeEventType.TOUCH_START, this.eventButtonMenu, this);
        let src: any = cache.resource;
        let downloaded: number = 0;
        let promise:any = [];
        src.forEach((item: String) => {
            let url: String = './assets/package/' + item + '.json?v=' + Date.now()
            promise.push(
                fetchCurl(url, () => {
                    downloaded++;
                })
            )
        });
        console.log(src)
        let all = Promise.all(promise);
        all.then(async(callback) => {
            callback.forEach( (item: String, index:number) => {
                let data:any = callback[index]
                cache.images = cache.images.concat(data);
            })

            /*/
            // luffy:
            ao : 'lETxXc94Cy',
                quan : 'TIo6aWotHG',
                lung : 'gr0VkEI8d5',
                tay : 'f8EGgmi32Z',
                dau : 'okeR9y6ukZ',
                toc : 'yGgXC0kOnB',
                mu : '1o0381F8Ia',

            */


            this.list = await fetchCurl('package/sprite.json?delta='+Date.now());
            this.MoveCamera();
            // this.insertDemo();
            this.createSprite();
            let button = find("edit/text/EditBox/Button");
            button.on(NodeEventType.TOUCH_START, () => {
                let text = find("edit/text/EditBox");
                let value = text.getComponent(EditBox).string;
                if(this.action === '') {
                    alert('Chưa chọn action')
                    return;
                }
                for(let name in this.list) {
                    let id = this.list[name];
                    let data_img = cache.images.find(e => e.name == id);
                    let data_action = data_img.actions[this.action];
                    let clone = JSON.parse(JSON.stringify(data_action));
                    data_img.actions[value] = clone;
                }
                console.log(cache.images)
                this.createSprite();
            });

            let button2 = find("edit/text/changeALL/Button");
            button2.on(NodeEventType.TOUCH_START, () => {
                let text = find("edit/text/changeALL");
                let text_old = find("edit/text/changeALL/oldImages");
                let old = text_old.getComponent(EditBox).string;
                let value = text.getComponent(EditBox).string;

                if(old === '') {
                    alert('Chưa nhập old')
                    return;
                }
                if(value === '') {
                    alert('Chưa nhập value')
                    return;
                }

                for(let name in this.list) {
                    let id = this.list[name];
                    let data_img = cache.images.find(e => e.name == id);
                    let data_action = data_img.actions;
                    for(let action in data_action) {
                        let data = data_action[action];
                        let listFrame = data[0];
                        listFrame.forEach((frame, index) => {
                            if(frame == old) {
                                listFrame[index] = value;
                            }
                        });
                    }
                }
            });

            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.KEY_DOWN, this);
            this.event222()
            this.createEventClickObjectFast();
        })

    }

    updateImagesFromClick(name:string): void {
        if(this.action === '') return;
        if(this.objectID === '') return;
        let images = cache.images.find(e => e.name == this.list[this.objectID]);
        let action = images.actions[this.action];
        let listFrame = action[0];
        listFrame = [name];
        action[0] = listFrame;

    }

    clickObjectHide(name : string):void {
        this.hide[name] = !this.hide[name];
        this.updateShowHide();
    }

    clickObject(name: string): void {
        if(this.action === '') return;
        this.objectID = name;
        this.updateForm();
    }
    createEventClickObjectFast():void {
        for(let name in this.list) {
            find("edit/editnow/"+name).on(NodeEventType.TOUCH_START, () => {
                this.clickObject(name);
            }, this);
        }
        for(let name in this.list) {
            find("edit/an/"+name).on(NodeEventType.TOUCH_START, () => {
                this.clickObjectHide(name);
            }, this);
        }
    }
    event222():void {
        let button_form = find("edit/form/Button");
        button_form.on(NodeEventType.TOUCH_START, () => {
            this.formEvent();
        });

        let button3 = find("edit/nextobject");
        button3.on(NodeEventType.TOUCH_START, () => {
            this.nextObject();
        });
    }

    nextObject():void {
        if(this.action === '') return;
        let list = [];
        let images = cache.images.find(e => e.name == this.list[this.objectID]);
        for(let name in images.actions) {
            list.push(name);
        }
        let index = list.indexOf(this.action);
        index++;
        if(index >= list.length) index = 0;
        this.action = list[index];
         this.updateForm();

    }

    updateForm():void {
        find("edit/form/action").getComponent(EditBox).string = this.action;
        find("edit/form/objectID").getComponent(EditBox).string = this.objectID;


        let data = getImages(this.list[this.objectID], this.action);
        // join ,
        let list = data[0].join(',');
        find("edit/form/list").getComponent(EditBox).string = list;
        let textAction = find("edit/text/action");
        textAction.getComponent(Label).string = this.action;
        let textObjectID = find("edit/text/objectID");
        textObjectID.getComponent(Label).string = this.objectID;

        let x = data[1][0];
        let y = data[1][1];

        find("edit/form/x").getComponent(EditBox).string = x;
        find("edit/form/y").getComponent(EditBox).string = y


    }

    formEvent():void {
        let action = find("edit/form/action").getComponent(EditBox).string;
        let objectID = find("edit/form/objectID").getComponent(EditBox).string;
        let x = find("edit/form/x").getComponent(EditBox).string;
        let y = find("edit/form/y").getComponent(EditBox).string;
        let list = find("edit/form/list").getComponent(EditBox).string;
        let listArray = list.split(',');
        let listArray2 = [];
        listArray.forEach(e => {
            listArray2.push(e);
        });
        let data = getImages(this.list[objectID], action);
        data[0] = listArray2;
        data[1] = [x,y];

        this.encodeJson();
        this.encodeJsonObject(objectID);

    }

    encodeJson(newid:boolean = false, newname: boolean = false):void {
        let input = find("edit/form/data_all");
        let data = [];
        let data_ChangeID = [];
        let idRandom = randomString(10);
        let idRandom2 = randomString(10);
        for(let name in this.list) {
            let id = this.list[name];
            let data_img = cache.images.find(e => e.name == id);
            let coppy = JSON.parse(JSON.stringify(data_img));
            if(newid) coppy.id = idRandom;
            if(newname) coppy.name = randomString(10);
            data.push(coppy);

            let coppy2 = JSON.parse(JSON.stringify(data_img));
            coppy2.id = idRandom2;
            coppy2.name = randomString(10);
            data_ChangeID.push(coppy2);
        }
        input.getComponent(EditBox).string = JSON.stringify(data);

        let input2 = find("edit/form/data_all_change_name");
        input2.getComponent(EditBox).string = JSON.stringify(data_ChangeID);
    }

    encodeJsonObject(nameobject:string,newid: boolean, newname:boolean):void {
        let showname = find("edit/form/data_object/doituong");
        showname.getComponent(Label).string = nameobject;
        let input = find("edit/form/data_object");
        let data = {}
        let data2 = {}
        let idRandom = randomString(10);
        let idRandom2 = randomString(10);
        for(let name in this.list) {
            if(name != nameobject) continue;
            let id = this.list[name];
            let data_img = cache.images.find(e => e.name == id);
            let coppy = JSON.parse(JSON.stringify(data_img));
            if(newid) coppy.id = idRandom;
            if(newname) coppy.name = randomString(10);
            data = coppy

            let coppy2 = JSON.parse(JSON.stringify(data_img));
            coppy2.id = idRandom2;
            coppy2.name = randomString(10);
            data2 = coppy2
        }
        input.getComponent(EditBox).string = JSON.stringify(data);

        let input2 = find("edit/form/object_change_name");
        input2.getComponent(EditBox).string = JSON.stringify(data2);
        let doituong = find("edit/form/object_change_name/doituong");
        doituong.getComponent(Label).string = nameobject + "_change";
    }

    KEY_DOWN(event):void {
        this.encodeJson();
        if(this.action === '' || this.objectID === '') return;
        this.encodeJsonObject(this.objectID, false, false);
        let key = event.keyCode;
        if(key === 39 || key === 37 || key === 38 || key === 40) {
            let images = cache.images.find(e => e.name == this.list[this.objectID]);
            let action = images.actions[this.action];
            let XY = action[1];
            let x = XY[0];
            let y = XY[1];
            if(key === 39) {
                x++;
            }
            if(key === 37) {
                x--;
            }
            if(key === 38) {
                y++;
            }
            if(key === 40) {
                y--;
            }
            action[1] = [x,y];

            // if action = mu, toc, dau move all
            if(this.objectID === 'mu' || this.objectID === 'toc' || this.objectID === 'dau') {
                for(let nameob in images.actions) {
                    let action2 = images.actions[nameob];

                    action2[1] = action[1]
                }
            }

        }
    }


    createSprite():void {
        let list: any = this.list;

        let allSprite = find("Canvas/editor").children;
        allSprite.forEach((sprite, index) => {
            if(sprite.name != 'demo') {
                sprite.destroy();
            }
        })
        let demo = find("Canvas/editor/demo")
        let action: any = [];
        let test = cache.images.find(e => e.name == list.ao);
        for(let name in test.actions) {
            action.push(name);
        }
        demo.active = false;

        let spaceY = 300;
        let numX = 5;

        action.forEach((actionName, index) => {
            let sprite = instantiate(demo);
            sprite.name = actionName;
            sprite.active = true;
            sprite.setParent(demo.getParent());
            sprite.getComponent(spriteController).list = list;
            let y = sprite.getPosition().y;

            let x = sprite.getPosition().x;
            let indexX = index % numX;
            let indexY = Math.floor(index / numX);

            sprite.setPosition(x + indexX * spaceY, y - indexY * spaceY);

            let name = find('name',sprite);
            name.getComponent(Label).string = actionName;
        })

    }

    MoveCamera() {
        let isDrag = false;
        let prex = 0;
        let prey = 0;
        //down
        this.node.on(NodeEventType.TOUCH_START, (event) => {
            isDrag = true;
            prex = event.getLocationX();
            prey = event.getLocationY();
        });
        //move
        this.node.on(NodeEventType.TOUCH_MOVE, (event) => {
            if(isDrag) {
                let x = event.getLocationX();
                let y = event.getLocationY();
                let dx = x - prex;
                let dy = y - prey;
                let pos = this.camera.getPosition();
                this.camera.setPosition(pos.x - dx, pos.y - dy);
                prex = x;
                prey = y;
            }
        });
        //up
        this.node.on(NodeEventType.TOUCH_END, (event) => {
            isDrag = false;
        });

        // scale wheel
        this.node.on(NodeEventType.MOUSE_WHEEL, (event) => {
            let pos = this.node.getPosition();
            let scale = this.node.getScale();
            let delta = event.getScrollY();
            if(delta > 0) {
                scale.x *= 1.1;
                scale.y *= 1.1;
            } else {
                scale.x /= 1.1;
                scale.y /= 1.1;
            }
            this.node.setScale(scale);
        });


    }

    public updateShowHide():void {
        for(let name in this.hide) {
            let node = find("edit/Layout/"+name);
            node.active = this.hide[name];
        }
    }

    private timeUpdate: number = 0;
    update(deltaTime: number) {
        this.timeUpdate += deltaTime;
        if(this.timeUpdate <=5) return false;
        this.timeUpdate = 0;

        this.updateShowHide();
    }
}


