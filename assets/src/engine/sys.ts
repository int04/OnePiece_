import { _decorator, sys, math, tween} from 'cc';
//import * as CryptoTS from 'crypto-ts';


import {default as CryptoTS} from 'db://assets/lib/crypto.js';


let get:any = (key: string, data : any = null): any => {
    if(data != null) {
        sys.localStorage.setItem(key, data);
    }
    return sys.localStorage.getItem(key);
}

let encode = (content : any, key: string): string => {
    let defaultz = CryptoTS;
    return content;
    return defaultz.AES.encrypt(content, key).toString();
}

let decode = (content : any, key: string): string => {
    let defaultz = CryptoTS;
    return content;
    return defaultz.AES.decrypt(content, key).toString(defaultz.enc.Utf8);
}

let time = (): number => {
    return sys.now();
}

let random = (min: number, max: number): number => {
    return math.randomRangeInt(min, max);
}

let randomString = (length: number): string => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for(let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result
}

export  {
    get,
    encode,
    decode,
    time,
    random,
    randomString,
}

export function move(WHO: any, NEXT:any, time: number, easingSet: any = 'bounceOut', onComplete: Function = null, onUpdate: Function = null):any {
    return tween(WHO)
        .to(time,
            NEXT,
            {
                easing: 'bounceOut',
                onUpdate : () => {
                    if(onUpdate) {
                        onUpdate();
                    }
                },
                onComplete : () => {
                    if(onComplete) {
                        onComplete();
                    }
                }

            },
            )
        .start()
}

export function moveFinished(WHO: any, NEXT:any, time: number, easingSet: any = 'bounceOut',onUpdate: Function = null):any {
    return new Promise((res : any, fai: any) => {
        tween(WHO)
            .to(time,
                NEXT,
                {
                    easing: 'bounceOut',
                    onUpdate : () => {
                        if(onUpdate) {
                            onUpdate();
                        }
                    },
                    onComplete : () => {
                        res(true)
                    }

                },
            )
            .start()
    })
}


export function number_format(text : any): string {
    if(typeof text === 'number') {
        text = text.toString();
    }
    return text.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export function delay(time: number): any {
    return new Promise((res, fai) => {
        setTimeout(() => {
            res(true);
        }, time);
    })
}