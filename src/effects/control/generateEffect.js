import {getRandomInt} from "../../logic/random.js";
import {Effect} from "./Effect.js";

export const generateEffects = (possibleEffectList, allowRotate) => {
    const effectList = [];

    //For each effect in the possible effects list.
    possibleEffectList.forEach(obj => {
            const chance = getRandomInt(0, 100) //roll the dice
            if (obj.effectChance > chance) { //if the roll was below the chance of hit

                //if the effect does not allow rotate
                //and the possible effect rotates the image
                //Don't allow it
                //TODO: fix how this works it is gross
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