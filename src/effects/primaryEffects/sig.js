import {getRandomIntExclusive} from "../../logic/random.js";
import {fileURLToPath} from "url";
import path, {dirname} from "path";
import fs from "fs";

const config = {
    folderName: '../img/png/sig/png/'
}

const generate = () => {
    const data = {
        getInfo: () => {
            return `${sigEffect.name}: ${data.filename}`
        }
    }

    const getSig = () => {
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

        const sigs = getFilesInDirectory(config.folderName);

        data.filename = sigs[getRandomIntExclusive(0, sigs.length)];

        return path.join(directory, config.folderName + data.filename);

    }

    data.sig = getSig();

    return data;
}

const addSig = async (data, layer) => {
    await layer.fromFile(data.sig);
}

export const effect = {
    invoke: (data, layer) => addSig(data, layer)
}

export const sigEffect = {
    name: 'sig',
    generateData: generate,
    effect: effect,
    effectChance: 0,
    requiresLayer: true,
}

