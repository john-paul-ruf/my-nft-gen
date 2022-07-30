import {findValue} from "../logic/findValue.js";
import {getRandomIntInclusive} from "../logic/random.js";

const config = {
    lowerRange: {lower: 1, upper: 10},
    upperRange: {lower: 10, upper: 20},
    times: {lower: 1, upper: 4},
}

const generate = () => {

    const data =
        {
            lower: getRandomIntInclusive(config.lowerRange.lower, config.lowerRange.upper),
            upper: getRandomIntInclusive(config.upperRange.lower, config.upperRange.upper),
            times: getRandomIntInclusive(config.times.lower, config.times.upper),
            getInfo: () => {
                return `${pixelateEffect.name}: ${data.times} times, ${data.lower.toFixed(3)} to ${data.upper.toFixed(3)}`
            }
        }
    return data;
}

const pixelate = async (data, img, currentFrame, totalFrames, card) => {
    const pixelateGaston = findValue(data.lower, data.upper, data.times, totalFrames, currentFrame)
    await img.pixelate(pixelateGaston);
}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames, card) => pixelate(data, img, currentFrame, totalFrames, card)
}

export const pixelateEffect = {
    name: 'pixelate',
    generateData: generate,
    effect: effect,
    effectChance: 50,
    requiresLayer: false,
    rotatesImg: false,
    allowsRotation: false,
    rotationTotalAngle: 0,
}


