import { _decorator, Component, Node, find, BoxCollider2D, Intersection2D, Vec3 } from 'cc';
import {SpriteController} from "db://assets/src/views/pages/sprite/SpriteController";
const { ccclass, property } = _decorator;

@ccclass('CaiBongController')
export class CaiBongController extends Component {

    private y = -20; // default
    @property(Node)
    public sprite: (Node)  = null;
    start() {

    }

    checkChamDat(): boolean {
        let map = find("game/dat");
        // @ts-ignore
        let sprite = this.sprite.getComponent(SpriteController).getComponent(BoxCollider2D);
        if(sprite === null) return false;
        for(let i = 0; i < map.children.length; i++) {
            let name = map.children[i].name;
            if(name === 'dat') {
                let collider = map.children[i].getComponent(BoxCollider2D);
                // @ts-ignore
                let t = Intersection2D.rectRect(collider.worldAABB, sprite.worldAABB);
                if(t) {
                    return true;
                }
            }
        }

        return false;
    }



    async updateThat(): Promise<void> {
        if(this.checkChamDat()) {
            this.node.active = true;
            return
        }
        this.node.active = false;


    }


}


