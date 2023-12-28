import { _decorator, Component, Node, UITransform, Canvas, director,tween, Vec3, NodeEventType, EditBox, find, Sprite  } from 'cc';
import { notice} from "db://assets/src/engine/UI";
const { ccclass, property } = _decorator;
import * as system from "db://assets/src/engine/sys";
import socket from "db://assets/src/engine/socket";
import cache from "db://assets/src/engine/cache";
import {coverImg, coverSpriteFrame} from "db://assets/src/engine/draw";

@ccclass('loginController')
export class loginController extends Component {
    @property({
        type: Node,
    })
    private may: Node = null;

    @property({
        type: Node
    })
    private username: Node = null;

    @property({
        type: Node
    })
    private password: Node = null;

    @property({
        type: Node
    })
    private button: Node = null;

    @property({
        type: Node
    })
    private logo: Node = null;

    @property({
        type: Node
    })
    private button_menu : Node = null;

    getAndSetForm(): void {
        let username = system.get('username');
        let password = system.get('password');
        if(username) {
            this.username.getComponent(EditBox).string = username;
        }
        if(password) {
            password = system.decode(password, system.get('key'));
            this.password.getComponent(EditBox).string = password;
        }
    }
    start() {
        this.button.on(NodeEventType.TOUCH_START, this.buttonClick, this)
        this.run();
        this.getAndSetForm();

        let post = this.button_menu.worldPosition;
        if(post.y < 0) {
            post.y = this.button.getContentSize().height/2;
            this.button_menu.setWorldPosition(post);
        }
        this.button_menu.on(NodeEventType.TOUCH_START, () => {

        }, this)
    }
    buttonClick(): void {
        let keycode = system.get('key');
        let username = this.username.getComponent(EditBox).string;
        let password = this.password.getComponent(EditBox).string;

        if(username.length < 1) return notice('Vui lòng nhập tên tài khoản.');
        if(password.length < 1) return notice('Vui lòng nhập mật khẩu.');

        socket().send(-1,[2,[username,password]]);

        password = system.encode(password, keycode);
        if(username && username.length >=1) {
            system.get('username', username);
        }
        if(password && password.length >= 1) {
            system.get('password', password);
        }
        notice('Xin chờ...',false)
    }
    run(): void {
        setTimeout(() => {
            this.buttonClick();
        }, 300);
        let pos = this.username.getPosition();
        let old = pos.clone();
        let to = pos;
        to.x -= 200;
        this.username.setPosition(to)
        tween(this.username)
            .to(0.5, {position: old}, {easing: 'bounceOut'})
            .start()

        let passOLD = this.password.getPosition().clone();
        let passTO = this.password.getPosition().clone();
        passTO.x += 200;
        this.password.setPosition(passTO)
        tween(this.password)
            .to(0.5, {position: passOLD}, {easing: 'bounceOut'})
            .start()

        let buttonOld = this.button.getPosition().clone();
        let buttonTo = this.button.getPosition().clone();
        buttonTo.y += 300;
        this.button.setPosition(buttonTo)
        tween(this.button)
            .to(0.5, {position: buttonOld}, {easing: 'bounceOut'})
            .start()

        let logoOld = this.logo.getPosition().clone();
        let logoTo = this.logo.getPosition().clone();
        logoTo.y -= 300;
        this.logo.setPosition(logoTo)
        tween(this.logo)
            .to(1, {position: logoOld}, {easing: 'bounceOut'})
            .start()
    }

    updateMay = (time : number): void => {
        let may  = this.may.getPosition();
        may.x -= 10*time;
        if(may.x <= -100) {
            may.x = 0;
        }
        this.may.setPosition(may);
    }

    update(deltaTime: number) {
        this.updateMay(deltaTime)
    }
}


