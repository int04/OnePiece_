import { _decorator, Component, Node, ScrollView, Label, Layout, instantiate, find, UITransform, Button } from 'cc';
import cache, {_, getThuocTinh} from "db://assets/src/engine/cache";
import {coverColor} from "db://assets/src/engine/draw";
import {buttonItemUI} from "db://assets/src/views/UI/buttonItemUI";
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
    }

    xulydakham():void {
        if(this.item.type === 'item') {
            this.dakhamUI.active = false
            return;
        }
        this.dakhamUI.active = true;

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

        let list = source[this.data.source];
        if(!list) return;

        for(let i = 0; i < list.length; i++) {
            let item = list[i];
            let clone = instantiate(find("demo", getLayout));
            clone.active = true;
            clone.name = "item" + i;
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

    updatePrview(data : any) : void {
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
    }

    update(deltaTime: number) {
        
    }
}


