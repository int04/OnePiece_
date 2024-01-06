import { _decorator, Component, Node, UITransform, Label, ProgressBar } from 'cc';
import cache from "db://assets/src/engine/cache";
import {tool} from "db://assets/src/engine/tool";
import {XHR} from "db://assets/src/engine/draw";

const { ccclass, property } = _decorator;

import * as system from "db://assets/src/engine/sys";
import socket from "db://assets/src/engine/socket";


@ccclass('loadController')
export class loadController extends Component {
    @property({
        type: Node,
    })
    private loading: Node = null;

    @property({
        type: Node,
    })
    private file: Node = null;

    @property({
        type: Node
    })
    private bar: Node = null;
    private time: number = 0;
    private text: number = 0;

    async  start() {



        this.node.active = true;
        this.updateFile('Loading config....')
        let json: any = await XHR('config.json');
        json = json.json;
        cache.info = {
            server: json.server,
            version: json.version,
            token: system.randomString(10),
        }
        socket().createConnect();
        this.updateBar(1)
        this.updateFile('Update Package JSON')
        this.updateBar(0)

        let src: any = cache.resource;
        let downloaded: number = 0;
        let promise:any = [];
        src.forEach((item: String) => {
            let url: String = './assets/package/' + item + '.json?v=' + cache.info.version;
            promise.push(
                XHR(url, () => {
                    downloaded++;
                    this.updateFile('Loading ' + item + '....')
                    this.updateBar(downloaded / src.length)
                })
            )
        });
        let callback:any = await Promise.all(promise);
        callback.forEach((item: String, index:number) => {
            let data:any = callback[index].json
            cache.images = cache.images.concat(data);
        })
        this.node.active = false;

        cache.start = true;
        if(system.get('key') === null) {
            let time: number = system.time();
            let version: string = cache.info.version;
            let randomAz: string = system.randomString(10);
            let content:string = time + version + randomAz;
            let keyCode = system.encode(content, 'int04');
            system.get('key', keyCode);
        }
    }

    updateFile = (string: string) => {
        this.file.getComponent(Label).string = string;
    }

    updateBar = (percent: number) => {
        this.bar.getComponent(ProgressBar).progress = percent;
    }

    update(deltaTime: number) {
        this.time += deltaTime;
        if(this.time >=0.5) {
            this.time = 0;
            let string = 'loading';
            if(this.text === 0) string = 'loading.'
            if(this.text === 1) string = 'loading..'
            if(this.text === 2) string = 'loading...'
            this.text++;
            if(this.text > 2) this.text = 0;
            this.loading.getComponent(Label).string = string;
        }

    }
}


