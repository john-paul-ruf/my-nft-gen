import {getRandomIntExclusive} from "../../logic/random.js";
import {fileURLToPath} from "url";
import path, {dirname} from "path";
import fs from "fs";

const config = {
    folderName: '../img/png/summons/png/'
}

const generate = () => {
    const data = {
        getInfo: () => {
            return `${summonEffect.name}: ${data.filename}`
        }
    }

    const getSummons = () => {
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

        const summons = getFilesInDirectory(config.folderName);

        data.filename = summons[getRandomIntExclusive(0, summons.length)];

        return path.join(directory, config.folderName + data.filename);

    }

    data.summon = getSummons();

    return data;
}

const addSummon = async (data, layer) => {
    await layer.fromFile(data.summon);
}

export const effect = {
    invoke: (data, layer) => addSummon(data, layer)
}

export const summonEffect = {
    name: 'summons',
    generateData: generate,
    effect: effect,
    effectChance: 0,
    requiresLayer: true,
}

