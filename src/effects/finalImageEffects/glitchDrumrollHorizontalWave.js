import {IMAGESIZE} from "../../logic/gobals.js";
import {getRandomIntInclusive} from "../../logic/random.js";
import {findValue} from "../../logic/findValue.js";

const config = {
    lowerRange: {lower: 10, upper: 20},
    upperRange: {lower: 30, upper: 40},
    glitchChance: 25,
    times: {lower: 1, upper: 4},
}

const generate = () => {

    const data = {
        lower: getRandomIntInclusive(config.lowerRange.lower, config.lowerRange.upper),
        upper: getRandomIntInclusive(config.upperRange.lower, config.upperRange.upper),
        times: getRandomIntInclusive(config.times.lower, config.times.upper),
        glitchChance: config.glitchChance,
        getInfo: () => {
            return `${glitchDrumrollHorizontalWaveEffect.name} ${data.times} times, ${data.lower} to ${data.upper}`
        }
    }
    return data;
}

const glitchDrumrollHorizontalWave = async (data, img, currentFrame, totalFrames) => {

    const theRollGaston = Math.floor(findValue(data.lower, data.upper, data.times, totalFrames, currentFrame))


    /////////////////////
    // https://github.com/JKirchartz/Glitchy3bitdither/blob/master/source/glitches/drumrollHorizontalWave.js
    /////////////////////
    // borrowed from https://github.com/ninoseki/glitched-canvas & modified with cosine
    for (let x = 0; x < IMAGESIZE; x++) {
        for (let y = 0; y < IMAGESIZE; y++) {
            let idx = (x + y * IMAGESIZE) * 4;

            const roll = Math.floor(Math.cos(x) * theRollGaston)

            let x2 = x + roll;

            const theGlitch = getRandomIntInclusive(0, 100);
            if (theGlitch < data.glitchChance) {
                x2 = x;
            }

            if (x2 > IMAGESIZE - 1) x2 -= IMAGESIZE;
            let idx2 = (x2 + y * IMAGESIZE) * 4;

            for (let c = 0; c < 4; c++) {
                img.bitmap.data[idx2 + c] = img.bitmap.data[idx + c];
            }
        }
    }
}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames) => glitchDrumrollHorizontalWave(data, img, currentFrame, totalFrames)
}

export const glitchDrumrollHorizontalWaveEffect = {
    name: 'glitch drumroll horizontal wave',
    generateData: generate,
    effect: effect,
    effectChance: 40,
    requiresLayer: false,
    rotatesImg: false,
    allowsRotation: false,
    rotationTotalAngle: 0,
}


