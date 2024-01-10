import { input, Input, _decorator, Component, Node, ScrollView, Label, Layout, instantiate, find, UITransform, Button, Sprite, Animation, EventTouch } from 'cc';
import cache, {_, getThuocTinh} from "db://assets/src/engine/cache";
import {coverColor, coverImg, coverSpriteFrame} from "db://assets/src/engine/draw";
import {buttonItemUI} from "db://assets/src/views/UI/buttonItemUI";
import {createClipY} from "db://assets/src/engine/animation";
const { ccclass, property } = _decorator;

@ccclass('preViewItemUI')
export class preViewItemUI extends Component {
    @property(ScrollView)
    private scrollview: ScrollView = null;
    @property(ScrollView)
    private scrollviewButton: ScrollView = null;
    @property(Label)
    private nameItem: Label = null;
    @property(Node)
    private dakhamUI: Node = null;
    private data : any = {};
    private item : any = {};

    private source : any = {
        "bag" : [["trangbi","Sử dụng"], ]
    };

    start() {

    }

    close():void {
        this.node.active = false;
        let preSkill = find("UI/previewSkill");
        if(preSkill) {
            preSkill.active = false;
        }
    }

    async xulydakham():Promise<void> {
        if(this.item.type === 'item') {
            this.dakhamUI.active = false
            return;
        }
        this.dakhamUI.active = true;

        let lo = this.data.lo;
        if(typeof lo !== 'object') return;
        let child = this.dakhamUI.children;
        for(let i = 0; i < child.length; i++) {
            let element = child[i];
            let da = find("da", element);
            if(lo[i] === -1) {
                element.active = false;
            }
            else if(lo[i] === 0) {
                element.active = true;
                da.active = false;
            }
            else {
                let item = cache.item.find(e => e.id === lo[i]);
                if(!item) continue;
                da.active = true;
                let img = item.img;
                let num = img.num; // số lượng sheet
                let src = img.src; // ảnh
                if(num <=1) {
                    da.getComponent(Sprite).spriteFrame = await coverSpriteFrame(src);
                }
                else {
                    let texture = await coverImg(src);
                    let width = texture.width;
                    let height = texture.height;
                    let clip = await createClipY(src, width, height, num, 0.1, 120);
                    da.addComponent(Animation);
                    let animation = da.getComponent(Animation);
                    animation.addClip(clip, clip.name);
                    animation.play(clip.name);
                }
            }
        }

    }

    private clone(name : string, parent : Node) {
        let clone = instantiate(find(name, parent));
        clone.active = true;
        clone.name = "clone_text"
        parent.addChild(clone);
        return clone.getComponent(Label);
    }


    private xulyContent(): void {
        let content = this.scrollview.content;
        let getLayout = find("Layout",content);
        let layout = getLayout.getComponent(Layout);
        if(!layout) return;
        for(let child of getLayout.children) {
            if(child.name === 'text_title' || child.name === 'text') continue;
            child.destroy();
        }

        let item = this.item;
        let data = this.data;

        if(item.type === 'item') {
            let clone = this.clone("text_title", getLayout);
            clone.string = "--- Thông tin Vật phẩm ---";

            if(this.data.source === "bag") {
                let clone = this.clone("text", getLayout);
                clone.string = "Số lượng: " + this.data.soluong;
            }

            let mota = this.clone("text", getLayout);
            mota.string = item.mota;

        }

        else {
            let clone = this.clone("text_title", getLayout);
            clone.string = "--- Thông tin---";

            let level = this.clone("text", getLayout);
            level.string = "Level: " + item.level;

            let cuongHoa = this.clone("text", getLayout);
            cuongHoa.string = "Cường hóa: +" + this.data.level;

            let thongtinNangCap = this.clone("text_title", getLayout);
            thongtinNangCap.string = `--- Chỉ số +${this.data.level} ---`;

            if(this.item.thuoctinh) {
                for(let tenthuoctinh in item.thuoctinh) {
                    let mayman : number = data.mayman || 0;
                    let level : number = data.level || 0;
                    let phamchat : number = data.phamchat || 1;
                    let giatrigoc: number = item.thuoctinh[tenthuoctinh];
                    let tinh : number = giatrigoc + giatrigoc * (mayman /100);
                    tinh+= tinh * (level*phamchat /100);
                    tinh = Math.round(tinh);
                    let tenThuocTinh = getThuocTinh(tenthuoctinh);
                    let render = ''+(tinh > 0 ? _('Tăng') : _("Giảm"))+' '+tinh+''+tenThuocTinh.value+' '+tenThuocTinh.name+' ';
                    let clone = this.clone("text", getLayout);
                    clone.string = render;
                }
            }

            if(data.dong) {
                let dong = this.clone("text_title", getLayout);
                dong.string = "--- Chỉ số đặc biệt ---";
                data.dong.forEach(tenthuoctinh => {
                    let mayman : number = data.mayman;
                    let level : number= data.level;
                    let phamchat: number = data.phamchat;
                    let level_item:number = item.level;
                    level_item = level_item < 0 ? 1 : level_item;
                    let level_yc : number = Math.ceil(level_item / 10);
                    let giatrigoc : number = level_yc * phamchat;
                    let tinh : number= giatrigoc + giatrigoc * (mayman / 100);
                    tinh += tinh * ((level * phamchat + 5) / 100);
                    tinh = Math.round(tinh);
                    let tenThuocTinh = getThuocTinh(tenthuoctinh);
                    let render = ''+(tinh > 0 ? _("Tăng") : _("Giảm"))+' '+tinh+''+tenThuocTinh.value+' '+tenThuocTinh.name+' ';
                    let clone = this.clone("text", getLayout);
                    clone.string = render;
                });
            }

            if(data.lo && typeof data.lo == 'object') {
                let lo = this.clone("text_title", getLayout);
                lo.string = "--- Chỉ số đá khảm ---";

                let list_UP = [];
                data.lo.forEach(element => {
                    let idItem = element;
                    if(idItem !== 0 && idItem !== -1) {
                        let item2 = cache.item.find(e => e.id === idItem);
                        if(item2 && item.thuoctinh) {
                            for(let tenthuoctinh in item2.thuoctinh) {
                                let tinh = item2.thuoctinh[tenthuoctinh];
                                let indexOf = list_UP.findIndex(e => e[0] === tenthuoctinh);
                                if(indexOf === -1) {
                                    list_UP.push([tenthuoctinh,tinh])
                                }
                                else {
                                    list_UP[indexOf][1]+= tinh;
                                }
                            }
                        }
                    }
                });

                list_UP.forEach(element => {
                    let tenthuoctinh = element[0];
                    let tinh = element[1];
                    let tenGoi = getThuocTinh(tenthuoctinh);
                    let render = ''+(tinh > 0 ?_("Tăng") : _("Giảm"))+' '+tinh+''+tenGoi.value+' '+tenGoi.name+' ';
                    let clone = this.clone("text", getLayout);
                    clone.string = render;

                });

            }


        }

        layout.updateLayout();
        // @ts-ignore
        let size = getLayout.getContentSize();

        // @ts-ignore
        content.setContentSize(size.width, size.height);

    }

