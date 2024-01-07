import { _decorator, Component, Node, Label, Layout, ScrollView, instantiate, find, UITransform } from 'cc';
import {menuFunctionUI} from "db://assets/src/views/UI/menuFunctionUI";
const { ccclass, property } = _decorator;

@ccclass('menuUI')
export class menuUI extends Component {
    @property(Label)
    public title: Label = null;

    @property(Layout)
    public layout: Layout = null;

    @property(ScrollView)
    public scrollview: ScrollView = null;

    start() {

    }

    reset(): void {
        let node = this.layout.node.children.filter((e : Node) => e.name !== 'demo');
        node.forEach((e : Node) => {
            e.destroy();
        });
    }

    public run(title: string, list?: (string | (() => void))[][]) {
        this.node.active = true;
        this.reset();
        this.title.string = title;
        let layout = this.layout.node;
        let demo = find("demo",layout);
        if(!demo) return;
        for(let i in list) {
            let node = instantiate(demo);
            node.name = i;
            node.active = true;
            node.parent = layout;
            let icon :  string | (() => void) = list[i][0];
            let name :  string | (() => void) = list[i][1];
            let func :  string | (() => void) = list[i][2];
            node.getComponent(menuFunctionUI).updateUI(icon, name, func);
        }

        this.layout.updateLayout();

        let size = this.layout.node.getComponent(UITransform).contentSize;

        this.scrollview.content.getComponent(UITransform).setContentSize(size);
    }

    hide(): void {
        this.node.active = false;
    }

    update(deltaTime: number) {
        
    }
}


