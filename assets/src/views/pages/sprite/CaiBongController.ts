import { _decorator, Component, Node, find, BoxCollider2D, Intersection2D, Vec3, UITransform } from 'cc';
import {SpriteController} from "db://assets/src/views/pages/sprite/SpriteController";
const { ccclass, property } = _decorator;

@ccclass('CaiBongController')
export class CaiBongController extends Component {

    private y = -20; // default
    @property(Node)
    public sprite: (Node)  = null;
    start() {

    }

    async checkChamDat(): Promise<boolean> {
        let map = find("game/dat");
        // @ts-ignore
        let sprite = this.sprite.getComponent(SpriteController).getComponent(BoxCollider2D);
        if(!sprite) return true;

        let pos = this.node.getPosition();


        let size = await  this.sprite.getComponent(SpriteController).getOnly();

        pos.y = 0 - size.height/2 + 5;

        this.node.setPosition(pos);


        if(sprite === null) return true;
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
        let value:boolean = await this.checkChamDat();
        if(value) {
           // this.node.active = true;
            return
        }
        console.log('không hd')
       // this.node.active = false;


    }


}


