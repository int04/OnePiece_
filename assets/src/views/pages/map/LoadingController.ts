import { _decorator, Component, Node, find, Label, ProgressBar, assetManager, TiledMap, Texture2D, SpriteFrame, Sprite, instantiate, UITransform, BoxCollider2D, RigidBody2D, ERigidBody2DType } from 'cc';
import {delay, random} from "db://assets/src/engine/sys";
import cache from "db://assets/src/engine/cache";
import {getTile} from "db://assets/src/views/pages/map/getTile";
import {exportTitled} from "db://assets/src/views/pages/map/exportTiled";
const { ccclass, property } = _decorator;

@ccclass('LoadingController')
export class LoadingController extends Component {
    @property(Label)
    public textLoading: Label = null;
    @property(Label)
    public textTip: Label = null;
    @property(ProgressBar)
    public progress: ProgressBar = null;
    start() {
        this.node.active = true;
    }

    getMapTitled(url:string = ''): any {

        if(typeof url != 'string') { // @ts-ignore
            url = url.toString();
        }
        url = cache.path+'maps/map/' + url+'.tmj';
        return new Promise((res,fai) => {

            // check cache
            let cache = assetManager.assets.get(url);
            if(cache) {
                return res(cache);
            }

            assetManager.loadAny({url : url, type : TiledMap}, (err, data) => {
               // assetManager.assets.add(url, data);
                res(data);
            });
        });
    }

    CallPromise = (url, callback : Function = null) => {
        if(typeof url != 'string') url = url.toString();
        return new Promise((res,fai) => {
            let fullurl = cache.path + url+'';
            // check is exist
            let isExist = assetManager.assets.get(fullurl) as Texture2D;
            if(isExist) {
                if(callback) callback();
                return res(isExist)
            }
            assetManager.loadRemote(fullurl, (err, images) => {
                let texture = new Texture2D();
                // @ts-ignore
                texture.image = images;
                assetManager.assets.add(fullurl, texture);
                if(callback) callback();
                res(texture);
            });
        })
    }

    loadAssetsImages(dataMap)  {
        let list = [];
        let promise = [];
        let t = 0;
        let add = (ob : any ) => {
            let url = ob.url;
            if(list.indexOf(url) === -1) {
                list.push(url);
                promise.push(this.CallPromise(url, () => {
                    t++;
                    this.bar(t / list.length);
                    this.text('Loading '+ob.name+' ('+t+'/'+list.length+') ');
                }));
            }
        }
        return new Promise(async  (res,fai) => {
            dataMap.forEach(e => {
                let url = 'maps/'+e.src;
                add({
                    url : url,
                    name : e.src,
                });
                if(e.animation) {
                    e.animation.forEach(e2 => {
                        let url = 'maps/'+e2.src;
                        add({
                            url : url,
                            name : e2.src,
                        });
                    });
                }
            });
            let timeLoad = Date.now();
            await Promise.all(promise);
            //console.log('load assetImg',Date.now() - timeLoad,'ms')
            res(true);
        })

    }

    async updateMap(name : string) : Promise<void> {
        this.text('Đang tải cấu hình...');
        this.bar(0);
        let map = await this.getMapTitled(name);
        let json = JSON.parse(map);
        this.text('Đang tải gói hình ảnh');
        let assets = await getTile(json.tilesets);
        this.text('Đang đọc gói hình ảnh');
        let dataMap = exportTitled(json, assets);
        await this.loadAssetsImages(dataMap);
        this.renderTexture(dataMap);
    }

