import {IMAGESIZE} from "../../logic/gobals.js";

const generate = () => {
    return {
        getInfo: () => {
            return `${glitchDrumrollHorizontalWaveEffect.name}`
        }
    };
}

const glitchDrumrollHorizontalWave = async (data, img) => {

    /////////////////////
    // https://github.com/JKirchartz/Glitchy3bitdither/blob/master/source/glitches/drumrollHorizontalWave.js
    /////////////////////
    // borrowed from https://github.com/ninoseki/glitched-canvas & modified with cosine
    for (let x = 0; x < IMAGESIZE; x++) {
        const roll = Math.floor(Math.cos(x) * (IMAGESIZE * 2))
        for (let y = 0; y < IMAGESIZE; y++) {
            let idx = (x + y * IMAGESIZE) * 4;

            let x2 = x + roll;
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
    effectChance: 20,
    requiresLayer: false,
    rotatesImg: false,
    allowsRotation: false,
    rotationTotalAngle: 0,
}


