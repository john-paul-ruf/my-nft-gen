import {randomId} from "../../../core/math/random.js";
import Jimp from "jimp";
import fs from "fs";
import {getWorkingDirectory} from "../../../core/GlobalSettings.js";

const generate = () => {
    return {
        getInfo: () => {
            return `${sepiaEffect.name}`
        }
    };
}

const sepia = async (layer) => {
    const filename = getWorkingDirectory() + 'sepia' + randomId() + '.png';

    await layer.toFile(filename);

    const jimpImage = await Jimp.read(filename);

    await jimpImage.sepia();

    await jimpImage.writeAsync(filename);

    await layer.fromFile(filename);

    fs.unlinkSync(filename);
}

export const effect = {
    invoke: (layer) => sepia(layer)
}

export const sepiaEffect = {
    name: 'sepia',
    generateData: generate,
    effect: effect,
    effectChance: 0, //not a fan
    requiresLayer: false,
}


