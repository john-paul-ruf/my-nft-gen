import {LayerEffect} from '../../../core/layer/LayerEffect.js';
import {getRandomFromArray, getRandomIntInclusive, randomId, randomNumber} from '../../../core/math/random.js';
import {Settings} from '../../../core/Settings.js';
import {promises as fs} from "fs";
import {findValue} from "../../../core/math/findValue.js";
import Jimp from "jimp";
import {StaticImageKeyFrameConfig} from "./StaticImageKeyFrameConfig.js";
import {FadeConfig} from "../../secondaryEffects/fade/FadeConfig.js";
import {LayerFactory} from "../../../core/factory/layer/LayerFactory.js";

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

        const leftOffset = Math.max(0, this.data.center.x - newWidth / 2);
        const topOffset = Math.max(0, this.data.center.y - newHeight / 2);

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
