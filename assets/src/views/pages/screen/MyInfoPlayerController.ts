import { _decorator, Component, Node, ProgressBar, Label } from 'cc';
import cache from "db://assets/src/engine/cache";
import {number_format} from "db://assets/src/engine/sys";
const { ccclass, property } = _decorator;

@ccclass('MyInfoPlayerController')
export class MyInfoPlayerController extends Component {
    @property(ProgressBar)
    public hp:ProgressBar = null;

    @property(ProgressBar)
    public mp:ProgressBar = null;

    @property(ProgressBar)
    public exp:ProgressBar = null;

    @property(Label)
    public labelHp:Label = null;

    @property(Label)
    public labelMp:Label = null;

    @property(Label)
    public labelExp:Label = null;

    start() {

    }
    private test:boolean  = false;
    public updateInfo(): void {
        let info = cache.my.info.chiso;
        let coban = cache.my.info.coban;
        if(this.test === false) {
            this.test = true;
            console.log(info)
            console.log(coban)
        }
        let hpBar = info.hp/info.hpmax;
        let mpBar = info.mp/info.mpmax;

        this.hp.progress = hpBar;
        this.mp.progress = mpBar;

        this.labelHp.string = number_format(info.hp) + '/' + number_format(info.hpmax);
        this.labelMp.string = number_format(info.mp) + '/' + number_format(info.mpmax);

        let expneed = cache.server.exp.level[coban.level] || 1;
        let expBar = coban.exp/expneed * 100;
        if(expBar > 100) expBar = 99;
        this.exp.progress = expBar/100;

        this.labelExp.string = '' + coban.level + ' + ' + Math.fround(expBar).toFixed(2) + '%';


    }

    update(deltaTime: number) {
        if(cache.my.id <=0) return;
        this.updateInfo();
    }
}


