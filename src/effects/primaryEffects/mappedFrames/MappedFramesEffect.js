import {LayerEffect} from "../../LayerEffect.js";
import {GlobalSettings} from "../../../core/GlobalSettings.js";
import {getRandomIntExclusive, randomId} from "../../../core/math/random.js";
import fs from "fs";
import {fileURLToPath} from "url";
import path, {dirname} from "path";
import {mapNumberToRange} from "../../../core/math/mapNumberToRange.js";
import {LayerFactory} from "../../../core/factory/layer/LayerFactory.js";
import {Settings} from "../../../core/Settings.js";

export class MappedFramesEffect extends LayerEffect {

    static _name_ = 'mapped-frames';

    static _config_  = {
        folderName: '/mappedFrames/',
        layerOpacity: 1,
    }

    constructor({
                    name = MappedFramesEffect._name_,
                    requiresLayer = true,
                    config = MappedFramesEffect._config_,
                    additionalEffects = [],
                    ignoreAdditionalEffects = false,
                    settings = new Settings({})
                }) {
        super({
            name: name,
            requiresLayer: requiresLayer,
            config: config,
            additionalEffects: additionalEffects,
            ignoreAdditionalEffects: ignoreAdditionalEffects,
            settings: settings
        });
        this.#generate(settings)
    }


    async #copyFile(filename, destinationFilename) {
        return new Promise((resolve) => {
            fs.copyFile(filename, destinationFilename, () => {
                resolve();
            });
        });
    }

    async #getAllFilesInDirectory(dir) {
        const list = [];

        fs.readdirSync(dir).forEach(file => {
            if (!file.startsWith('.') && !fs.lstatSync(dir + file).isDirectory()) {
                list.push(dir + file);
            }
        });

        return list;
    }

    async #extractFrame(context) {
        const frames = await this.#getAllFilesInDirectory(context.data.mappedFramesFolder)
        const index = Math.floor(mapNumberToRange(context.currentFrame, 0, context.numberOfFrames, 0, frames.length - 1));

        return this.#copyFile(frames[index], context.filename);
    }

    async #mappedFrames(layer, currentFrame, numberOfFrames) {

        const context = {
            currentFrame: currentFrame,
            numberOfFrames: numberOfFrames,
            data: this.data,
            filename: GlobalSettings.getWorkingDirectory() + 'mapped-frame' + randomId() + '.png',

        }

        await this.#extractFrame(context);

        let tempLayer = await LayerFactory.getLayerFromFile(context.filename);

        await tempLayer.adjustLayerOpacity(this.data.layerOpacity);

        const finalSize = GlobalSettings.getFinalImageSize();
        await tempLayer.resize(finalSize.height, finalSize.width);
        await layer.compositeLayerOver(tempLayer);

        fs.unlinkSync(context.filename);
    }

    #generate(settings) {
        const data = {
            layerOpacity: this.config.layerOpacity,
        }

        const getMappedFramesFolder = () => {
            const fileURLToPath1 = fileURLToPath(import.meta.url);
            const directory = dirname(fileURLToPath1);

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

            const folders = getFoldersInDirectory(this.config.folderName);

            data.folderName = folders[getRandomIntExclusive(0, folders.length)];

            return path.join(directory, this.config.folderName + data.folderName);

        }

        data.mappedFramesFolder = getMappedFramesFolder();

        this.data = data;
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#mappedFrames(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}, ${this.data.folderName}`
    }
}




