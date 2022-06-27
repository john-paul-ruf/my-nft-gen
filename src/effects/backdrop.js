import Jimp from "jimp";
import {getRandomInt} from "../logic/random.js";
import {fileURLToPath} from "url";
import path, {dirname} from "path";
import fs from "fs";
import {verticalScanLinesEffect} from "./verticalScanLines.js";

const config = {
    folderName: '/img/png/backdrops/'
}

const generate = () => {
    const data = {
        getInfo: () => {
            return `${backdropEffect.name}, Filename: ${data.filename}`
        }
    }

    const getBackdrop = () => {
        const fileURLToPath1 = fileURLToPath(import.meta.url);
        const directory = dirname(fileURLToPath1).replace('/effects', '');

        const getFilesInDirectory = (dir) => {

            const directoryPath = path.join(directory, dir);
            const list = [];

            fs.readdirSync(directoryPath).forEach(file => {
                if (!file.startsWith('.')) {
                    list.push(file);
                }
            });

            return list;
        }

        const backdrops = getFilesInDirectory(config.folderName);

        data.filename = backdrops[getRandomInt(0, backdrops.length - 1)];

        return path.join(directory, config.folderName + data.filename);

    }

    data.backdrop = getBackdrop();

    return data;
}

const addBackdrop = async (data, img, currentFrame, numberOfFrames) => {

    let overlay = await Jimp.read(data.backdrop);

    await img.composite(overlay, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
    })
}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames) => addBackdrop(data, img, currentFrame, totalFrames)
}

export const backdropEffect = {
    name: 'backdrop',
    generateData: generate,
    effect: effect,
    effectChance: 70,
    requiresLayer: true,
    baseLayer: true,
}
