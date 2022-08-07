import {randomId} from "../../logic/math/random.js";
import Jimp from "jimp";
import fs from "fs";
import {WORKINGDIRETORY} from "../../logic/core/gobals.js";

const generate = () => {
    return {
        getInfo: () => {
            return `${glitchInverseEffect.name}`
        }
    };
}

const glitchInverse = async (data, layer) => {

    const filename = WORKINGDIRETORY + 'glitch-inverse' + randomId() + '.png';

    await layer.toFile(filename);

    const jimpImage = await Jimp.read(filename);

    /////////////////////
    // https://github.com/JKirchartz/Glitchy3bitdither/blob/master/source/glitches/inverse.js
    /////////////////////
    const imgData = new Uint32Array(jimpImage.bitmap.data);
    for (let i = 0; i < data.length; i++) {
        imgData[i] = ~imgData[i] | 0xFF000000;
    }
    jimpImage.bitmap.data = Buffer.from(imgData);

    await jimpImage.writeAsync(filename);

    await layer.fromFile(filename);

    fs.unlinkSync(filename);
}

export const effect = {
    invoke: (data, layer) => glitchInverse(data, layer)
}

export const glitchInverseEffect = {
    name: 'glitch inverse',
    generateData: generate,
    effect: effect,
    effectChance: 5,
    requiresLayer: false,
}