    renderTexture(dataMap): void {
        this.text("Đang tiến vào biển cả....");
        this.bar(1);
        let path = find("game/dat");
        let che = find("game/che");
        let minX = null;
        let maxX = null;
        let minY = null;
        let maxY = null;
        dataMap.forEach(e => {
            let link = cache.path+'maps/' + e.src;
            let sprite = this.texture(link);
            sprite.name = e.name;
            if(e.name === 'che') {
                // @ts-ignore
                sprite.parent = che;
            }
            else {
                // @ts-ignore
                sprite.parent = path;
            }


            let scale = 0.9;

            let width = e.width * scale
            let height = e.height * scale

            // @ts-ignore
            sprite.getComponent(UITransform).width = width;
            // @ts-ignore
            sprite.getComponent(UITransform).height = height;

            if(e.name === 'dat' || e.name === 'camdi'){
                //BoxCollider2D, RigidBody2D
                // @ts-ignore
                let box = sprite.addComponent(BoxCollider2D);
                box.size.width = width;
                box.size.height = height;
                box.group = 1;
                // @ts-ignore
                let body = sprite.addComponent(RigidBody2D);
                body.type = ERigidBody2DType.Static;
                body.group = 1;


            }

            let x = 0;
            let y = 0;
            if(e.type === 'OBJECT') {
                x = e.x * scale
                y = e.y  * scale
                y-= (96 * scale)/2;
                // @ts-ignore
                sprite.setAnchorPoint(0.5, 0);

            }
            else {
                x = e.x *  width;
                y = e.y * height
            }

            if(y > 0) {
                y = -y;
            }else {
                y = Math.abs(y)
            }


            x += width/2;



            // @ts-ignore
            sprite.setPosition(x, y);

            if(e.name !== 'may' && e.name !=='bien' && e.name !== 'nui1' && e.name !== 'nui2') {
                if(x < minX || minX == null) minX = x; // lấy giá trị nhỏ nhất
                if(x > maxX || maxX == null) maxX = x; // lấy giá trị lớn nhất
                if(y < minY || minY == null) minY = y; // lấy giá trị nhỏ nhất
                if(y+height > maxY || maxY == null) maxY = y+height; // lấy giá trị lớn nhất
            }

        });
        this.node.active = false;

        let width = Math.abs(maxX - minX);
        let height = Math.abs(maxY - minY);

        cache.map.width = width;
        cache.map.height = height;
        cache.map.x.max = maxX + 24;
        cache.map.x.min = minX
        cache.map.y.max = maxY;
        cache.map.y.min = minY;

        cache.map.y.max += 500;

    }

    textureSpritePrame = (link: string ) => {
        let name = link+"spritetexture";
        let isExist = assetManager.assets.get(name) as SpriteFrame;
        if(isExist) {
            return (isExist);
        }
        else {
            let isExist = assetManager.assets.get(link) as Texture2D;
            const spriteFramec = new SpriteFrame();
            spriteFramec.texture = isExist;
            assetManager.assets.add(name, spriteFramec);
            return (spriteFramec);
        }
    }

    texture = (link: string ) => {
        let name = link+"Node";
        let isExist = assetManager.assets.get(name);
        if(isExist) {
            return instantiate(isExist);
        }
        else {
            let ob = new Node();
            ob.name = 'texure';
            const text = ob.addComponent(Sprite);
            text.spriteFrame = this.textureSpritePrame(link);
            // @ts-ignore
            assetManager.assets.add(name, ob);
            return ob;
        }

    }

    bar (percent: number) {
        this.progress.progress = percent;
    }

    text(text: string) {
        this.textLoading.string = text;
    }

    updateTips():void {
        let tips = [
            "Trò chơi dành cho người trên 12 tuổi, chơi quá 180 phút mỗi ngày sẽ ảnh hưởng đến sức khỏe",
            "Cộng tiềm năng để mạnh hơn",
            "Tham gia hoạt động để nhận quà",
            ]
        let i = random(0, tips.length - 1);
        this.textTip.string = tips[i];
    }

    private timeLine: number = 0;
    update(deltaTime: number) {
        this.timeLine += deltaTime;
        if(this.timeLine > 1) {
            this.timeLine = 0;
            this.updateTips();
        }
    }
}


