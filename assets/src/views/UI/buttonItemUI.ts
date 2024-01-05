import { _decorator, Component, Node, find } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('buttonItemUI')
export class buttonItemUI extends Component {
    public data : any = {};
    public item : any = {};
    /*
    * @todo: hàm này sử dụng để thao tác với các button. (xử lý sau hậu kì).
    * @todo ! để thêm các hàm xử lý khác, vui lòng vào preViewItemUI.ts để thêm vào hàm source;
    * */

    playButton(event : any, name : string):void {
        let show = find("UI/previewItem");
        if(show) show.active = false;
        console.log(name)
    }
}


