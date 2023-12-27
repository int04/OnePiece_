import { view  } from 'cc';

let cache :any = {
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
}

export default  cache

export function getImages(name: string, action: string): any {
    let data: object = cache.images.find(e => e.name === name);
    if(data) {
        return data?.actions[action];
    }
}

export function getImagesIndex(i: string, action: string): any {
    let data: object = cache.images[i];
    if(data) {
        return data?.actions[action];
    }
}

export function getListImagesSrc(name : string): any {
    let list = [];
    let data: object = cache.images.find(e => e.name === name);
    if(data) {
        for(let i in data.actions) {
            let src = data.actions[i][0];
            src.forEach(e => {
               if(list.find(x => x === e) === undefined) list.push(e);
            });
        }
    }
    return list;
}