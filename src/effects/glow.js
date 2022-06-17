import {findValue} from "../logic/findValue.js";
import {getRandomInt} from "../logic/random.js";

const config = {
    lowerRange: {lower: -360, upper: 0},
    upperRange: {lower: 0, upper: 360},
    times:  {lower: 1, upper: 4},
}

const generate = () => {
    return {
        lower: getRandomInt(config.lowerRange.lower, config.lowerRange.upper),
        upper: getRandomInt(config.upperRange.lower, config.upperRange.upper),
        times: getRandomInt(config.times.lower, config.times.upper)
    };
}

const glowAnimated = async (img, currentFrame, totalFrames) => {
    const data = generate();
    const hue = findValue(data.lower, data.upper, data.times, totalFrames, currentFrame)
    await img.color([{apply: 'hue', params: [hue]}]);
}

export const glowAnimatedStrategy = {
    invoke: (img, currentFrame, totalFrames) => glowAnimated(img, currentFrame, totalFrames)
}

export const glowEffect = {
    name: 'glow',
    effect: glowAnimatedStrategy,
    effectChance: 80,
    requiresLayer: false,
}

