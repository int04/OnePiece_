import { view  } from 'cc';

let cache :any = {
    my : {
        id : null,
    },
    start : false,
    path : 'http://192.168.1.139:5555/res/int04/',
    home : 'http://192.168.1.139:5555/res/',
    key : {},
    game : {
        width : view.getFrameSize().width,
        height : view.getFrameSize().height,
    },
    images : [],
    info: {
        server : null,
        version : null,
    },
    resource: ['luffy','ao','quan','toc','mu','tay','lung','dau'],
    server: {
        exp : {
            level : [],
            skill : [],
        }
    },
}

export default  cache

export function getImages(name: string, action: string): any {
    let data: object = cache.images.find(e => e.name === name);
    if(data) {
        // @ts-ignore
        return data?.actions[action];
    }
}

export function getImagesIndex(i: string, action: string): any {
    let data: object = cache.images[i];
    if(data) {
        // @ts-ignore
        return data?.actions[action];
    }
}

export function getListImagesSrc(name : string): any {
    let list = [];
    let data: object = cache.images.find(e => e.name === name);
    if(data) {
        // @ts-ignore
        for(let i in data.actions) {
            // @ts-ignore
            let src = data.actions[i][0];
            src.forEach(e => {
               if(list.find(x => x === e) === undefined) list.push(e);
            });
        }
    }
    return list;
}



export function checkDanh(eff : Array<any>): boolean {
    /*
    * @int04
    * @return true
    * @desc: kiểm tra xem nhân vật có dính hiệu ứng cấm tấn công hay không
    * @return : true nếu được đánh, false neus không được
    *
    * */
    if(typeof eff != 'object' || !eff || eff.length <=0) return true;
    let status = true;
    for(let i = 0; i < eff.length; i++) {
        let elementEFF = eff[i];
        let idSkill = elementEFF[0];
        let j = elementEFF[1];
        let infoSkill = this.skill.find(e => e.id === idSkill);
        if(infoSkill) {
            if(infoSkill.buff && typeof infoSkill.buff == 'object') {
                let getdata = infoSkill.buff[j];
                if(getdata) {
                    let objectGet = getdata[6];
                    objectGet = objectGet || [0,0];
                    if(objectGet[1] == 1) {
                        status = false;
                        break;
                    }
                }
            }
        }
    }
    return status;
}

export function checkDi (eff : Array<any>): boolean {
    /*
    *
    * @int04
    * @method: method
    * @desc: Kiểm tra xem nhân vật có dính hiệu ứng đi không
    * @return: được đi => true, không => false
    *
    * */
    if(typeof eff != 'object' || !eff || eff.length <=0) return true;
    let status = true;
    for(let i = 0; i < eff.length; i++) {
        let elementEFF = eff[i];
        let idSkill = elementEFF[0];
        let j = elementEFF[1];
        let infoSkill = this.skill.find(e => e.id === idSkill);
        if(infoSkill) {
            if(infoSkill.buff && typeof infoSkill.buff == 'object') {
                let getdata = infoSkill.buff[j];
                if(getdata) {
                    let objectGet = getdata[6];
                    objectGet = objectGet || [0,0];
                    if(objectGet[0] == 1) {
                        status = false;
                        break;
                    }
                }
            }
        }
    }
    return status;
}

export function isMenu(): boolean {
    return true;
}

export function isWalk(eff : Array<any>= [], id : any = null): boolean {
    if(cache.my.id === null) return false;
    if(id === null && !isMenu()) return false;
    return checkDi(eff);
}

export function isAttack(eff : Array<any>= [], id : any = null): boolean {
    if(cache.my.id === null) return false;
    if(id === null && !isMenu()) return false;
    return checkDanh(eff);
}