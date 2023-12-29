import { _decorator, Component, Node, find } from 'cc';
import cache from "db://assets/src/engine/cache";
import {deleteNotice, notice} from "db://assets/src/engine/UI";
const { ccclass, property } = _decorator;

// import io
import {default as cccc} from 'db://assets/lib/socketv4.js';
import {loginController} from "db://assets/src/views/pages/loginController";
import {SelectPlayerController} from "db://assets/src/views/pages/SelectPlayerController";
import {createSprite, goto, resetAll} from "../views/pages/MapController";
@ccclass('webSocket')
export class webSocket extends Component {
    private ws: Socket = null;

    private connected: boolean = false;
    public send: Function = null;
    public to: Function = null;
    createConnectSocketIO(): void {
        this.ws = cccc(cache.info.server, {
            query : {
                token : cache.info.token
            },
            transports: [ 'websocket'],
        });
        this.methodWebsocket();
        this.onMessage()
    }

    createConnect():void  {
        this.createConnectSocketIO();

    }

    methodWebsocket(): void {
        this.send = function(name: any, data: any) {
            if(this.connected === false) return notice('Chưa thể kết nối đến máy chủ, vui lòng thử lại sau ít phút.');
            if(data) {
                this.ws.emit(name, data);
            } else this.ws.emit(name);
        }

        this.to = function(name: any, data: any) {
            if(data) this.send(name, data);
            else this.send(name);
        }
    }

    onMessage():void {
        this.ws.on('connect', (data: any) => {
            this.connected = true;
            console.log('connect server Success')

        });
        this.ws.on('disconnect', (data) => {
            console.log('Disconect to server')
            this.connected = false;
        });

        this.ws.on('NEW', (value: string) => {
            deleteNotice();
            switch(value) {
                case 'NAME_SPECIAL':
                    notice('Tên nhân vật không được chứa kí tự đặc biệt.');
                    break;
                case 'NAME_LENGTH':
                    notice('Tên nhân vật phải có độ dài từ 5 - 20 kí tự.');
                    break;
                case 'NHANVAT':
                    notice('Bạn chưa chọn nhân vật.');
                    break;
                case 'LOGIN_FAIL':
                    notice('Tên tài khoản hoặc mật khẩu không chính xác.');
                    break;
                case 'NAME_EXIST':
                    notice('Tên nhân vật đã tồn tại.');
                    break;
                case 'FULL':
                    notice('Tài khoản đã có đủ 3 nhân vật, không thể tạo thêm.');
                    break;
                case 'SUCCESS':
                    let login: Node = find("UI/mainLogin");
                    if(login) {
                        login.active = true;
                        login.getComponent(loginController).buttonClick();
                    }
                    let UINV: Node = find("UI/taoNV");
                    if(UINV) {
                        UINV.active = false;
                    }
                    break;
            }
        });

        this.ws.on('LOGIN', (value: string, value2 : object) => {
            deleteNotice();
            switch(value) {
                case 'LOGIN_FAIL':
                    notice('Tên tài khoản hoặc mật khẩu không chính xác.');
                    break;
                case 'SUCCESS':
                    let sceneSelectPlayer: Node = find("UI/chonNV");
                    if(sceneSelectPlayer) {
                        sceneSelectPlayer.getComponent(SelectPlayerController).createSprite(value2);
                    }
                    break;
            }
        });

        this.ws.on('REG', (value: string) => {
            deleteNotice();
            switch(value) {
                case 'USERNAME_INVALID':
                    notice('Tên tài khoản không được chứa kí tự đặc biệt.');
                    break;
                case 'PASSWORD_INVALID':
                    notice('Mật khẩu không được chứa kí tự đặc biệt.');
                    break;
                case 'USERNAME_LENGTH_INVALID':
                    notice('Tài khoản phải có độ dài từ 4 - 20 kí tự');
                    break;
                case 'PASSWORD_LENGTH_INVALID':
                    notice('Mật khẩu phải có độ dài từ 4 - 20 kí tự');
                    break;
                case 'USERNAME_ALREADY_EXISTS':
                    notice('Tài khoản đã tồn tại, vui lòng sử dụng tài khoản khác.');
                    break;
                case 'ERROR':
                    notice('Có lỗi xảy ra, vui lòng liên hệ admin.');
                    break;
                case 'SUCCESS':
                    notice('Đăng ký thành công. Chúc bạn chơi game vui vẻ.');
                    break;
            }
        });

        this.ws.on('PLAY', (value: any) => {
            deleteNotice();
            value.type = 'player';
            let game:Node = find("game");
            game.active = true;
            let sceneSelectPlayer: Node = find("UI/chonNV");
            if(sceneSelectPlayer) {
                sceneSelectPlayer.active = false;
            }
            cache.my = value;
            console.log(value);
            resetAll();
            createSprite(value);
            goto(value.pos.map, null, value.pos.x, value.pos.y);
        });

    }


}


