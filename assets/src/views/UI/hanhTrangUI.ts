import { _decorator, Component, Node, find, Label, ScrollView, Layout, instantiate } from 'cc';
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
        let array: Array<string> = ["bag"];
        for(let name of array) {
            let node = find(name, this.node);
            if(node) node.active = false;
        }
    }
    changeTab(event: any, customEventData: any): void {
        let node = event.target;
        let name = node.name;
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

    }

    bag():void {
        let node = find("bag", this.node);
        if(!node) return;
        if(node) node.active = true;

        let scrollview: ScrollView = node.getComponent(ScrollView);
        let content = scrollview.content;
        let list = find("list", content);
        let layout = list.getComponent(Layout);

        let demo = find("demo", list);
        if(demo) demo.active = false;

        let box = 500;
        for(let i = 0; i < box; i++) {
            let item = instantiate(demo);
            item.active = true;
            item.name = "item" + i;
            list.addChild(item);
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

    }

    question():void {

    }

    info():void {

    }


    update(deltaTime: number) {
        
    }

    run():void {
        this.node.active = true;
        this.setTitle(this.stringCover['bag']);
        this.bag();
    }
}


