import {findValue} from "../../logic/math/findValue.js";
import {getRandomIntInclusive, randomNumber} from "../../logic/math/random.js";

const config = {
    lowerRange: {lower: 0.7, upper: 0.8},
    upperRange: {lower: 0.9, upper: 1},
    times: {lower: 1, upper: 4},
}

const generate = () => {

    const data =
        {
            lower: randomNumber(config.lowerRange.lower, config.lowerRange.upper),
            upper: randomNumber(config.upperRange.lower, config.upperRange.upper),
            times: getRandomIntInclusive(config.times.lower, config.times.upper),
            getInfo: () => {
                return `${fadeEffect.name}: ${data.times} times, ${data.lower.toFixed(3)} to ${data.upper.toFixed(3)}`
            }
        }
    return data;
}

const fadeAnimated = async (data, layer, currentFrame, totalFrames) => {
    const opacity = findValue(data.lower, data.upper, data.times, totalFrames, currentFrame)
    await layer.adjustLayerOpacity(opacity);
}

export const effect = {
    invoke: (data, layer, currentFrame, totalFrames) => fadeAnimated(data, layer, currentFrame, totalFrames)
}

export const fadeEffect = {
    name: 'fade',
    generateData: generate,
    effect: effect,
    effectChance: 40,
    requiresLayer: false,
}


