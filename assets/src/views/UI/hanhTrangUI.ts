import { _decorator, Component, Node, find, Label, ScrollView, Layout, instantiate } from 'cc';
import {getSprite} from "db://assets/src/views/pages/MapController";
import {SpriteController} from "db://assets/src/views/pages/sprite/SpriteController";
import {boxItemUI} from "db://assets/src/views/UI/boxItemUI";
const { ccclass, property } = _decorator;

@ccclass('hanhTrangUI')
export class hanhTrangUI extends Component {
    @property(Label)
    private title: Label = null;
    start() {
        this.node.active =true;
    }

    private old : string = 'bag';
    private stringCover : Object = {
        bag : "Hành trang",
        use : "Trang bị",
        skill : "Kỹ năng",
        question : "Nhiệm vụ",
        info : "Thông tin",
    }


    public setTitle(name : string): void {
        this.title.string = name;
    }

    public hide():void {
        let array: Array<string> = ["bag", "use"];
        for(let name of array) {
            let node = find(name, this.node);
            if(node) node.active = false;
        }
    }
    changeTab(event: any, customEventData: any): void {
        let node;
        let name;

        if(event) {
            node = event.target;
            name = node.name;
        }

        if(typeof  customEventData === "string" && customEventData.length >=1) {
            name = customEventData;
        }

        let tab = find("tab", this.node);
        if(!tab) return;
        if(this.old.length >=1) {
            let icon = find(this.old, tab);
            if(!icon) return;
            let click = find("click", icon);
            if(!click) return;
            click.active = false;
        }
        this.old = name;
        let icon = find(name, tab);
        if(!icon) return;
        let click = find("click", icon);
        if(!click) return;
        click.active = true;

        let stringCover = this.stringCover[name];
        if(stringCover) {
            this.setTitle(stringCover);
        }
        this.hide();
        this[name]();

        let preview = find("UI/previewItem");
        if(preview) {
            preview.active = false;
        }

    }

    bag():void {
        this.hide();
        let node = find("bag", this.node);
        if(!node) return;
        if(node) node.active = true;

        let scrollview: ScrollView = node.getComponent(ScrollView);
        let content = scrollview.content;
        let list = find("list", content);
        let layout = list.getComponent(Layout);

        let demo = find("demo", list);
        if(demo) demo.active = false;

        // reset bag
        let children = list.children;
        for(let child of children) {
            if(child.name === "demo") continue;
            child.destroy();
        }

        let sprite = getSprite();
        let my = sprite.getComponent(SpriteController).my;
        let box = my.ruong?.max + 0
        let ruong = my.ruong.data.filter(e=> e.active === "hanhtrang");

        ruong.sort((a,b) => {
            return a.time - b.time;
        });

        for(let i = 0; i < box; i++) {
            let item = instantiate(demo);
            item.active = true;
            item.name = "item" + i;
            list.addChild(item);
            if(ruong[i])
            {
                ruong[i].source = "bag";
                let child = find("item",item);
                child.getComponent(boxItemUI).updateItem(ruong[i]);
            }

        }
        layout.updateLayout();

        // @ts-ignore
        let size = layout.node.getContentSize();
        // @ts-ignore
        content.setContentSize(size);



    }

    skill():void {

    }

    use():void {

        this.hide();
        let node = find("use", this.node);
        if(!node) return;
        if(node) node.active = true;

        let top = find("Top",node);
        let tab1 = find("tab1",top);

        let sprite = getSprite();
        let my = sprite.getComponent(SpriteController).my;
        let trangbi = my.trangbi;
        let ruong = my.ruong.data.filter(e=> e.active === "trangbi");

        let xuly = (child : Node) => {
            let name = child.name;
            let id = trangbi[name];
            let demo = find("demo", child);
            let item = find("item", child);
            if(id) {
                demo.active = false;
                let infoItem = ruong.find(e => e.id === id);
                if(infoItem) {
                    item.getComponent(boxItemUI).updateItem(infoItem);
                    item.active = true;

                }
            }
            else {
                demo.active = true;
                item.active = false;
            }
        }

        for(let child  of tab1.children) {
            xuly(child);
        }

        let tab2 = find("tab2",top);
        for(let child  of tab2.children) {
            let name = child.name;
            xuly(child);
        }

        let content = find("content",top);
        let demoSprite = find("demoSprite",content);
        demoSprite.getComponent(SpriteController).updateSkinCreateNew(my.skin, 'dungyen','');

        let down = find("down",node);
        let list = find("background",down);
        for(let name in my.info?.chiso) {
            let value = my.info?.chiso[name];
            let item = find(name, list);
            if(item) {
                let label = find("value", item);
                if(label) {
                    label.getComponent(Label).string = value;
                }
            }
        }

    }

    question():void {

    }

    info():void {

    }


    update(deltaTime: number) {
        
    }

    run(name = null):void {
        if(typeof name === "object") {
            name  = 'bag'
        }
        this.node.active = true;
        if(name) {
            this.changeTab(null, name);
        }
        else {
            this.setTitle(this.stringCover['bag']);
            this.bag();
        }
    }
}


