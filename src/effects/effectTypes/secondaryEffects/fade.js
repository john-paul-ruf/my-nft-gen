import {findValue} from "../../../core/math/findValue.js";
import {getRandomIntInclusive, randomNumber} from "../../../core/math/random.js";

const config = {
    lowerRange: {lower: 0.4, upper: 0.6},
    upperRange: {lower: 0.8, upper: 1},
    times: {lower: 3, upper: 6},
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

const fadeAnimated = async (layer, data, currentFrame, totalFrames) => {
    const opacity = findValue(data.lower, data.upper, data.times, totalFrames, currentFrame)
    await layer.adjustLayerOpacity(opacity);
}

export const effect = {
    invoke: (layer, data, currentFrame, totalFrames) => fadeAnimated(layer, data, currentFrame, totalFrames)
}

export const fadeEffect = {
    name: 'fade',
    generateData: generate,
    effect: effect,
    effectChance: 50,
    requiresLayer: false,
}


