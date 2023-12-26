import {getRandomIntInclusive} from "../../../core/math/random.js";
import {glowEffect} from "./effect.js";

const config = {
    lowerRange: {lower: -18, upper: -0},
    upperRange: {lower: 0, upper: 18},
    times: {lower: 2, upper: 6},
}

export const generate = async (settings) => {
    const data = {
        lower: getRandomIntInclusive(config.lowerRange.lower, config.lowerRange.upper),
        upper: getRandomIntInclusive(config.upperRange.lower, config.upperRange.upper),
        times: getRandomIntInclusive(config.times.lower, config.times.upper),
        getInfo: () => {
            return `${glowEffect.name}: ${data.times} times, ${data.lower} to ${data.upper}`
        }
    }

    return data;
}