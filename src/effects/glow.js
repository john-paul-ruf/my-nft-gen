import {findValue} from "../logic/findValue.js";
import {getRandomInt} from "../logic/random.js";
import {randomizeEffect} from "./randomize.js";

const config = {
    lowerRange: {lower: -180, upper: 0},
    upperRange: {lower: 0, upper: 180},
    times:  {lower: 1, upper: 4},
}

const generate = () => {
    const data = {
        lower: getRandomInt(config.lowerRange.lower, config.lowerRange.upper),
        upper: getRandomInt(config.upperRange.lower, config.upperRange.upper),
        times: getRandomInt(config.times.lower, config.times.upper),
        getInfo: () => {
            return `${glowEffect.name}: ${data.times} times, ${data.lower} to ${data.upper}`
        }
    }

    return data;
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
    effectChance: 100,
    requiresLayer: false,
    baseLayer:false,
}

