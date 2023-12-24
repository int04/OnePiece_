import { _decorator, native, UITransform, UIOpacity, assetManager, find, Node} from 'cc';

export function notice(text:string = 'xin chào thế giới', show: boolean = true) {
    let search: Node = find("UI/notice");
    search?.getComponent('noticeController').setText(text, show);
}

export function deleteNotice(): void {
    let search: Node = find("UI/notice");
    search?.getComponent('noticeController').deleteNotice();
}