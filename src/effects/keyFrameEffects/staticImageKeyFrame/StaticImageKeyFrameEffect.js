import {LayerEffect} from 'my-nft-gen/src/core/layer/LayerEffect.js';
import {getRandomFromArray, getRandomIntInclusive, randomId, randomNumber} from 'my-nft-gen/src/core/math/random.js';
import {Settings} from 'my-nft-gen/src/core/Settings.js';
import {promises as fs} from "fs";
import {findValue} from "my-nft-gen/src/core/math/findValue.js";
import Jimp from "jimp";
import {StaticImageKeyFrameConfig} from "./StaticImageKeyFrameConfig.js";
import {FadeConfig} from "../../secondaryEffects/fade/FadeConfig.js";
import {LayerFactory} from "my-nft-gen/src/core/factory/layer/LayerFactory.js";
import {Position} from 'my-nft-gen/src/core/position/Position.js';

/** *
 *
 * Pixelate Effect
 * Creates an animated glitch for the composite image
 * Can be glitched to appear on a percentage of the frames generated
 * Instantiated through the project via the LayerConfig
 *
 */

export class StaticImageKeyFrameEffect extends LayerEffect {
    static _name_ = 'static-image';
    static configClass = StaticImageKeyFrameConfig;

    static presets = [
        {
            name: 'subtle-static-image',
            effect: 'static-image',
            percentChance: 100,
            currentEffectConfig: {
                fileName: '/imageOverlay/',
                center: new Position({x: 1080 / 2, y: 1920 / 2}),
                layerOpacity: [0.7, 0.8],
                buffer: [400, 500],
                keyFrames: [0, 240, 720],
                glitchFrameCount: [10, 20],
            }
        },
        {
            name: 'medium-static-image',
            effect: 'static-image',
            percentChance: 100,
            currentEffectConfig: {
                fileName: '/imageOverlay/',
                center: new Position({x: 1080 / 2, y: 1920 / 2}),
                layerOpacity: [0.85, 0.95],
                buffer: [500, 600],
                keyFrames: [0, 120, 360, 900],
                glitchFrameCount: [15, 30],
            }
        },
        {
            name: 'prominent-static-image',
            effect: 'static-image',
            percentChance: 100,
            currentEffectConfig: {
                fileName: '/imageOverlay/',
                center: new Position({x: 1080 / 2, y: 1920 / 2}),
                layerOpacity: [0.95, 1.0],
                buffer: [300, 400],
                keyFrames: [0, 60, 180, 360, 720],
                glitchFrameCount: [20, 45],
            }
        }
    ];

    constructor({
                    name = StaticImageKeyFrameEffect._name_,
                    requiresLayer = true,
                    config = new StaticImageKeyFrameConfig({}),
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

    async #staticImage(layer, currentFrame, totalFrames) {
        const tempLayer = await LayerFactory.getLayerFromFile(this.data.fileName, this.fileConfig);

        const tempFileInfo = await tempLayer.getInfo()

        const newHeight = tempFileInfo.height - this.data.buffer;
        const newWidth = tempFileInfo.width - this.data.buffer;

        const leftOffset = Math.max(0, this.data.center.getPosition(currentFrame, totalFrames).x - newWidth / 2);
        const topOffset = Math.max(0, this.data.center.getPosition(currentFrame, totalFrames).y - newHeight / 2);

        await tempLayer.resize(newWidth, newHeight, 'contain');

        await tempLayer.adjustLayerOpacity(this.data.layerOpacity);

        await layer.compositeLayerOverAtPoint(tempLayer, topOffset, leftOffset);

    }

    #generate(settings) {
        const data = {
            fileName: this.config.fileName,
            center: this.config.center,
            layerOpacity: getRandomFromArray(this.config.layerOpacity),
            buffer: getRandomFromArray(this.config.buffer),
            keyFrames: this.config.keyFrames,
        };

        const createKeyFrameValues = (data) => {

            const keyFrameValues = [];

            for (let index = 0; index < data.keyFrames.length; index++) {
                const keyFrameValue = {
                    glitchFrameCount: getRandomFromArray(this.config.glitchFrameCount),
                }

                keyFrameValues.push(keyFrameValue);
            }

            return keyFrameValues;
        }

        data.keyFrameValues = createKeyFrameValues(data);

        this.data = data;
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        for (let index = 0; index < this.data.keyFrames.length; index++) {
            if (currentFrame >= this.data.keyFrames[index] && currentFrame < this.data.keyFrames[index] + this.data.keyFrameValues[index].glitchFrameCount) {
                await this.#staticImage(layer, currentFrame - this.data.keyFrames[index], this.data.keyFrameValues[index].glitchFrameCount);
            }
        }
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.keyFrames.join(', ')} keyframe(s)`;
    }
}
