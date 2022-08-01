import Jimp from "jimp";
import {getRandomIntExclusive} from "../../logic/random.js";
import {fileURLToPath} from "url";
import path, {dirname} from "path";
import fs from "fs";

const config = {
    folderName: '/img/png/backdrops/'
}

const generate = () => {
    const data = {
        getInfo: () => {
            return `${backdropEffect.name}, ${data.filename}`
        }
    }

    const getBackdrop = () => {
        const fileURLToPath1 = fileURLToPath(import.meta.url);
        const directory = dirname(fileURLToPath1).replace('/effects', '');

        const getFilesInDirectory = (dir) => {

            const directoryPath = path.join(directory, dir);
            const list = [];

            fs.readdirSync(directoryPath).forEach(file => {
                if (!file.startsWith('.') && path.extname(file) === '.png') {
                    list.push(file);
                }
            });

            return list;
        }

        const backdrops = getFilesInDirectory(config.folderName);

        data.filename = backdrops[getRandomIntExclusive(0, backdrops.length)];

        return path.join(directory, config.folderName + data.filename);

    }

    data.backdrop = getBackdrop();

    return data;
}

const addBackdrop = async (data, img) => {

    let overlay = await Jimp.read(data.backdrop);

    await img.composite(overlay, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
        rotationTotalAngle: .25,
    })
}

export const effect = {
    invoke: (data, img) => addBackdrop(data, img)
}

export const backdropEffect = {
    name: 'backdrop',
    generateData: generate,
    effect: effect,
    effectChance: 0,
    requiresLayer: true,
    rotatesImg: false,
    allowsRotation: true,
    rotationTotalAngle: 30,
}

