import {getRandomIntInclusive, randomId} from "../../logic/random.js";
import Jimp from "jimp";
import {findValue} from "../../logic/findValue.js";
import fs from "fs";

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

const glitchFractal = async (data, img, currentFrame, totalFrames) => {

    const filename = 'fractal' + randomId() + '_underlay.png';

    await img.writeAsync(filename);

    const underlay = await Jimp.read(filename);

    /////////////////////
    // https://github.com/JKirchartz/Glitchy3bitdither/blob/master/source/glitches/fractal.js
    /////////////////////
    for (let j = 0; j < underlay.bitmap.data.length; j++) {
        if (parseInt(underlay.bitmap.data[(j * data.theRandom) % underlay.bitmap.data.length], 10) < parseInt(underlay.bitmap.data[j], 10)) {
            underlay.bitmap.data[j] = underlay.bitmap.data[(j * data.theRandom) % underlay.bitmap.data.length];
        }
    }

    const theBlurGaston = Math.ceil(findValue(1, 3, data.times, totalFrames, currentFrame));
    await underlay.blur(theBlurGaston);

    await underlay.opacity(0.4);

    await img.composite(underlay, 0, 0, {
        mode: Jimp.BLEND_DESTINATION_OVER,
    });

    fs.unlinkSync(filename);
}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames) => glitchFractal(data, img, currentFrame, totalFrames)
}

export const glitchFractalEffect = {
    name: 'glitch fractal',
    generateData: generate,
    effect: effect,
    effectChance: 40,
    requiresLayer: false,
    rotatesImg: false,
    allowsRotation: false,
    rotationTotalAngle: 0,
}


