import {getRandomIntInclusive, randomId} from "../../../core/math/random.js";
import Jimp from "jimp";
import fs from "fs";
import {getFinalImageSize, getWorkingDirectory} from "../../../core/GlobalSettings.js";

const config = {
    glitchChance: 50,
    glitchFactor: {lower: 0.5, upper: 0.1}
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

const glitchDrumrollHorizontalWave = async (data, layer) => {
    /////////////////////
    // https://github.com/JKirchartz/Glitchy3bitdither/blob/master/source/glitches/drumrollHorizontalWave.js
    /////////////////////
    // borrowed from https://github.com/ninoseki/glitched-canvas & modified with cosine

    const finalImageSize = getFinalImageSize();
    const filename = getWorkingDirectory() + 'glitch-drumroll' + randomId() + '.png';

    await layer.toFile(filename)

    const jimpImage = await Jimp.read(filename);

    const imgData = jimpImage.bitmap.data;

    for (let x = 0; x < finalImageSize.height; x++) {
        for (let y = 0; y < finalImageSize.width; y++) {
            let idx = (x + y * finalImageSize.width) * 4;

            let x2 = x;

            const theGlitch = getRandomIntInclusive(0, 100);
            if (theGlitch < data.glitchChance) {
                const roll = Math.floor(Math.cos(x) * (finalImageSize.height * getRandomIntInclusive(config.glitchFactor.lower, config.glitchFactor.upper)))
                x2 = x + roll;
            }

            if (x2 > finalImageSize.height - 1) x2 -= finalImageSize.height;
            let idx2 = (x2 + y * finalImageSize.width) * 4;

            for (let c = 0; c < 4; c++) {
                imgData[idx2 + c] = imgData[idx + c];
            }
        }
    }

    jimpImage.bitmap.data = Buffer.from(imgData);
    await jimpImage.writeAsync(filename);

    await layer.fromFile(filename);

    fs.unlinkSync(filename);
}

export const effect = {
    invoke: (data, layer) => glitchDrumrollHorizontalWave(data, layer)
}

export const glitchDrumrollHorizontalWaveEffect = {
    name: 'glitch drumroll horizontal wave',
    generateData: generate,
    effect: effect,
    effectChance: 0,
    requiresLayer: false,
}


