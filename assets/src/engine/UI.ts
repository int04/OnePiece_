import { _decorator, native, UITransform, UIOpacity, assetManager, find, Node} from 'cc';

export function bottom(e : Node): void {
    let post = e.worldPosition;
    if(post.y < 0) {
        post.y = e.getContentSize().height/2;
        e.setWorldPosition(post);
    }
}

export function notice(text:string = 'xin chào thế giới', show: boolean = true) {
    let search: Node = find("UI/notice");
    search?.getComponent('noticeController').setText(text, show);
}

export function deleteNotice(): void {
    let search: Node = find("UI/notice");
    search?.getComponent('noticeController').deleteNotice();
}