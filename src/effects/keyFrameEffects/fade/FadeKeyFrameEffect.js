import {LayerEffect} from '../../../core/layer/LayerEffect.js';
import {getRandomFromArray, getRandomIntInclusive, randomId, randomNumber} from '../../../core/math/random.js';
import {Settings} from '../../../core/Settings.js';
import {promises as fs} from "fs";
import {findValue} from "../../../core/math/findValue.js";
import Jimp from "jimp";
import {FadeKeyFrameConfig} from "./FadeKeyFrameConfig.js";
import {FadeConfig} from "../../secondaryEffects/fade/FadeConfig.js";

/** *
 *
 * Pixelate Effect
 * Creates an animated glitch for the composite image
 * Can be glitched to appear on a percentage of the frames generated
 * Instantiated through the project via the LayerConfig
 *
 */

export class FadeKeyFrameEffect extends LayerEffect {
    static _name_ = 'fade-event';

    constructor({
                    name = FadeKeyFrameEffect._name_,
                    requiresLayer = true,
                    config = new FadeKeyFrameConfig({}),
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

    async #fadeAnimated(layer, currentFrame, totalFrames) {
        function easeBetween(start, end, currentFrame, totalFrames, easingFn = t => t) {
            const t = Math.min(Math.max(currentFrame / totalFrames, 0), 1); // Clamp to [0, 1]
            return start + (end - start) * easingFn(t);
        }

        function easeInOutQuad(t) {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        }

        const opacity = easeBetween(this.data.lower, this.data.upper, currentFrame, totalFrames, easeInOutQuad);
        await layer.adjustLayerOpacity(opacity);
    }

    #generate(settings) {
        const data = {
            keyFrames: this.config.keyFrames,
            lower: randomNumber(this.config.lowerRange.lower, this.config.lowerRange.upper),
            upper: randomNumber(this.config.upperRange.lower, this.config.upperRange.upper),
            times: getRandomIntInclusive(this.config.times.lower, this.config.times.upper),
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
                await this.#fadeAnimated(layer, currentFrame - this.data.keyFrames[index], this.data.keyFrameValues[index].glitchFrameCount);
            }
        }
    }

    getInfo() {
        return `${this.name}: ${this.data.keyFrames.join(', ')} keyframe(s) ${this.data.times} times, fade out to ${this.data.lower.toFixed(3)}`;
    }
}
