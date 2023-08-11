import {fileURLToPath} from "url";
import path, {dirname} from "path";
import {animatedImageOverlayEffect} from "./effect.js";
import fs from "fs";
import {getRandomIntExclusive} from "../../../../core/math/random.js";

const config = {
    folderName: '/animatedOverlay/'
}

export const generate = () => {
    const data = {
        getInfo: () => {
            return `${animatedImageOverlayEffect.name}, ${data.filename}`
        }
    }

    const getBackdrop = () => {
        const fileURLToPath1 = fileURLToPath(import.meta.url);
        const directory = dirname(fileURLToPath1).replace('/effects/effectTypes/primaryEffects/animatedOverlay', '');

        const getFilesInDirectory = (dir) => {

            const directoryPath = path.join(directory, dir);
            const list = [];

            fs.readdirSync(directoryPath).forEach(file => {
                if (!file.startsWith('.') && !fs.lstatSync(directoryPath + file).isDirectory()) {
                    list.push(file);
                }
            });

            return list;
        }

        const images = getFilesInDirectory(config.folderName);

        data.filename = images[getRandomIntExclusive(0, images.length)];

        return path.join(directory, config.folderName + data.filename);

    }

    data.imageOverlay = getBackdrop();

    return data;
}
