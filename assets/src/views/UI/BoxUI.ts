import { _decorator, Component, Node, find } from 'cc';
import {hanhTrangUI} from "db://assets/src/views/UI/hanhTrangUI";
const { ccclass, property } = _decorator;

@ccclass('BoxUI')
export class BoxUI extends Component {
    start() {
        this.node.active = true;
    }

    public close():void {
        let list : any = {
            hanhtrang : ["bag"],
        }
        let body = find("body", this.node);

        for(let parent in list) {
            let node = find(parent, body);
            if(node) {
                let listChild = list[parent];
                for(let child of listChild) {
                    let childNode = find(child, node);
                    if(childNode) childNode.active = false;
                }
            }
            node.active = false;
        }

        this.node.active = false;
    }

    public openBag(): void {
        let body = find("body", this.node);
        this.node.active = true;
        let hanhtrang = find("hanhtrang", body);
        if(hanhtrang) {
            hanhtrang.getComponent(hanhTrangUI).run();
        }
    }


}


