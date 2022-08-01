import {getRandomIntInclusive} from "../../logic/random.js";

const config = {
    theRandom: {lower: 2, upper: 10},
    times: {lower: 1, upper: 4},
}

const generate = () => {

    const data = {
        theRandom: getRandomIntInclusive(config.theRandom.lower, config.theRandom.upper),
        times: getRandomIntInclusive(config.times.lower, config.times.upper),
        getInfo: () => {
            return `${glitchFractalEffect.name} random: ${data.theRandom}`
        }
    }
    return data;
}

const glitchFractal = async (data, img) => {
    /////////////////////
    // https://github.com/JKirchartz/Glitchy3bitdither/blob/master/source/glitches/fractal.js
    /////////////////////
    for (let j = 0; j < img.bitmap.data.length; j++) {
        if (parseInt(img.bitmap.data[(j * data.theRandom) % img.bitmap.data.length], 10) < parseInt(img.bitmap.data[j], 10)) {
            img.bitmap.data[j] = img.bitmap.data[(j * data.theRandom) % img.bitmap.data.length];
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


