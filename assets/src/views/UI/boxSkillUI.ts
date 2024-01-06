import { _decorator, Component, Node, Label, ProgressBar, Sprite, find } from 'cc';
import {coverSpriteFrame} from "db://assets/src/engine/draw";
import cache from "db://assets/src/engine/cache";
import {preViewSkillUI} from "db://assets/src/views/UI/preViewSkillUI";
const { ccclass, property } = _decorator;

@ccclass('boxSkillUI')
export class boxSkillUI extends Component {
    public data : any = null;
    public skill : any = null;
    @property(Label)
    private nameSkill: Label = null;
    @property(Label)
    private levelSKill: Label = null;
    @property(ProgressBar)
    private progressBar: ProgressBar = null;
    @property(Label)
    private expSkill: Label = null;
    @property(Sprite)
    private iconSkill: Sprite = null;


    updateSkill(myskill : any, element : any = null) : void {
        /*
        * @myskill : thông tin skill người chơi
        * @element: thông tin skill từ hệ thống
        * */
        this.data = myskill;
        this.skill = element;

        this.updateAvatar();
        this.updateName();
        this.updateLevel();
    }

    updateLevel(): void {
        let level : number = this.data[1];
        let my_exp : number = this.data[3];
        let exp_need: number = cache.server.exp.skill[level] || 9999;
        let tile = my_exp/exp_need * 100;
        tile = tile > 100 ? 100 : tile;

        this.levelSKill.string = level.toString();
        this.progressBar.progress = tile/100;
        this.expSkill.string = Math.fround(tile).toFixed(2) + '%';
    }

    updateName(): void {
        this.nameSkill.string = this.skill.name;
    }
    async updateAvatar() : Promise<void> {
        let frame = await coverSpriteFrame(this.skill.avatar);
        this.iconSkill.spriteFrame = frame;
    }


    clickBtn(event = null): void {
        let UI = find("UI/previewSkill");
        if(UI) {
            UI.getComponent(preViewSkillUI).run(this.data, this.skill);
        }
    }

}


