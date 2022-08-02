import {IMAGESIZE} from "../../logic/gobals.js";
import {getRandomIntInclusive} from "../../logic/random.js";

const config = {
    glitchChance: 3
}

const generate = () => {

    const data = {
        glitchChance: config.glitchChance,
        getInfo: () => {
            return `${glitchDrumrollHorizontalWaveEffect.name}`
        }
    }
    return data;
}

const glitchDrumrollHorizontalWave = async (data, img, currentFrame, totalFrames) => {
    /////////////////////
    // https://github.com/JKirchartz/Glitchy3bitdither/blob/master/source/glitches/drumrollHorizontalWave.js
    /////////////////////
    // borrowed from https://github.com/ninoseki/glitched-canvas & modified with cosine

    const imgData = img.bitmap.data;

    for (let x = 0; x < IMAGESIZE; x++) {
        for (let y = 0; y < IMAGESIZE; y++) {
            let idx = (x + y * IMAGESIZE) * 4;

            const roll = Math.floor(Math.cos(x) * (IMAGESIZE * 2))

            let x2 = x + roll;

            const theGlitch = getRandomIntInclusive(0, 100);
            if (theGlitch < data.glitchChance) {
                x2 = x;
            }

            if (x2 > IMAGESIZE - 1) x2 -= IMAGESIZE;
            let idx2 = (x2 + y * IMAGESIZE) * 4;

            for (let c = 0; c < 4; c++) {
                imgData[idx2 + c] = imgData[idx + c];
            }
        }
    }

    img.bitmap.data = new Buffer(imgData);
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


