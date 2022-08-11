import {randomId} from "../../logic/math/random.js";
import Jimp from "jimp";
import fs from "fs";
import {WORKINGDIRETORY} from "../../logic/core/gobals.js";

const generate = () => {
    return {
        getInfo: () => {
            return `${sepiaEffect.name}`
        }
    };
}

const sepia = async (data, layer) => {
    const filename = WORKINGDIRETORY + 'sepia' + randomId() + '.png';

    await layer.toFile(filename);

    const jimpImage = await Jimp.read(filename);

    await jimpImage.sepia();

    await jimpImage.writeAsync(filename);

    await layer.fromFile(filename);

    fs.unlinkSync(filename);
}

export const effect = {
    invoke: (data, layer) => sepia(data, layer)
}

export const sepiaEffect = {
    name: 'sepia',
    generateData: generate,
    effect: effect,
    effectChance: 0, //not a fan
    requiresLayer: false,
}


