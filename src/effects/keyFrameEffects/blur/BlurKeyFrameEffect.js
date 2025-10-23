import {LayerEffect} from 'my-nft-gen/src/core/layer/LayerEffect.js';
import {getRandomFromArray, getRandomIntInclusive, randomId, randomNumber} from 'my-nft-gen/src/core/math/random.js';
import {Settings} from 'my-nft-gen/src/core/Settings.js';
import {promises as fs} from "fs";
import {findValue} from "my-nft-gen/src/core/math/findValue.js";
import Jimp from "jimp";
import {BlurKeyFrameConfig} from "./BlurKeyFrameConfig.js";
import {FadeConfig} from "../../secondaryEffects/fade/FadeConfig.js";
import {Range} from 'my-nft-gen/src/core/layer/configType/Range.js';

/** *
 *
 * Pixelate Effect
 * Creates an animated glitch for the composite image
 * Can be glitched to appear on a percentage of the frames generated
 * Instantiated through the project via the LayerConfig
 *
 */

export class BlurKeyFrameEffect extends LayerEffect {
    static _name_ = 'blur-event';

    static presets = [
        {
            name: 'light-blur-event',
            effect: 'blur-event',
            percentChance: 100,
            currentEffectConfig: {
                keyFrames: [0, 120, 360],
                glitchFrameCount: [10, 20],
                upperRange: new Range(1, 4),
                times: new Range(1, 1),
            }
        },
        {
            name: 'medium-blur-event',
            effect: 'blur-event',
            percentChance: 100,
            currentEffectConfig: {
                keyFrames: [0, 120, 360, 900],
                glitchFrameCount: [15, 30],
                upperRange: new Range(1, 8),
                times: new Range(1, 1),
            }
        },
        {
            name: 'heavy-blur-event',
            effect: 'blur-event',
            percentChance: 100,
            currentEffectConfig: {
                keyFrames: [0, 60, 180, 360, 720, 900],
                glitchFrameCount: [20, 45],
                upperRange: new Range(8, 16),
                times: new Range(1, 2),
            }
        }
    ];

    constructor({
                    name = BlurKeyFrameEffect._name_,
                    requiresLayer = true,
                    config = new BlurKeyFrameConfig({}),
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
        const blurGaston = Math.floor(findValue(0, this.data.upper, this.data.times, totalFrames, currentFrame));
        if (blurGaston > 0) {
            await layer.blur(blurGaston);
        }
    }

    #generate(settings) {
        const data = {
            keyFrames: this.config.keyFrames,
            upper: getRandomIntInclusive(this.config.upperRange.lower, this.config.upperRange.upper),
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
        return `${this.name}: ${this.data.keyFrames.join(', ')} keyframe(s) ${this.data.times} times, blur to ${this.data.upper}`;
    }
}
