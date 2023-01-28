import {getRandomIntInclusive} from "../../../../core/math/random.js";
import {blurEffect} from "./effect.js";

const config = {
    lowerRange: {lower: 0, upper: 1},
    upperRange: {lower: 3, upper: 4},
    times: {lower: 2, upper: 6},
    glitchChance: 85,
}

export const generate = () => {

    const data =
        {
            glitchChance: config.glitchChance,
            lower: getRandomIntInclusive(config.lowerRange.lower, config.lowerRange.upper),
            upper: getRandomIntInclusive(config.upperRange.lower, config.upperRange.upper),
            times: getRandomIntInclusive(config.times.lower, config.times.upper),
            getInfo: () => {
                return `${blurEffect.name}: ${data.glitchChance} chance, ${data.times} times, ${data.lower} to ${data.upper}`
            }
        }
    return data;
}
