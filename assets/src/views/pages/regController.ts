import { _decorator, Component, Node, NodeEventType, EditBox } from 'cc';
import {notice} from "db://assets/src/engine/UI";
import socket from "db://assets/src/engine/socket";
const { ccclass, property } = _decorator;

@ccclass('regController')
export class regController extends Component {
    @property({type: Node})
    private background: Node = null;
    @property(EditBox)
    private username: EditBox = null;
    @property(EditBox)
    private password: EditBox = null;
    start() {
        this.background.on(NodeEventType.TOUCH_START, this.blockScreen, this)
        this.node.active = true;
    }

    public testEvent():void {
        this.node.active = false;
    }

    public submit():void {
        let username =  this.username.string;
        let password = this.password.string;
        if(username.length < 4 || username.length >= 20) {
            notice('Tên tài khoản từ 4 đến 20 ký tự');
            return;
        }
        if(password.length < 4 || password.length >= 20) {
            notice('Mật khẩu từ 4 đến 20 ký tự');
            return;
        }
        notice('Đang đăng ký tài khoản...',false);
        socket().send(-1, [1, [username, password]]);
    }

    private blockScreen():void {

    }

    update(deltaTime: number) {
        console.log('hoat dong')
    }
}


