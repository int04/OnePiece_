import { _decorator, Component, Node, find } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('boxItemUseUI')
export class boxItemUseUI extends Component {
    @property(Node)
    background: Node = null;
    @property(Node)
    item: Node = null;
    start() {

    }

    update(deltaTime: number) {
        
    }
}


