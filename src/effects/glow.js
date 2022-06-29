import {findValue} from "../logic/findValue.js";
import {getRandomInt} from "../logic/random.js";
import {randomizeEffect} from "./randomize.js";

const config = {
    lowerRange: {lower: -360, upper: 0},
    upperRange: {lower: 0, upper: 360},
    times:  {lower: 1, upper: 4},
}

const generate = () => {
    const data = {
        lower: getRandomInt(config.lowerRange.lower, config.lowerRange.upper),
        upper: getRandomInt(config.upperRange.lower, config.upperRange.upper),
        times: getRandomInt(config.times.lower, config.times.upper),
        getInfo: () => {
            return `${glowEffect.name}: spin hue between ${data.lower} and ${data.upper} a total number of ${data.times} times`
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

