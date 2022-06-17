import {findValue} from "../logic/findValue.js";
import {getRandomInt, randomNumber} from "../logic/random.js";

const config = {
    lowerRange: {lower: 0.6, upper: 0.7},
    upperRange: {lower: 0.9, upper: 1},
    times:  {lower: 1, upper: 2},
}

const generate = () => {
    return {
        lower: randomNumber(config.lowerRange.lower, config.lowerRange.upper),
        upper: randomNumber(config.upperRange.lower, config.upperRange.upper),
        times: getRandomInt(config.times.lower, config.times.upper)
    };
}

const fadeAnimated = async (data, img, currentFrame, totalFrames) => {
    const opacity = findValue(data.lower, data.upper, data.times, totalFrames, currentFrame)
    await img.opacity(opacity);
}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames) => fadeAnimated(data, img, currentFrame, totalFrames)
}

export const fadeEffect = {
    name: 'fade',
    generateData: generate,
    effect: effect,
    effectChance: 70,
    requiresLayer: false,
    baseLayer:false,
}


