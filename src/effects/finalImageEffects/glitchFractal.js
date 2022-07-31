import {getRandomIntInclusive} from "../../logic/random.js";
import {findValue} from "../../logic/findValue.js";

const config = {
    lowerRange: {lower: 1, upper: 5},
    upperRange: {lower: 5, upper: 10},
    times: {lower: 1, upper: 4},
}

const generate = () => {

    const data = {
        lower: getRandomIntInclusive(config.lowerRange.lower, config.lowerRange.upper),
        upper: getRandomIntInclusive(config.upperRange.lower, config.upperRange.upper),
        times: getRandomIntInclusive(config.times.lower, config.times.upper),
        getInfo: () => {
            return `${glitchFractalEffect.name} ${data.times} times, ${data.lower} to ${data.upper}`
        }
    }
    return data;
}

const glitchFractal = async (data, img, currentFrame, totalFrames) => {

    let theRandomGaston = findValue(data.lower, data.upper, data.times, currentFrame, totalFrames);

    /////////////////////
    // https://github.com/JKirchartz/Glitchy3bitdither/blob/master/source/glitches/fractal.js
    /////////////////////
    for (let j = 0; j < img.bitmap.data.length; j++) {
        if (parseInt(img.bitmap.data[(j * theRandomGaston) % img.bitmap.data.length], 10) < parseInt(img.bitmap.data[j], 10)) {
            img.bitmap.data[j] = img.bitmap.data[(j * theRandomGaston) % img.bitmap.data.length];
        }
    }

}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames) => glitchFractal(data, img, currentFrame, totalFrames)
}

export const glitchFractalEffect = {
    name: 'glitch fractal',
    generateData: generate,
    effect: effect,
    effectChance: 20,
    requiresLayer: false,
    rotatesImg: false,
    allowsRotation: false,
    rotationTotalAngle: 0,
}


