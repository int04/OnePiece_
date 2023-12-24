import { _decorator, Component, Node, BoxCollider2D, Contact2DType, Intersection2D, RigidBody2D, UIstranform  } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('sprite')
export class sprite extends Component {
    private key: object = {};
    private speed: number = 240;
    @property({
        type : Node,
        tooltip : 'Node'
    })
    private Block: Node;
    start() {
        // event KEY
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        let collider = this.node.getComponent(BoxCollider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this)

    }


    onCollisionEnter(selfc, orther, contact) {
        console.log('va cham')
    }

    onKeyDown(event): void {
        this.key[event.keyCode] = true;
    }

    onKeyUp(event): void {
        this.key[event.keyCode] = false;
    }

    update(deltaTime: number) {
        let collider = this.getComponent(BoxCollider2D);
        let block = this.Block.getComponent(BoxCollider2D);
        let t = Intersection2D.rectRect(collider.worldAABB, block.worldAABB);
        if(t) {
            // eff collision
            let righe = this.node.getComponent(RigidBody2D);
            righe.wakeUp()
            console.log('vacham')
        }
        // check collision
        if(this.key[37]) {
            console.log('update')
            this.node.setPosition(this.node.getPosition().x - this.speed*deltaTime, this.node.getPosition().y, this.node.getPosition().z)
        }
        if(this.key[38]) {
            this.node.setPosition(this.node.getPosition().x, this.node.getPosition().y + this.speed*deltaTime, this.node.getPosition().z)
        }
        if(this.key[39]) {
            this.node.setPosition(this.node.getPosition().x + this.speed*deltaTime, this.node.getPosition().y, this.node.getPosition().z)
        }
        if(this.key[40]) {
            this.node.setPosition(this.node.getPosition().x, this.node.getPosition().y - this.speed*deltaTime, this.node.getPosition().z)
        }
        
    }
}


