import {fileURLToPath} from "url";
import path, {dirname} from "path";
import {imageOverlayEffect} from "./effect.js";
import fs from "fs";
import {getRandomFromArray, getRandomIntExclusive} from "../../../core/math/random.js";


export const generate = async (settings) => {

    const config = {
        folderName: '/imageOverlay/',
        layerOpacity: [0.95],
        buffer: [1000]
    }

    const data = {
        layerOpacity: getRandomFromArray(config.layerOpacity),
        buffer: getRandomFromArray(config.buffer),
        getInfo: () => {
            return `${imageOverlayEffect.name} ${data.filename} buffer: ${data.buffer}`;
        }
    }

    const getBackdrop = () => {
        const fileURLToPath1 = fileURLToPath(import.meta.url);
        const directory = dirname(fileURLToPath1);

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