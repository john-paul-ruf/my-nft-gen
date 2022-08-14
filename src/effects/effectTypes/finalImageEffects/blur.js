import {findValue} from "../../../core/math/findValue.js";
import {getRandomIntInclusive} from "../../../core/math/random.js";

const config = {
    lowerRange: {lower: 0, upper: 0},
    upperRange: {lower: 1, upper: 2},
    times: {lower: 6, upper: 10},
}

const generate = () => {

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

const blur = async (layer, data, currentFrame, totalFrames) => {
    const blurGaston = Math.floor(findValue(data.lower, data.upper, data.times, totalFrames, currentFrame));
    if (blurGaston > 0) {
        await layer.blur(blurGaston);
    }
}

export const effect = {
    invoke: (layer, data, currentFrame, totalFrames) => blur(layer, data, currentFrame, totalFrames)
}

export const blurEffect = {
    name: 'blur',
    generateData: generate,
    effect: effect,
    effectChance: 0,
    requiresLayer: false,
}


