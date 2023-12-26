import {getRandomIntInclusive} from "../../../core/math/random.js";
import {singleLayerBlurEffect} from "./effect.js";

const config = {
    lowerRange: {lower: 0, upper: 0},
    upperRange: {lower: 2, upper: 6},
    times: {lower: 2, upper: 9},
    glitchChance: 100,
}

export const generate = async (settings) => {

    const data =
        {
            glitchChance: config.glitchChance,
            lower: getRandomIntInclusive(config.lowerRange.lower, config.lowerRange.upper),
            upper: getRandomIntInclusive(config.upperRange.lower, config.upperRange.upper),
            times: getRandomIntInclusive(config.times.lower, config.times.upper),
            getInfo: () => {
                return `${singleLayerBlurEffect.name}: ${data.glitchChance} chance, ${data.times} times, ${data.lower} to ${data.upper}`
            }
        }
    return data;
}