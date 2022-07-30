import {findValue} from "../../logic/findValue.js";
import {getRandomIntInclusive} from "../../logic/random.js";

const config = {
    lowerRange: {lower: 1, upper: 1},
    upperRange: {lower: 2, upper: 3},
    times: {lower: 1, upper: 4},
}

const generate = () => {

    const data =
        {
            lower: getRandomIntInclusive(config.lowerRange.lower, config.lowerRange.upper),
            upper: getRandomIntInclusive(config.upperRange.lower, config.upperRange.upper),
            times: getRandomIntInclusive(config.times.lower, config.times.upper),
            getInfo: () => {
                return `${blurEffect.name}: ${data.times} times, ${data.lower} to ${data.upper}`
            }
        }
    return data;
}

const blur = async (data, img, currentFrame, totalFrames, card) => {
    const blurGaston = Math.floor(findValue(data.lower, data.upper, data.times, totalFrames, currentFrame));
    await img.blur(blurGaston);
}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames, card) => blur(data, img, currentFrame, totalFrames, card)
}

export const blurEffect = {
    name: 'blur',
    generateData: generate,
    effect: effect,
    effectChance: 50,
    requiresLayer: false,
    rotatesImg: false,
    allowsRotation: false,
    rotationTotalAngle: 0,
}


