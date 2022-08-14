import {getRandomIntInclusive} from "../../../../core/math/random.js";
import {glitchFractalEffect} from "./effect.js";

const config = {
    theRandom: {lower: 4, upper: 8},
}

export const generate = () => {

    const data = {
        theRandom: getRandomIntInclusive(config.theRandom.lower, config.theRandom.upper),
        getInfo: () => {
            return `${glitchFractalEffect.name} random: ${data.theRandom}`
        }
    }
    return data;
}