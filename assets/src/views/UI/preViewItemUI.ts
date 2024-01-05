import { _decorator, Component, Node, ScrollView, Label, Layout, instantiate, find, UITransform } from 'cc';
import cache from "db://assets/src/engine/cache";
import {coverColor} from "db://assets/src/engine/draw";
const { ccclass, property } = _decorator;

@ccclass('preViewItemUI')
export class preViewItemUI extends Component {
    @property(ScrollView)
    private scrollview: ScrollView = null;
    @property(Label)
    private nameItem: Label = null;
    @property(Node)
    private dakhamUI: Node = null;
    private data : any = {};
    private item : any = {};
    start() {

    }

    xulydakham():void {
        if(this.item.type === 'item') {
            this.dakhamUI.active = false
            return;
        }
        this.dakhamUI.active = true;

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
        if(item.type === 'item') {
            let title = find("text_title", getLayout);
            let clone = instantiate(title);
            clone.active = true;
            clone.name = "clone_text"
            clone.getComponent(Label).string = "--- Thông tin Vật phẩm ---";
            getLayout.addChild(clone);

        }

        layout.updateLayout();
        // @ts-ignore
        let size = getLayout.getContentSize();

        // @ts-ignore
        content.setContentSize(size.width, size.height);

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
        let _back = ["","","#20B2AA","#8B658B","#FF7F24"];
        if(item.type ==='item') phamchat = item.phamchat;
        let color_background: string = _back[phamchat];
        this.nameItem.color = coverColor(color_background);
        this.nameItem.string = item.name;
        this.xulydakham();
        this.xulyContent();
    }

    update(deltaTime: number) {
        
    }
}


