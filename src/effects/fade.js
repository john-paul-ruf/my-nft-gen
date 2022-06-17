import {findValue} from "../logic/findValue.js";
import {getRandomInt} from "../logic/random.js";

const config = {
    lowerRange: {lower: 0, upper: 0.2},
    upperRange: {lower: 0.2, upper: 0.4},
    times:  {lower: 1, upper: 4},
}

const generate = () => {
    return {
        lower: getRandomInt(config.lowerRange.lower, config.lowerRange.upper),
        upper: getRandomInt(config.upperRange.lower, config.upperRange.upper),
        times: getRandomInt(config.times.lower, config.times.upper)
    };
}

export const fadeAnimated = async (img, currentFrame, totalFrames) => {
    const data = generate();
    const opacity = findValue(data.lower, data.upper, data.times, totalFrames, currentFrame)
    await img.opacity(opacity);
}

export const fadeAnimatedStrategy = {
    invoke: (img, currentFrame, totalFrames) => fadeAnimated(img, currentFrame, totalFrames)
}

export const fadeEffect = {
    name: 'fade',
    effect: fadeAnimatedStrategy,
    effectChance: 70,
    requiresLayer: false,
    baseLayer:false,
}


