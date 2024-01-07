import { _decorator, native, UITransform, UIOpacity, assetManager, find, Node} from 'cc';
import {BoxUI} from "db://assets/src/views/UI/BoxUI";
import {menuUI} from "db://assets/src/views/UI/menuUI";
import {noticeController} from "db://assets/src/views/pages/noticeController";

export function testUI():void {
    setTimeout(() => {
       let bag = find("UI/box");
      bag.getComponent(BoxUI).openBag('skill');
    },300);
}

export function bottom(e : Node): void {
    let post = e.worldPosition;
    if(post.y < 0) {
        post.y = e.getContentSize().height/2;
        e.setWorldPosition(post);
    }
}


export function menu(title: string, list?: (string | (() => void))[][]) {
    let serch : Node = find("UI/menu");
    if(serch) {
        serch.getComponent(menuUI).run(title, list);
    }
}

export function notice(text:string = 'xin chào thế giới', show: boolean = true) {
    let search: Node = find("UI/notice");
    search?.getComponent(noticeController).setText(text, show);
}

export function deleteNotice(): void {
    let search: Node = find("UI/notice");
    search?.getComponent(noticeController).deleteNotice();
}

export function loading(show: boolean = true): void {
    let load : Node = find("UI/loading");
    if(load) {
        load.active = show;
    }
}