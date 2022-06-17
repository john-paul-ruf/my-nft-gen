import {getRandomInt} from "../../logic/random.js";
import {Effect} from "./Effect.js";

export const generateEffects = (possibleEffectList) => {
    const effectList = [];
    possibleEffectList.forEach(obj => {
            const chance = getRandomInt(0, 100)
            if (obj.effectChance > chance) {
                effectList.push(new Effect(obj.effect))
            }
        }
    )

    return effectList;
}