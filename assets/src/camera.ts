import { _decorator, Component, Node,Contact2DType, BoxCollider2D  } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('camera')
export class camera extends Component {
    @property({
        type : Node,
        tooltip : 'Sprite'
    })
    private nhanVat: Node = null;

    update(deltaTime: number) {
        // @ts-ignore
        if(this.NhanVat === null) {
            return
        }


        let target_postion = this.nhanVat.getPosition()

        let minX = 0;
        let maxX = 1000;
        let minY = 0;
        let maxY = 1000;


        if(target_postion.x < minX) {
            target_postion.x = minX
        }
        if(target_postion.x > maxX) {
            target_postion.x = maxX
        }
        if(target_postion.y < minY) {
            target_postion.y = minY
        }
        if(target_postion.y > maxY) {
            target_postion.y = maxY
        }


        let current_position = this.node.getPosition()
        current_position.lerp(target_postion, 0.1, current_position)
        this.node.setPosition(current_position)







    }
}


