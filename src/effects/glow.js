import {findValue} from "../logic/findValue.js";
import {getRandomInt} from "../logic/random.js";
import {randomizeEffect} from "./randomize.js";

const config = {
    lowerRange: {lower: -50, upper: 0},
    upperRange: {lower: 0, upper: 50},
    times:  {lower: 1, upper: 3},
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

const glowAnimated = async (data, img, currentFrame, totalFrames, card) => {
    const hue = findValue(data.lower, data.upper, data.times, totalFrames, currentFrame)
    await img.color([{apply: 'hue', params: [hue]}]);
}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames, card) => glowAnimated(data, img, currentFrame, totalFrames, card)
}

export const glowEffect = {
    name: 'glow',
    generateData: generate,
    effect: effect,
    effectChance: 100,
    requiresLayer: false,
    rotatesImg:false,
    allowsRotation: false,
    rotationTotalAngle: 0,
}

