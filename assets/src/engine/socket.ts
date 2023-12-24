import {webSocket} from "db://assets/src/engine/websocket";
import { _decorator, Node, find} from 'cc';


/*
*   let ws;

let on;
let connectServer = (self) => {
    console.log('CONNECT TO SERVER....')
    ws = io(cache.gameInfo.server, {
        query : {
            token : 'cache.gameInfo.token'
        },
        transports: [ 'websocket'],
    });
    engine.emit('connect','success');
}

let send = (name, data) => {
    if(data) {
        ws.emit(name, data);
    } else ws.emit(name);
}

let to = (name, data) => {
    if(data) send(name, data);
    else send(name);
}


on = (name, callback) => {
    ws.on(name, callback);
}

export {
    connectServer,
    send,
    to,
    on,
}
*
* */

export default  (): webSocket => {
    let ws = find("SOCKET.IO");
    let socket = ws.getComponent(webSocket)
    return socket;
}



