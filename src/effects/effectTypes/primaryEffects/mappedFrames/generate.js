import {fileURLToPath} from "url";
import path, {dirname} from "path";
import {mappedFramesEffect} from "./effect.js";
import fs from "fs";
import {getRandomIntExclusive} from "../../../../core/math/random.js";

const config = {
    folderName: '/img/mappedFrames/',
    layerOpacity: 0.75,
}

export const generate = () => {
    const data = {
        layerOpacity: config.layerOpacity,
        getInfo: () => {
            return `${mappedFramesEffect.name}, ${data.folderName}`
        }
    }

    const getMappedFramesFolder = () => {
        const fileURLToPath1 = fileURLToPath(import.meta.url);
        const directory = dirname(fileURLToPath1).replace('/effects/effectTypes/primaryEffects/mappedFrames', '');

        const getFoldersInDirectory = (dir) => {

            const directoryPath = path.join(directory, dir);
            const list = [];

            fs.readdirSync(directoryPath).forEach(file => {
                if (!file.startsWith('.') && fs.lstatSync(directoryPath + file).isDirectory()) {
                    list.push(file + '/');
                }
            });

            return list;
        }

        const folders = getFoldersInDirectory(config.folderName);

        data.folderName = folders[getRandomIntExclusive(0, folders.length)];

        return path.join(directory, config.folderName + data.folderName);

    }

    data.mappedFramesFolder = getMappedFramesFolder();

    return data;
}
