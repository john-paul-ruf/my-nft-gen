import fs from 'fs';
import {LayerEffect} from 'my-nft-gen/src/core/layer/LayerEffect.js';
import {LayerFactory} from 'my-nft-gen/src/core/factory/layer/LayerFactory.js';
import {getRandomFromArray, getRandomIntExclusive} from 'my-nft-gen/src/core/math/random.js';
import {Settings} from 'my-nft-gen/src/core/Settings.js';
import {ImageOverlayConfig} from './ImageOverlayConfig.js';

export class ImageOverlayEffect extends LayerEffect {
    static _name_ = 'image-overlay';
    static configClass = ImageOverlayConfig;

    static presets = [
        {
            name: 'subtle-image-overlay',
            effect: 'image-overlay',
            percentChance: 100,
            currentEffectConfig: {
                folderName: '/imageOverlay/',
                layerOpacity: [0.7, 0.8],
                buffer: [700, 800],
            }
        },
        {
            name: 'classic-image-overlay',
            effect: 'image-overlay',
            percentChance: 100,
            currentEffectConfig: {
                folderName: '/imageOverlay/',
                layerOpacity: [0.95],
                buffer: [555],
            }
        },
        {
            name: 'prominent-image-overlay',
            effect: 'image-overlay',
            percentChance: 100,
            currentEffectConfig: {
                folderName: '/imageOverlay/',
                layerOpacity: [1],
                buffer: [300, 400],
            }
        }
    ];

    constructor({
                    name = ImageOverlayEffect._name_,
                    requiresLayer = true,
                    config = new ImageOverlayConfig({}),
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

    async #imageOverlay(layer) {
        const tempLayer = await LayerFactory.getLayerFromFile(this.data.imageOverlay, this.fileConfig);
        const {finalSize} = this;
        await tempLayer.adjustLayerOpacity(this.data.layerOpacity);
        await tempLayer.resize(finalSize.height - this.data.buffer, finalSize.width - this.data.buffer, 'contain');
        await layer.compositeLayerOver(tempLayer);
    }

    #generate(settings) {
        const data = {
            layerOpacity: getRandomFromArray(this.config.layerOpacity),
            buffer: getRandomFromArray(this.config.buffer),
        };

        const getBackdrop = () => {
            const getFilesInDirectory = (directoryPath) => {
                const list = [];
                try {
                    fs.readdirSync(directoryPath).forEach((file) => {
                        if (!file.startsWith('.') && !fs.lstatSync(directoryPath + file).isDirectory()) {
                            list.push(file);
                        }
                    });
                } catch (e) {
                    console.log(e);
                }

                return list;
            };

            const images = getFilesInDirectory(this.config.folderName);

            data.filename = images[getRandomIntExclusive(0, images.length)];

            return this.config.folderName + data.filename;
        };

        data.imageOverlay = getBackdrop();

        this.data = data;
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#imageOverlay(layer);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name} ${this.data.filename} buffer: ${this.data.buffer}`;
    }
}
