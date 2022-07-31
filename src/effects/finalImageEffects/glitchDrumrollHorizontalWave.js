import {findValue} from "../../logic/findValue.js";
import {getRandomIntInclusive, randomNumber} from "../../logic/random.js";
import {IMAGESIZE} from "../../logic/gobals.js";

const config = {
    lowerRange: {lower: 1, upper: 1.5}, upperRange: {lower: 1.5, upper: 2}, times: {lower: 1, upper: 10},
}

const generate = () => {

    const data = {
        lower: randomNumber(config.lowerRange.lower, config.lowerRange.upper),
        upper: randomNumber(config.upperRange.lower, config.upperRange.upper),
        times: getRandomIntInclusive(config.times.lower, config.times.upper),
        getInfo: () => {
            return `${glitchDrumrollHorizontalWaveEffect.name}: ${data.times} times, ${data.lower.toFixed(2)} to ${data.upper.toFixed(2)}`
        }
    }
    return data;
}

const glitchDrumrollHorizontalWave = async (data, img, currentFrame, totalFrames, card) => {

    const theRollGaston = Math.floor(findValue(data.lower, data.upper, data.times, totalFrames, currentFrame));

    /////////////////////
    // https://github.com/JKirchartz/Glitchy3bitdither/blob/master/source/glitches/drumrollHorizontalWave.js
    /////////////////////
    // borrowed from https://github.com/ninoseki/glitched-canvas & modified with cosine
    let width = IMAGESIZE, height = IMAGESIZE;

    for (let x = 0; x < width; x++) {
        const roll = Math.floor(Math.cos(x) * (IMAGESIZE * theRollGaston))
        for (let y = 0; y < height; y++) {
            let idx = (x + y * width) * 4;

            let x2 = x + roll;
            if (x2 > width - 1) x2 -= width;
            let idx2 = (x2 + y * width) * 4;

            for (let c = 0; c < 4; c++) {
                img.bitmap.data[idx2 + c] = img.bitmap.data[idx + c];
            }
        }
    }
}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames, card) => glitchDrumrollHorizontalWave(data, img, currentFrame, totalFrames, card)
}

export const glitchDrumrollHorizontalWaveEffect = {
    name: 'glitch drumroll horizontal wave',
    generateData: generate,
    effect: effect,
    effectChance: 100,
    requiresLayer: false,
    rotatesImg: false,
    allowsRotation: false,
    rotationTotalAngle: 0,
}


