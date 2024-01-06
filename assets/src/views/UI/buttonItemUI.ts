import { _decorator, Component, Node, find } from 'cc';
import {getSprite, getSpriteComponent} from "db://assets/src/views/pages/MapController";
import socket from "db://assets/src/engine/socket";
const { ccclass, property } = _decorator;

@ccclass('buttonItemUI')
export class buttonItemUI extends Component {
    public data : any = {};
    public item : any = {};
    /*
    * @todo: hàm này sử dụng để thao tác với các button. (xử lý sau hậu kì).
    * @todo ! để thêm các hàm xử lý khác, vui lòng vào preViewItemUI.ts để thêm vào hàm source;
    * */

    public useItem():void {
        // sử dụng item
        let sprite = getSprite();
        if(!sprite) return;
        let my = getSpriteComponent(sprite).my;
        let ruong = my.ruong.data;
        let data = ruong.find(e => e.id == this.data.id && e.active == 'hanhtrang');
        if(!data) return;

        socket().send(-3, [
            1, this.data.id,
        ]);

    }

    playButton(event : any, name : string):void {
        let show = find("UI/previewItem");
        if(show) show.active = false;
        console.log(name)
        if(name === 'trangbi') return this.useItem();
    }
}


