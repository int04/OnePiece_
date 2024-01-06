import { _decorator, Component, Node, Label, ScrollView, Button, Layout, instantiate, find, UITransform } from 'cc';
import {coverColor} from "db://assets/src/engine/draw";
import {_, getThuocTinh} from "db://assets/src/engine/cache";
import {buttonSkillUI} from "db://assets/src/views/UI/buttonSkillUI";
const { ccclass, property } = _decorator;

@ccclass('preViewSkillUI')
export class preViewSkillUI extends Component {
    @property(ScrollView)
    private scrollViewContent: ScrollView = null;

    @property(ScrollView)
    private scrollViewButton: ScrollView = null;


    @property(Layout)
    private layoutContent: Layout = null;

    @property(Layout)
    private layoutButton: Layout = null;

    @property(Label)
    private nameSkill: Label = null;

    public data : any = null;
    public skill : any = null;


    run(data : any = null, skill : any = null):void {
        this.node.active = true;
        if(data != null) this.data = data;
        if(skill != null) this.skill = skill;
        this.updateName();
        this.updateContent();
        this.updateButton();
    }

    clone(msg : string,type = null, layout : Layout ) : Label {
        if(type === null) type = 'text_title';
        let text_title = find(type, layout.node);
        let clone = instantiate(text_title);
        clone.active = true;
        clone.name = 'int_Clone';
        clone.getComponent(Label).string = msg;
        layout.node.addChild(clone);
        return clone.getComponent(Label);
    }

    updateContent(): void {
        let layout = this.layoutContent;
        for(let child of layout.node.children) {
            if(child.name === 'text_title' || child.name === 'text') continue;
            child.destroy();
        }

        this.clone(this.skill.mota,null, layout);
        this.clone("-----Cơ bản-----",null, layout).color = coverColor('#ff0000');

        let type : object = {
            hotro : 'Hỗ trợ',
            tancong : 'Tấn công',
            bidong : 'Bị động',
        }

        this.clone('Kỹ năng '+type[this.skill.type],'text', layout);


        if(this.skill.type === 'tancong') {
            this.clone(
                _("Gây: ") + Math.round(this.skill.value + this.skill.value/100*this.data[1] ) +"% sát thương " + (this.skill.st == 1 ? _('Vật' +
                    ' lý') : (_('Phép')))
                ,'text', layout);

            this.clone(_("Năng lượng: ") + Math.round(this.skill.mp + this.skill.mp/100 * this.data[1]),'text', layout);
            this.clone(_("Thời gian chờ: ") + this.skill.time + "mili giây",'text', layout);

            this.clone("-----Đặc biệt-----",null, layout).color = coverColor('#006cff');

            if(this.skill.buff && typeof this.skill.buff == 'object') {
                this.skill.buff.forEach(element => {
                    let tenthuoctinh : string = element[0];
                    let value : number = element[1];
                    let thoigiantacdung : number = element[2];
                    let tile : number = element[3];
                    let doituong : number = element[4];
                    let tinh = value + value / 100 * this.data[1];
                    let nameThuocTinh = getThuocTinh(tenthuoctinh);
                    let render : string;
                    let array : Array<string> = ["0",'bản thân','đối thủ','đồng đội'];
                    if(tile*1 >=100) render = ''+(tinh > 0 ? _('Tăng') : _('Giảm'))+' '+tinh+''+nameThuocTinh.value+' '+nameThuocTinh.name+' trong '+thoigiantacdung+' giây cho '+array[doituong]+' ';
                    else render = ''+tile+'% '+(tinh > 0 ? _('Tăng') : _('Giảm'))+' '+tinh+''+nameThuocTinh.value+' '+nameThuocTinh.name+' trong '+thoigiantacdung+' giây cho '+array[doituong]+' ';
                    this.clone(render,'text', layout).color = coverColor('#CC6633');
                });
            }
        }

        if(this.skill.type === 'hotro') {
            this.clone(_("Năng lượng: ") + Math.round(this.skill.mp + this.skill.mp/100 * this.data[1]),'text', layout);
            this.clone(_("Thời gian chờ: ") + this.skill.time + "mili giây",'text', layout);
            if(this.skill.buff && typeof this.skill.buff == 'object') {
                this.skill.buff.forEach(element => {
                    let tenthuoctinh : string = element[0];
                    let value : number = element[1];
                    let thoigiantacdung : number = element[2];
                    let tile : number = element[3];
                    let doituong : number = element[4];
                    let tinh = value + value / 100 * this.data[1];
                    let nameThuocTinh = getThuocTinh(tenthuoctinh);
                    let render : string;
                    let array : Array<string> = ["0",'bản thân','đối thủ','đồng đội'];
                    if(tile*1 >=100) render = ''+(tinh > 0 ? _('Tăng') : _('Giảm'))+' '+tinh+''+nameThuocTinh.value+' '+nameThuocTinh.name+' trong '+thoigiantacdung+' giây cho '+array[doituong]+' ';
                    else render = ''+tile+'% '+(tinh > 0 ? _('Tăng') : _('Giảm'))+' '+tinh+''+nameThuocTinh.value+' '+nameThuocTinh.name+' trong '+thoigiantacdung+' giây cho '+array[doituong]+' ';
                    this.clone(render,'text', layout).color = coverColor('#CC6633');
                });
            }
        }

        if(this.skill.type === 'bidong') {
            let skill = this.skill;
            if(this.skill.buff && typeof this.skill.buff == 'object') {
                for(let tenthuoctinh in skill.buff) {
                    let tinh = this.skill.buff[tenthuoctinh] + skill.buff[tenthuoctinh]/100*this.data[1];
                    tinh = Math.round(tinh);
                    let getThuocTinh2 = getThuocTinh(tenthuoctinh);
                    let render = ''+(tinh > 0 ?_('Tăng') : _('Giảm'))+' '+tinh+''+getThuocTinh2.value+' '+getThuocTinh2.name+' ';
                    this.clone(render,'text', layout)
                }
            }
        }

        layout.updateLayout();


        let size = layout.node.getComponent(UITransform).contentSize;
        let srcollView = this.scrollViewContent.content;
        srcollView.getComponent(UITransform).setContentSize(size.width, size.height+200);

    }

    updateButton(): void {

        let layout = this.layoutButton;
        for(let child of layout.node.children) {
            if(child.name === 'demo') continue;
            child.destroy();
        }


        let list : Array<any> = [["int04","đóng"]];
        if(this.skill.type != 'bidong') {
            for(let i = 0; i < 12; i++) {
                list.push([i, "Gán phím"+(i+1)]);
            }
        }
        let demo = find("demo", layout.node);

        list.forEach(element => {
            let clone = instantiate(demo);
            clone.active = true;
            clone.name = 'int_Clone';
            clone.getComponent(buttonSkillUI).skill = this.skill;
            clone.getComponent(buttonSkillUI).data = this.data;
            clone.getComponent(Button).clickEvents[0].customEventData = element[0];
            let lab = find("Label", clone).getComponent(Label);
            lab.string = element[1];
            layout.node.addChild(clone);
        });

        layout.updateLayout();

        let size = layout.node.getComponent(UITransform).contentSize;
        let srcollView = this.scrollViewButton.content;
        srcollView.getComponent(UITransform).setContentSize(size.width, size.height+200);
    }

    updateName(): void {
        this.nameSkill.string = this.skill.name;
    }

    close(): void {
        this.node.active = false;
    }


}


