import fs from 'fs';
import {getRandomFromArray, getRandomIntExclusive, randomId} from 'my-nft-gen/src/core/math/random.js';
import {LayerEffect} from 'my-nft-gen/src/core/layer/LayerEffect.js';
import {mapNumberToRange} from 'my-nft-gen/src/core/math/mapNumberToRange.js';
import {LayerFactory} from 'my-nft-gen/src/core/factory/layer/LayerFactory.js';
import {Settings} from 'my-nft-gen/src/core/Settings.js';
import {MappedFramesConfig} from './MappedFramesConfig.js';
import {FindMultiStepStepValue} from "my-nft-gen/src/core/math/FindMultiStepValue.js";
import {MultiStepDefinitionConfig} from 'my-nft-gen/src/core/math/MultiStepDefinitionConfig.js';
import {Range} from 'my-nft-gen/src/core/layer/configType/Range.js';
import {Position} from 'my-nft-gen/src/core/position/Position.js';

export class MappedFramesEffect extends LayerEffect {
    static _name_ = 'mapped-frames';

    static presets = [
        {
            name: 'slow-mapped-frames',
            effect: 'mapped-frames',
            percentChance: 100,
            currentEffectConfig: {
                folderName: '/mappedFrames/',
                layerOpacity: [0.8],
                buffer: [700],
                loopTimesMultiStep: [
                    new MultiStepDefinitionConfig({
                        minPercentage: 0,
                        maxPercentage: 100,
                        max: new Range(0, 0),
                        times: new Range(3, 3),
                        invert: false
                    }),
                ],
                center: new Position({x: 0, y: 0}),
            }
        },
        {
            name: 'classic-mapped-frames',
            effect: 'mapped-frames',
            percentChance: 100,
            currentEffectConfig: {
                folderName: '/mappedFrames/',
                layerOpacity: [0.95],
                buffer: [555],
                loopTimesMultiStep: [
                    new MultiStepDefinitionConfig({
                        minPercentage: 0,
                        maxPercentage: 100,
                        max: new Range(0, 0),
                        times: new Range(5, 5),
                        invert: false
                    }),
                ],
                center: new Position({x: 0, y: 0}),
            }
        },
        {
            name: 'fast-mapped-frames',
            effect: 'mapped-frames',
            percentChance: 100,
            currentEffectConfig: {
                folderName: '/mappedFrames/',
                layerOpacity: [1],
                buffer: [400],
                loopTimesMultiStep: [
                    new MultiStepDefinitionConfig({
                        minPercentage: 0,
                        maxPercentage: 100,
                        max: new Range(0, 0),
                        times: new Range(8, 8),
                        invert: false
                    }),
                ],
                center: new Position({x: 0, y: 0}),
            }
        }
    ];

    constructor({
                    name = MappedFramesEffect._name_,
                    requiresLayer = true,
                    config = new MappedFramesConfig({}),
                    additionalEffects = [],
                    ignoreAdditionalEffects = false,
                    settings = new Settings({}),
                }) {
        super({
            name,
            requiresLayer,
            config,
            additionalEffects,
            ignoreAdditionalEffects,
            settings,
        });
        this.#generate(settings);
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

        fs.readdirSync(dir).forEach((file) => {
            if (!file.startsWith('.') && !fs.lstatSync(dir + file).isDirectory()) {
                list.push(dir + file);
            }
        });

        return list;
    }

    async #extractFrame(context) {
        const frames = await this.#getAllFilesInDirectory(context.data.mappedFramesFolder);

        const multiStepInfo = FindMultiStepStepValue.getFindValueInfo({
            stepArray: context.data.loopTimesMultiStep,
            currentFrame: context.currentFrame,
            totalNumberOfFrames: context.numberOfFrames
        })


        const sequenceMax = Math.floor(multiStepInfo.totalNumberOfFrames / multiStepInfo.times);
        const currentSequence = multiStepInfo.currentFrame % sequenceMax;
        const frameIndex = Math.floor(mapNumberToRange(currentSequence, 0, sequenceMax, 0, frames.length - 1));

        return this.#copyFile(frames[frameIndex], context.filename);
    }

    async #mappedFrames(layer, currentFrame, numberOfFrames) {
        const context = {
            currentFrame,
            numberOfFrames,
            data: this.data,
            filename: `${this.workingDirectory}mapped-frame${randomId()}.png`,

        };

        await this.#extractFrame(context);

        const tempLayer = await LayerFactory.getLayerFromFile(context.filename, this.fileConfig);

        const tempFileInfo = await tempLayer.getInfo()

        const newHeight = tempFileInfo.height - this.data.buffer;
        const newWidth = tempFileInfo.width - this.data.buffer;

        const leftOffset = Math.max(0, this.data.center.getPosition(currentFrame, numberOfFrames).x - newWidth / 2);
        const topOffset = Math.max(0, this.data.center.getPosition(currentFrame, numberOfFrames).y - newHeight / 2);

        await tempLayer.resize(newWidth, newHeight, 'contain');

        await tempLayer.adjustLayerOpacity(this.data.layerOpacity);

        await layer.compositeLayerOverAtPoint(tempLayer, topOffset, leftOffset);

        await fs.unlinkSync(context.filename);
    }

    #generate(settings) {
        const data = {
            layerOpacity: this.config.layerOpacity,
            buffer: getRandomFromArray(this.config.buffer),
            loopTimesMultiStep: FindMultiStepStepValue.convertFromConfigToDefinition(this.config.loopTimesMultiStep),
            randomize: this.config.randomize,
            center: this.config.center
        };

        const getMappedFramesFolder = () => {
            const getFoldersInDirectory = (directoryPath) => {
                const list = [];

                try {
                    fs.readdirSync(directoryPath).forEach((file) => {
                        if (!file.startsWith('.') && fs.lstatSync(directoryPath + file).isDirectory()) {
                            list.push(`${file}/`);
                        }
                    });
                } catch (e) {
                    //console.log(e);
                }

                return list;
            };

            const folders = getFoldersInDirectory(this.config.folderName);

            data.folderName = folders[getRandomIntExclusive(0, folders.length)];

            return this.config.folderName + data.folderName;
        };

        data.mappedFramesFolder = getMappedFramesFolder();

        this.data = data;
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#mappedFrames(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}, ${this.data.folderName}`;
    }
}
