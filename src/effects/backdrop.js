import Jimp from "jimp";
import {getRandomInt} from "../logic/random.js";
import {fileURLToPath} from "url";
import path, {dirname} from "path";

const config = {
    folderName: '/img/png/backdrops/png'
}

const generate = () => {
    const data = {
    }

    const getBackdrop = () => {
        const fileURLToPath1 = fileURLToPath(import.meta.url);
        const directory = dirname(fileURLToPath1).replace('/effects/control', '');

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

        return backdrops[getRandomInt(0, backdrops.length - 1)];

    }

    data.backdrop = getBackdrop();

    return data;
}

const addBackdrop = async (data, img, currentFrame, numberOfFrames) => {

    let overlay = new Jimp(data.backdrop);

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

