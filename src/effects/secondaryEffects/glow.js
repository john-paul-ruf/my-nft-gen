import {findValue} from "../../logic/findValue.js";
import {getRandomIntInclusive} from "../../logic/random.js";

const config = {
    lowerRange: {lower: -20, upper: 0},
    upperRange: {lower: 0, upper: 20},
    times: {lower: 1, upper: 3},
}

const generate = () => {
    const data = {
        lower: getRandomIntInclusive(config.lowerRange.lower, config.lowerRange.upper),
        upper: getRandomIntInclusive(config.upperRange.lower, config.upperRange.upper),
        times: getRandomIntInclusive(config.times.lower, config.times.upper),
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
    effectChance: 50, //testing color scheme work
    requiresLayer: false,
    rotatesImg: false,
    allowsRotation: false,
    rotationTotalAngle: 0,
}

