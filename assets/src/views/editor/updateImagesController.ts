import { _decorator, Component, Node, NodeEventType, EditBox, find } from 'cc';
import {repaceController} from "db://assets/src/views/editor/repaceController";
const { ccclass, property } = _decorator;

@ccclass('updateImagesController')
export class updateImagesController extends Component {
    @property({
        type: Node,
    })
    private button:Node = null;
    @property({
        type: Node,
    })
    private input:Node = null;
    @property({
        type: Node,
    })
    private oldName:Node = null;
    start() {
        this.button.on(NodeEventType.TOUCH_START,this.clickbtn,this);
    }

    clickbtn():void {
        let value = this.input.getComponent(EditBox).string;
        let oldname = this.oldName.name;
        if(value.length <=0) alert('Vui lòng nhập ảnh')
        let parent = find("edit/ScrollView");
        parent.getComponent(repaceController).updateChange(oldname,value);
    }


}


