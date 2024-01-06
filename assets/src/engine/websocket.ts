import { _decorator, Component, Node, find } from 'cc';
import cache from "db://assets/src/engine/cache";
import {deleteNotice, notice} from "db://assets/src/engine/UI";
const { ccclass, property } = _decorator;

// import io
import {default as cccc} from 'db://assets/lib/socketv4.js';
import {loginController} from "db://assets/src/views/pages/loginController";
import {SelectPlayerController} from "db://assets/src/views/pages/SelectPlayerController";
import {createSprite, getSprite, goto, listPlayer, loadMap, resetAll, updatePos} from "../views/pages/MapController";
import {SpriteController} from "db://assets/src/views/pages/sprite/SpriteController";
import {setSkill} from "db://assets/src/views/pages/skills/skillController";
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
        this.ws.on('_', (data: any) => {
            console.log(data);
            cache.server.exp.level = data?.exp?.levelPlayer;
            cache.server.exp.skill = data?.exp?.skillPlayer;
            cache.server.map = data?.map; // # list map
            cache.item = data?.item; // # list item
            cache.thuoctinh = data?.thuoctinh; // # list thuộc tính
        });
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
        // @ts-ignore
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


        this.ws.on('e', (value: string) => {
            deleteNotice();
            switch(value) {
                case 'not_map':
                    notice('Có lỗi xảy ra khi tải bản đồ....');
                    break;
            }
        });


        this.ws.on('map', (data: object) => {
            let status = data[0];
            if(status === true) {
                let pos = data[1];
                updatePos(pos[0],pos[1],pos[2],pos[3]);
                let idmap = pos[0];
                let map = cache.server.map.find(e => e.id === idmap);
                if(map) {
                    let namesheet = map.map;
                    loadMap(namesheet);
                    let data2 = data[2];
                    if(data2) {
                        listPlayer(data2);
                    }
                }
                else {
                    notice('Vui lòng thoát game và vào lại...');
                }
            }
        });



        // Hàm xử lý Map

        this.ws.on('-5', (data: any) => {
            /*
            * @data: là một mảng, trả về danh sách vị trí di chuyển của mob*/
            for(let i = 0; i < data.length; i++) {
                let id = data[i][0];
                let x = data[i][1];
                let y = data[i][2];
                let getMy = getSprite(id);
                if(getMy) {
                    let my = getMy.getComponent(SpriteController).my;
                    my.pos.x = x;
                    my.pos.y = y;
                }
                else {
                    this.getObjectMap();
                }
            }
        });

        this.ws.on('-28', (data: any) => {
            /*
            * @data: bao gồm:
            * 0 : id
            * 1 : eff
            * 2 : chiso
            * */
            let id = data[0];
            let eff = data[1];
            let chiso = data[2];
            let getMy = getSprite(id);
            if(getMy) {
                let my = getMy.getComponent(SpriteController).my;
                my.eff = eff;
                if(chiso) {
                    my.chiso = chiso;
                }
            }
            else {
                this.getObjectMap()
            }
        });

        this.ws.on('HP_15', (data: any) => {
            //! lưu ý
            let id = data[0];
            let newhp = data[1];
            let value = data[2];
            let getMy = getSprite(id);
            if(getMy) {
                let my = getMy.getComponent(SpriteController).my;
                my.info.chiso.hp = newhp;
                /*this.setSkill({
                from : id,
                who : 1,
                type : 'conghp',
                value : value,
            })*/
            }
            else {
                this.getObjectMap()
            }
        });

        this.ws.on('~1S', data => {
            let id = data[0];
            let tenthuoctinh = data[1];
            let newvalue = data[2];
            let value = data[3];
            // lưu ý
            /*
            * this.setSkill({
                from : id,
                newvalue : newvalue,
                thuoctinh : tenthuoctinh,
                type : 'buffEFFCanater',
                value : value,
            })*/
        })

        this.ws.on('BOSS_SPAWN',data => {
            let name_map = data[0];
            let zone = data[1];
            let name_boss = data[2];
            //this.cache_thong_bao.push(name_boss + " đã xuất hiện tại " + name_map + " -  khu " + zone)
        })

        this.ws.on('-25', (data) => {
            let idmob = data[0];
            let hp = data[1];
            let getMy = getSprite(idmob);
            if(getMy) {
                let getMyx = getMy.getComponent(SpriteController);
                getMyx.my.info.chiso.hp = hp;

            }
            else
            {
                this.getObjectMap();
            }
        });

        this.ws.on('-29', (data) => {
            let id = data[0];
            let msg = data[1];
            let getMy = getSprite(id);
            if(getMy) {
                let my = getMy.getComponent(SpriteController);
                my.updateChat(msg);
            }
        });

        this.ws.on('-17', (data) => {
            let name = data[0];
            let id = data[1];
            let value = data[2];
            let type = data[3];
            let hpcon = data[4];
            let getMy = getSprite(id);
            if(getMy) {
                let my = getMy.getComponent(SpriteController).my;
                if(hpcon != 'empty')
                    my.info.chiso.hp = hpcon;
            }
            else
            {
                this.getObjectMap();
            }

            setSkill({
                from : id,
                type : 'hp',
                value : value ,
                st : type,
            })

        });


        this.ws.on('-16', (data) => {
            let keycode = data[0];
            let level = data[1];
            let script = data[2];
            let from = data[3];
            let to = data[4];

            /*let check1 = this.getSprite(from);
            let check2 = this.getSprite(to);
            if(check2 && check1) {
                let get1 = this.getMy(from);
                if(check1.x < check2.x) {
                    get1.action.move = 'right';
                }
                else
                {
                    get1.action.move = 'left';
                }

                let get2 = this.getMy(to);
                if(get1.action.move === 'right') {
                    if(get2.action.action === 'dungyen') {
                        get2.action.move = 'left';
                    }
                }
                else
                {
                    if(get2.action.action === 'dungyen') {
                        get2.action.move = 'right';
                    }
                }
            }
            this.setSkill({
                from : from,
                to : to,
                level : level,
                type : script,
                keycode : keycode,
                value : 0,
            });*/
            // lưu ý: sử lý tấn công
        });


        this.ws.on('-26', (data) => {
            let id = data[0];
            let getMy = getSprite(id);
            if(getMy) {
                let my = getMy.getComponent(SpriteController).my;
                my.info.chiso.hp = 0;
            }
            else
            {
                this.getObjectMap();
            }
        });

        this.ws.on('-27', (data) => {
            let id = data[0];
            let hp = data[1];
            let getMy = getSprite(id);
            if(getMy) {
                let my = getMy.getComponent(SpriteController).my;
                my.info.chiso.hp = hp;
            }
        });

        this.ws.on('-24', (data) => {
            let skill = data[0];
            let my = getSprite(cache.my.id);
            if(my) {
                let myx = my.getComponent(SpriteController).my;
                myx.skill = skill;
            }
        });

        this.ws.on('-22', (data) => {
            let id = data[0];
            let exp_cong = data[1];
            let exp_info = data[2];
            let skill_id = data[3];
            let new_exp = data[4];
            let getMyx = getSprite(id);
            if(getMyx) {
                let getMy = getMyx.getComponent(SpriteController).my;
                if(skill_id) {
                    let skill = getMy.skill.find(e => e[0] == skill_id);
                    if(skill) {
                        skill[3] = new_exp;
                    }
                }
                getMy.info.coban.exp = exp_info;
                if(exp_cong !=0) {

                    setSkill({from : id,
                        type : 'congexp',
                        value : exp_cong,})

                }
            }
        });

        this.ws.on('-23', (data) => {
            let id = data[0];
            let coban = data[1];
            let getMyx = getSprite(id);
            if(getMyx) {
                let getMy = getMyx.getComponent(SpriteController).my;
                getMy.info.coban = coban;
            }
        });

        this.ws.on('MP_15', data => {
            let id = data[0];
            let newhp = data[1];
            let value = data[2];
            let getMy = getSprite(id);
            if(getMy) {
                let my = getMy.getComponent(SpriteController).my;
                my.info.chiso.mp = newhp;
            }

            setSkill({
                from : id,
                who : 2,
                type : 'conghp',
                value : value,
            })

        })

    }

    getObjectMap():void {

    }


}


