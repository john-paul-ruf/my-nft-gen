import {getRandomIntInclusive} from "../../../../core/math/random.js";
import {glitchFractalEffect} from "./effect.js";

const config = {
    theRandom: {lower: 3, upper: 6},
    glitchChance: 25,
}

export const generate = () => {

    const data = {
        glitchChance: config.glitchChance,
        theRandom: getRandomIntInclusive(config.theRandom.lower, config.theRandom.upper),
        getInfo: () => {
            return `${glitchFractalEffect.name} random: ${data.theRandom}`
        }
    }
    return data;
}