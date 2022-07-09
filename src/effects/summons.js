import Jimp from "jimp";
import {getRandomInt} from "../logic/random.js";
import {fileURLToPath} from "url";
import path, {dirname} from "path";
import fs from "fs";
import {verticalScanLinesEffect} from "./verticalScanLines.js";

const config = {
    folderName: '/img/png/summons/png/'
}

const generate = () => {
    const data = {
        getInfo: () => {
            return `${summonEffect.name}, ${data.filename}`
        }
    }

    const getSummons = () => {
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

        const summons = getFilesInDirectory(config.folderName);

        data.filename = summons[getRandomInt(0, summons.length)];

        return path.join(directory, config.folderName + data.filename);

    }

    data.summon = getSummons();

    return data;
}

const addSummon = async (data, img, currentFrame, numberOfFrames) => {

    let overlay = await Jimp.read(data.summon);

    await img.composite(overlay, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
    })
}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames) => addSummon(data, img, currentFrame, totalFrames)
}

export const summonEffect = {
    name: 'summons',
    generateData: generate,
    effect: effect,
    effectChance: 70,
    requiresLayer: true,
    rotatesImg:false,
    allowsRotation: true,
}

