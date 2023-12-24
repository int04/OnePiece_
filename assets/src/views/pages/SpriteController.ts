import { _decorator, Component, Node, find, Label, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SpriteController')
export class SpriteController extends Component {
    @property({
        type: Node
    })
    private sprite: Node = null;
    @property({
        type: Node
    })
    private body : Node = null;
    @property({
        type: Node
    })
    private foot : Node = null;
    private my: any = {};
    private time: number = 0;
    private updated: boolean = false;
    private action: string = 'dungyen';

    public updateName (name : string) : void {
        let node_name = find('name',this.node);
        node_name.getComponent(Label).string = name;
        let dau = find('dau',this.body);
        console.log(dau.getScale())
        console.log(dau.getContentSize())
        node_name.setPosition(
            node_name.getPosition().x,
            dau.getPosition().y + dau.getContentSize().height/2 * dau.getScale().x + node_name.getContentSize().height
        )
        let test = find('UI/testnek');
        this.node.setPosition(
            this.node.getPosition().x,
            test.getPosition().y + test.getContentSize().height/2 + find('quan',this.foot).getContentSize().height/2 * find('quan',this.foot).getScale().x
        )
    }

    public prefLoad(): void {
        this.updateName('concac');
    }

    public updateMy(my : any): void {
        this.my.skin = {
            ao : 'kFFosytneB',
            tay : 'axDwxOtydX',
            lung : 'axDwxOtydX',
            quan : 'QSHGPlNDTK',
            toc : 'vAiaeYISIt',
            dau : 'iLvVMIbTpy',
            non : 'axDwxOtydX',

        }
    }
    start() {
        this.updateMy({});
        this.prefLoad();
    }

    private updateSprite(): void {
        let body = this.body.getPosition();
        let num:number = 3;
        if(this.updated === false) {
            this.updated = true;
            body.y -= num;
            this.body.setPosition(body);
        }
        else {
            this.updated = false;
            body.y += num;
        }
        this.body.setPosition(body);

    }

    update(deltaTime: number) {
        this.time += deltaTime;
        if(this.time >= 0.3) {
            this.time = 0;
            this.updateSprite();
        }

    }
}


