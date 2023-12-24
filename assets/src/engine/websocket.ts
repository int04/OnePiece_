import { _decorator, Component, Node, find } from 'cc';
import cache from "db://assets/src/engine/cache";
import {notice} from "db://assets/src/engine/UI";
const { ccclass, property } = _decorator;

// import io
import {default as cccc} from 'db://assets/lib/socketv4.js';
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

    }


}


