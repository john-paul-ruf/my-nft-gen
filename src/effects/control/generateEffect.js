import {getRandomInt} from "../../logic/random.js";
import {Effect} from "./Effect.js";

export const generateEffects = (possibleEffectList, allowRotate) => {
    const effectList = [];
    possibleEffectList.forEach(obj => {
            const chance = getRandomInt(0, 100)
            if (obj.effectChance > chance) {
                if(!allowRotate && obj.rotatesImg)
                {
                   //do not allow rotation
                } else
                {
                    effectList.push(new Effect(obj));
                }
            }
        }
    )

    return effectList;
}