    private keyButtonOn : boolean = false;

    private xulyButton(): void {
        let content = this.scrollviewButton.content;
        let getLayout = find("Layout",content);
        let layout = getLayout.getComponent(Layout);
        if(!layout) return;
        for(let child of getLayout.children) {
            if(child.name === 'demo') continue;
            child.destroy();
        }


        let source = this.source;

        let listx = source[this.data.source] || [];
        let list = JSON.parse(JSON.stringify(listx));
        list.push(["dong","Đóng"])


        /*Xử lý key input*/
        let oldID = -1;
        let setBoard = (idList : number, show : boolean = true) => {
            let boxItem = find("item_" + idList, getLayout);
            if(boxItem) {
                let keybroad = find("keybroad", boxItem);
                if(keybroad) {
                    keybroad.active = show;
                }
            }
        }
        let t2222 = (event) => {
            let box = list.length;
            if(this.node.active === false) {
                input.off(Input.EventType.KEY_UP,t2222, this);
                this.keyButtonOn  = false;
                return;
            }
            let key = event.keyCode;

            if(key === 13) {
                let boxItem = find("item_" + oldID, getLayout);
                if(boxItem) {
                    let button = boxItem.getComponent(Button);
                    boxItem.emit(Node.EventType.TOUCH_START);
                    boxItem.emit(Node.EventType.TOUCH_END);
                }
                return;
            }

            if(oldID >= 0 && oldID < box) {
                setBoard(oldID, false);
            }
            
            if(key === 37) {
                oldID--;
            }
            else
            if(key === 39) {
                oldID++;
            }
            else if(key === 40 || key === 38) {
                this.node.active = false;
                return;
            }

            if(oldID < 0) {
                oldID = box - 1;
            }
            else if(oldID >= box) {
                oldID = 0;
            }

            setBoard(oldID);

        }

        if(!this.keyButtonOn) {
            this.keyButtonOn = true;
            input.on(Input.EventType.KEY_UP,t2222, this);
        }

        /*end*/

        for(let i = 0; i < list.length; i++) {
            let item = list[i];
            let clone = instantiate(find("demo", getLayout));
            clone.active = true;
            clone.name = "item_" + i;
            getLayout.addChild(clone);
            let button = clone.getComponent(Button);
            let label = clone.getComponentInChildren(Label);
            label.string = item[1];

            button.clickEvents[0].customEventData = item[0];
            clone.getComponent(buttonItemUI).data = this.data;
            clone.getComponent(buttonItemUI).item = this.item;
        }

        layout.updateLayout();
        // @ts-ignore
        let size = getLayout.getContentSize();

        // @ts-ignore
        content.setContentSize(size.width + 0, size.height);
    }

    updatePrview(data : any, event : EventTouch) : void {
        this.data = data;
        let item = cache.item.find( e=> e.id === data.item);
        if(!item) {
            this.node.active = false;
            return;
        }
        this.node.active = true;
        this.item = item;

        // cập nhật tên
        let phamchat = 1;
        let _back = ["","#ffffff","#20B2AA","#8B658B","#FF7F24"];
        if(item.type ==='item') phamchat = item.phamchat;
        let color_background: string = _back[phamchat];
        this.nameItem.color = coverColor(color_background);
        this.nameItem.string = item.name;
        this.xulydakham();
        this.xulyContent();
        this.xulyButton();
        this.clickButton(event);
    }

    clickButton(event : EventTouch) : void {
        /*
        * Thay đổi UI theo con trỏ chuột
        * */
        if(!event) return;
        let touch = event.touch;
        let point = touch.getUILocation();

        let contentSize = this.node.getComponent(UITransform).contentSize;
        let world = this.node.worldPosition;
        let clone = world.clone();
        clone.x = point.x + contentSize.width/2;
        //this.node.setWorldPosition(clone);

        let width = cache.game.width;
        if(clone.x + contentSize.width/2 > width) {
            clone.x = width - contentSize.width/2;
        }

    }

    update(deltaTime: number) {
        
    }
}


