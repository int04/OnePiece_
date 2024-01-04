import { _decorator, sys, math, tween, find, Node} from 'cc';
import {randomString} from "db://assets/src/engine/sys";
import {hpTextSKill} from "db://assets/src/views/pages/skills/text/hpTextSKill";
import {congExpTextSKill} from "db://assets/src/views/pages/skills/text/congExpTextSKill";
import {congHPTextSKill} from "db://assets/src/views/pages/skills/text/congHPTextSKill";


export function runAnimationSkill(data : any) {
    let node = new Node(data.id);
    let query;
    if(data.scene === 'skill') query =find("game/skill");
    else query = find("game/skill_back");
    query.addChild(node);
    switch(data.type) {
        case 'hp':
            node.addComponent(hpTextSKill);
            node.getComponent(hpTextSKill).play(data);
            break;
        case  'congexp':
            node.addComponent(congExpTextSKill);
            node.getComponent(congExpTextSKill).play(data);
            break;

        case 'conghp':
            node.addComponent(congHPTextSKill);
            node.getComponent(congHPTextSKill).play(data);
            break;

    }
}

export function setSkill(data : any) {
    data.scene = data.scene || 'skill';
    data.id = data.id || randomString(10);

    let query;
    if(data.scene === 'skill') query = find("game/skill");
    else query = find("game/skill_back");

    let check = find(data.id, query);
    if(check) return;

    return runAnimationSkill(data);
}