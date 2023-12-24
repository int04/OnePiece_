import { _decorator, Component, Node, ScrollView, find, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('menuLoginController')
export class menuLoginController extends Component {
    @property({
        type: Node,
        tooltip : 'Lớp bar',
    })
    private srcollView: Node = null;

    private valueMenu: number = 0;
    private Inow: number = 0;

    public event1():void {
        console.log('hello')
    }

    public KEY_UP(e: any): void {
        let keycode = e.keyCode;
        console.log(keycode)
        let List = this.srcollView.getComponent(ScrollView).content;
        let item = find('item'+this.Inow,List);
        let che = find('che',item);

        if(keycode == 13) {
            item.emit(Node.EventType.TOUCH_START, item);
            item.emit(Node.EventType.TOUCH_END, item);
            return;
        }

        che.active = false;

        if(keycode == 38) {
            this.Inow -= 1;
            if(this.Inow < 0) this.Inow = this.valueMenu;
        } else if(keycode == 40) {
            this.Inow += 1;
            if(this.Inow > this.valueMenu) this.Inow = 0;
        }
        item = find('item'+this.Inow,List);
        che = find('che',item);
        che.active = true;

        // auto scroll
        let scroll = this.srcollView.getComponent(ScrollView);

        // auto scroll to item center
        let size = scroll.node.getContentSize();
        let itemSize = item.getContentSize();
        let itemPos = item.getPosition();
        let itemPosInView = itemPos.y - itemSize.height / 2;
        let viewPos = scroll.content.getPosition();
        let viewPosInView = viewPos.y + size.height / 2;
        let y = itemPosInView - viewPosInView;
        let offset = scroll.getScrollOffset();
        let to = offset.y + y;
        let max = scroll.getMaxScrollOffset();
        if(to < 0) to = 0;
        if(to > max.y) to = max.y;
        scroll.scrollToOffset(new Vec2(offset.x, to), 0.5, true);



    }

    public open(): void {
        this.node.active = true;
        this.Inow = 0;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.KEY_UP, this);
    }

    public close():void {
        this.node.active = false;
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.KEY_UP, this);
    }

    start() {
        this.node.active = true;
        this.open()
        let t = this.srcollView.getComponent(ScrollView).content;
        let demo = find('demo',t);
        console.log(demo)
        let list: any = [
            ['Chức năng',this.event1],
            ['Chức năng',this.event1],
            ['Chức năng',this.event1],
            ['Chức năng',this.event1],
            ['Chức năng',this.event1],
            ['Chức năng',this.event1],
            ['Chức năng',this.event1],
            ['Chức năng',this.event1],
            ['Chức năng',this.event1],
            ['Chức năng',this.event1],
            ['Chức năng',this.event1],
            ['Chức năng',this.event1],
        ];
        let height:number = 0;
        for(let i:number = 0; i < list.length; i++) {
            let clone = cc.instantiate(demo);
            clone.active = true;
            clone.getChildByName('name').getComponent(cc.Label).string = list[i][0] + ' ' + i;
            clone.name = 'item'+i;
            clone.on(Node.EventType.TOUCH_START, list[i][1], this);
            let size = clone.getContentSize();
            clone.setPosition(0, -size.height * i  - 10*i - 20 , 0);
            t.addChild(clone);
            height += size.height + 10;
            if(i == 0) {
                let che = find('che',clone);
                che.active = true;
            }
        }
        demo.active = false;
        t.setContentSize(t.getContentSize().width, height);
        this.valueMenu = list.length - 1;
    }

    update(deltaTime: number) {
        
    }
}


