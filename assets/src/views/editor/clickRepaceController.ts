import { _decorator, Component, Node, NodeEventType, find } from 'cc';
import { repaceController } from './repaceController';
const { ccclass, property } = _decorator;

@ccclass('clickRepaceController')
export class clickRepaceController extends Component {
    start() {
        this.node.on(NodeEventType.TOUCH_START,this.clickbtn,this);
    }

    clickbtn():void {
        let parent = find("edit/ScrollView");
        if(this.node.name === 'dong') {
            parent.getComponent(repaceController).close();
            return;
        }
        parent.getComponent(repaceController).updateController(this.node.name);
    }


}


