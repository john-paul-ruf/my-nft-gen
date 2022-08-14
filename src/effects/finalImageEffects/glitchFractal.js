import {getRandomIntInclusive, randomId} from "../../logic/math/random.js";
import Jimp from "jimp";
import fs from "fs";
import {LayerFactory} from "../../layer/LayerFactory.js";
import {getWorkingDirectory} from "../../logic/core/gobals.js";

const config = {
    theRandom: {lower: 4, upper: 8},
}

const generate = () => {

    const data = {
        theRandom: getRandomIntInclusive(config.theRandom.lower, config.theRandom.upper),
        getInfo: () => {
            return `${glitchFractalEffect.name} random: ${data.theRandom}`
        }
    }
    return data;
}

const glitchFractal = async (data, layer) => {

    const filename = getWorkingDirectory() + 'fractal' + randomId() + '_underlay.png';

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

    await underlay.opacity(0.75);

    await underlay.writeAsync(filename)

    const compositeLayer = await LayerFactory.getLayerFromFile(filename);

    await layer.compositeLayerOver(compositeLayer);

    fs.unlinkSync(filename);
}

export const effect = {
    invoke: (data, layer) => glitchFractal(data, layer)
}

export const glitchFractalEffect = {
    name: 'glitch fractal',
    generateData: generate,
    effect: effect,
    effectChance: 15,
    requiresLayer: false,
}


