import { _decorator, Component, Node, systemEvent, SystemEvent, find, Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('KeyCodeSystem')
export class KeyCodeSystem extends Component {
    start() {

        systemEvent.on(SystemEvent.EventType.KEY_UP, this.KEY_UP, this);
    }

    changePlayer(): void {
        let button = find("UI/screenButton/icon/change_click_player");
        if (button) {
            // play transition

            button.getComponent(Button).transition;
            button.getComponent(Button).clickEvents[0].emit([]);
        }
    }
    KEY_UP(event: any) {
        let key = event.keyCode;
        if(key === 113) {
            this.changePlayer();
        }
    }

}


