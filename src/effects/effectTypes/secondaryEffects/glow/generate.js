import {getRandomIntInclusive} from "../../../../core/math/random.js";
import {glowEffect} from "./effect.js";

const config = {
    lowerRange: {lower: -48, upper: -12},
    upperRange: {lower: 12, upper: 48},
    times: {lower: 1, upper: 2},
}

export const generate = () => {
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