import { view  } from 'cc';

let cache :any = {
    path : 'http://localhost:5555/res/int04/',
    home : 'http://localhost:5555/res/',
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