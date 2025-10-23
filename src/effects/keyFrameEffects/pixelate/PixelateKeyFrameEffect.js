import {LayerEffect} from 'my-nft-gen/src/core/layer/LayerEffect.js';
import {getRandomFromArray, getRandomIntInclusive, randomId} from 'my-nft-gen/src/core/math/random.js';
import {Settings} from 'my-nft-gen/src/core/Settings.js';
import {promises as fs} from "fs";
import {findValue} from "my-nft-gen/src/core/math/findValue.js";
import Jimp from "jimp";
import {PixelateKeyFrameConfig} from "./PixelateKeyFrameConfig.js";
import {Range} from 'my-nft-gen/src/core/layer/configType/Range.js';

/** *
 *
 * Pixelate Effect
 * Creates an animated glitch for the composite image
 * Can be glitched to appear on a percentage of the frames generated
 * Instantiated through the project via the LayerConfig
 *
 */

export class PixelateKeyFrameEffect extends LayerEffect {
    static _name_ = 'pixelate-event';

    static presets = [
        {
            name: 'light-pixelate-event',
            effect: 'pixelate-event',
            percentChance: 100,
            currentEffectConfig: {
                keyFrames: [0, 180, 540],
                glitchFrameCount: [10, 20],
                lowerRange: new Range(0, 0),
                upperRange: new Range(2, 4),
                times: new Range(1, 2),
            }
        },
        {
            name: 'medium-pixelate-event',
            effect: 'pixelate-event',
            percentChance: 100,
            currentEffectConfig: {
                keyFrames: [0, 120, 360, 900],
                glitchFrameCount: [15, 30],
                lowerRange: new Range(0, 0),
                upperRange: new Range(3, 6),
                times: new Range(1, 3),
            }
        },
        {
            name: 'heavy-pixelate-event',
            effect: 'pixelate-event',
            percentChance: 100,
            currentEffectConfig: {
                keyFrames: [0, 60, 180, 360, 720],
                glitchFrameCount: [20, 45],
                lowerRange: new Range(0, 0),
                upperRange: new Range(8, 16),
                times: new Range(2, 6),
            }
        }
    ];

    constructor({
                    name = PixelateKeyFrameEffect._name_,
                    requiresLayer = true,
                    config = new PixelateKeyFrameConfig({}),
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

    async #applyPixelateEffect(layer, currentFrame, totalFrames) {
        const filename = `${this.workingDirectory}pixelate${randomId()}.png`;

        await layer.toFile(filename);

        const jimpImage = await Jimp.read(filename);

        const pixelateGaston = Math.ceil(findValue(this.data.lower, this.data.upper, this.data.times, totalFrames, currentFrame));

        if (pixelateGaston > 0) {
            await jimpImage.pixelate(pixelateGaston);
        }

        await jimpImage.writeAsync(filename);

        await layer.fromFile(filename);

        await fs.unlink(filename);
    };

    async #effect(layer, currentFrame, numberOfFrames) {
        for (let index = 0; index < this.data.keyFrames.length; index++) {
            if (currentFrame >= this.data.keyFrames[index] && currentFrame < this.data.keyFrames[index] + this.data.keyFrameValues[index].glitchFrameCount) {
                await this.#applyPixelateEffect(layer, currentFrame - this.data.keyFrames[index], this.data.keyFrameValues[index].glitchFrameCount);
            }
        }
    }


    #generate(settings) {

        const data = {
            keyFrames: this.config.keyFrames,
            lower: getRandomIntInclusive(this.config.lowerRange.lower, this.config.lowerRange.upper),
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
        await this.#effect(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.keyFrames.join(', ')} keyframe(s) ${this.data.times} times, ${this.data.lower} to ${this.data.upper}`;
    }
}
