import { _decorator, Component, Node, find, Vec3, tween, EventHandler, input, Input } from 'cc';
import {hanhTrangUI} from "db://assets/src/views/UI/hanhTrangUI";
import cache from "db://assets/src/engine/cache";
import {moveFinished} from "db://assets/src/engine/sys";
const { ccclass, property } = _decorator;

@ccclass('BoxUI')
export class BoxUI extends Component {

    @property(Node)
    private body : Node = null;
    @property(Node)
    private top : Node = null;

    @property(Node)
    private buttonClose : Node = null;
    @property(Node)
    private title : Node = null;
    public async close(): Promise<void> {


        let to0 : Vec3 = this.oldPostion_ButtonClose.clone();
        to0.y = 0 - cache.game.height;

        let to02 : Vec3 = this.oldPostion_Title.clone();
        to02.x = 0 - cache.game.width;
        await Promise.all([moveFinished(this.buttonClose,{
            position : to0
        }, 0.2, 'easeOutCirc'), moveFinished(this.title,{
            position : to02
        }, 0.2, 'easeOutCirc')]);


        let to : Vec3 = new Vec3(-cache.game.width, 0, 0);
        let to2 : Vec3 = new Vec3(cache.game.width+100, 0, 0);
        moveFinished(this.top,{
            position : to2
        }, 0.5, 'easeOutCirc');

        await moveFinished(this.body,{
            position : to
        }, 0.5, 'easeOutCirc');

        let list : any = {
            hanhtrang : ["bag"],
        }
        let body = find("body", this.node);

        for(let parent in list) {
            let node = find(parent, body);
            if(node) {
                let listChild = list[parent];
                for(let child of listChild) {
                    let childNode = find(child, node);
                    if(childNode) childNode.active = false;
                }
            }
            node.active = false;
        }

        this.node.active = false;
    }

    private oldPostion_Body : Vec3 = null;
    private oldPostion_Top : Vec3 = null;
    private oldPostion_ButtonClose : Vec3 = null;
    private oldPostion_Title : Vec3 = null;

    clone():void {
        if(this.oldPostion_Body === null) {
            this.oldPostion_Body = this.body.position.clone();
        }
        if(this.oldPostion_Top === null) {
            this.oldPostion_Top = this.top.position.clone();
        }
        if(this.oldPostion_ButtonClose === null) {
            this.oldPostion_ButtonClose = this.buttonClose.position.clone();
        }
        if(this.oldPostion_Title === null) {
            this.oldPostion_Title = this.title.position.clone();
        }

        this.body.setPosition(this.oldPostion_Body);
        this.top.setPosition(this.oldPostion_Top);
        this.buttonClose.setPosition(this.oldPostion_ButtonClose);
        this.title.setPosition(this.oldPostion_Title);
    }

    animation(): void {
        this.clone();
        let height = cache.game.height;
        let bodySet = this.body.position.clone();
        bodySet.y = 0 - height;
        this.body.setPosition(bodySet);
        tween(this.body)
            .to(0.3, {position : this.oldPostion_Body})
            .start();

        let width = cache.game.width;
        let topSet = this.top.position.clone();
        topSet.x = width + 100;
        this.top.setPosition(topSet);
        tween(this.top)
            .to(0.5, {position : this.oldPostion_Top})
            .start();



    }

    public openBag(name = null): void {
        if(!name) {
            name = "bag";
        }

        input.once (Input.EventType.KEY_UP, (event) => {
            console.log(event.keyCode);
        }, this);
        
        if(this.node.active === false) {
            this.animation();
        }
        
        
        let body = find("body", this.node);
        this.node.active = true;
        let hanhtrang = find("hanhtrang", body);
        if(hanhtrang) {
            hanhtrang.getComponent(hanhTrangUI).run(name);
        }
    }


}


