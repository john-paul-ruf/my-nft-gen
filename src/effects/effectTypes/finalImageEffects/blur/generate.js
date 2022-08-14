import {getRandomIntInclusive} from "../../../../core/math/random.js";
import {blurEffect} from "./effect.js";

const config = {
    lowerRange: {lower: 0, upper: 0},
    upperRange: {lower: 1, upper: 2},
    times: {lower: 6, upper: 10},
}

export const generate = () => {

    const data =
        {
            lower: getRandomIntInclusive(config.lowerRange.lower, config.lowerRange.upper),
            upper: getRandomIntInclusive(config.upperRange.lower, config.upperRange.upper),
            times: getRandomIntInclusive(config.times.lower, config.times.upper),
            getInfo: () => {
                return `${blurEffect.name}: ${data.times} times, ${data.lower} to ${data.upper}`
            }
        }
    return data;
}
