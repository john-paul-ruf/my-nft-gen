import {findValue} from "../../logic/math/findValue.js";
import {getRandomIntInclusive} from "../../logic/math/random.js";

const config = {
    lowerRange: {lower: 1, upper: 5},
    upperRange: {lower: 5, upper: 10},
    times: {lower: 1, upper: 4},
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

const blur = async (data, layer, currentFrame, totalFrames) => {
    const blurGaston = Math.floor(findValue(data.lower, data.upper, data.times, totalFrames, currentFrame));
    await layer.blur(blurGaston);
}

export const effect = {
    invoke: (data, layer, currentFrame, totalFrames) => blur(data, layer, currentFrame, totalFrames)
}

export const blurEffect = {
    name: 'blur',
    generateData: generate,
    effect: effect,
    effectChance: 5,
    requiresLayer: false,
}


