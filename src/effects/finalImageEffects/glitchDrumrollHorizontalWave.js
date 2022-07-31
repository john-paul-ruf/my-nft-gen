import {IMAGESIZE} from "../../logic/gobals.js";

const config = {}

const generate = () => {

    const data = {
        getInfo: () => {
            return `${glitchDrumrollHorizontalWaveEffect.name}`
        }
    }
    return data;
}

const glitchDrumrollHorizontalWave = async (data, img, currentFrame, totalFrames, card) => {

    /////////////////////
    // https://github.com/JKirchartz/Glitchy3bitdither/blob/master/source/glitches/drumrollHorizontalWave.js
    /////////////////////
    // borrowed from https://github.com/ninoseki/glitched-canvas & modified with cosine
    let width = IMAGESIZE, height = IMAGESIZE;

    for (let x = 0; x < width; x++) {
        const roll = Math.floor(Math.cos(x) * (IMAGESIZE * 2))
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
    effectChance: 20,
    requiresLayer: false,
    rotatesImg: false,
    allowsRotation: false,
    rotationTotalAngle: 0,
}


