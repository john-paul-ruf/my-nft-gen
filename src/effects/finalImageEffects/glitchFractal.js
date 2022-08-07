import {getRandomIntInclusive, randomId} from "../../logic/math/random.js";
import Jimp from "jimp";
import {findValue} from "../../logic/math/findValue.js";
import fs from "fs";
import {LayerFactory} from "../../layer/LayerFactory.js";
import {LAYERSTRATEGY, WORKINGDIRETORY} from "../../logic/core/gobals.js";

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

const glitchFractal = async (data, layer, currentFrame, totalFrames) => {

    const filename = WORKINGDIRETORY + 'fractal' + randomId() + '_underlay.png';

    await layer.toFile(filename);

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

    await underlay.writeAsync(filename)

    const compositeLayer = await LayerFactory.getLayerFromFile(LAYERSTRATEGY, filename);

    await layer.compositeLayerOver(compositeLayer);

    fs.unlinkSync(filename);
}

export const effect = {
    invoke: (data, layer, currentFrame, totalFrames) => glitchFractal(data, layer, currentFrame, totalFrames)
}

export const glitchFractalEffect = {
    name: 'glitch fractal',
    generateData: generate,
    effect: effect,
    effectChance: 5,
    requiresLayer: false,
}


