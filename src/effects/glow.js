import {findValue} from "../logic/findValue.js";
import {getRandomInt} from "../logic/random.js";

const config = {
    lowerRange: {lower: -360, upper: 0},
    upperRange: {lower: 0, upper: 360},
    times:  {lower: 1, upper: 2},
}

const generate = () => {
    return {
        lower: getRandomInt(config.lowerRange.lower, config.lowerRange.upper),
        upper: getRandomInt(config.upperRange.lower, config.upperRange.upper),
        times: getRandomInt(config.times.lower, config.times.upper)
    };
}

const glowAnimated = async (data, img, currentFrame, totalFrames) => {
    const hue = findValue(data.lower, data.upper, data.times, totalFrames, currentFrame)
    await img.color([{apply: 'hue', params: [hue]}]);
}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames) => glowAnimated(data, img, currentFrame, totalFrames)
}

export const glowEffect = {
    name: 'glow',
    generateData: generate,
    effect: effect,
    effectChance: 80,
    requiresLayer: false,
    baseLayer:false,
}

