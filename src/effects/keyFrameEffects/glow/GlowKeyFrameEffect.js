import {LayerEffect} from 'my-nft-gen/src/core/layer/LayerEffect.js';
import {getRandomFromArray, getRandomIntInclusive, randomId} from 'my-nft-gen/src/core/math/random.js';
import {Settings} from 'my-nft-gen/src/core/Settings.js';
import {promises as fs} from "fs";
import {findValue} from "my-nft-gen/src/core/math/findValue.js";
import Jimp from "jimp";
import {GlowKeyFrameConfig} from "./GlowKeyFrameConfig.js";
import {Range} from 'my-nft-gen/src/core/layer/configType/Range.js';

/** *
 *
 * Pixelate Effect
 * Creates an animated glitch for the composite image
 * Can be glitched to appear on a percentage of the frames generated
 * Instantiated through the project via the LayerConfig
 *
 */

export class GlowKeyFrameEffect extends LayerEffect {
    static _name_ = 'glow-event';

    static presets = [
        {
            name: 'subtle-glow-event',
            effect: 'glow-event',
            percentChance: 100,
            currentEffectConfig: {
                keyFrames: [0, 180, 540],
                glitchFrameCount: [10, 20],
                lowerRange: new Range(-10, -5),
                times: new Range(1, 3),
            }
        },
        {
            name: 'medium-glow-event',
            effect: 'glow-event',
            percentChance: 100,
            currentEffectConfig: {
                keyFrames: [0, 120, 360, 900],
                glitchFrameCount: [15, 30],
                lowerRange: new Range(-18, 0),
                times: new Range(2, 6),
            }
        },
        {
            name: 'intense-glow-event',
            effect: 'glow-event',
            percentChance: 100,
            currentEffectConfig: {
                keyFrames: [0, 60, 180, 360, 720],
                glitchFrameCount: [20, 45],
                lowerRange: new Range(-36, 0),
                times: new Range(6, 12),
            }
        }
    ];

    constructor({
                    name = GlowKeyFrameEffect._name_,
                    requiresLayer = true,
                    config = new GlowKeyFrameConfig({}),
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

    async #glowAnimated(layer, currentFrame, totalFrames) {
        const filename = `${this.workingDirectory}glow${randomId()}.png`;

        await layer.toFile(filename);

        const jimpImage = await Jimp.read(filename);

        const hue = findValue(0, this.data.lower, this.data.times, totalFrames, currentFrame);
        await jimpImage.color([{ apply: 'hue', params: [hue] }]);

        await jimpImage.writeAsync(filename);

        await layer.fromFile(filename);

        await fs.unlink(filename);
    }

    #generate(settings) {
        const data = {
            keyFrames: this.config.keyFrames,
            lower: getRandomIntInclusive(this.config.lowerRange.lower, this.config.lowerRange.upper),
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
                await this.#glowAnimated(layer, currentFrame - this.data.keyFrames[index], this.data.keyFrameValues[index].glitchFrameCount);
            }
        }
    }

    getInfo() {
        return `${this.name}: ${this.data.keyFrames.join(', ')} keyframe(s) ${this.data.times} times, spin to ${this.data.lower}`;
    }
}
