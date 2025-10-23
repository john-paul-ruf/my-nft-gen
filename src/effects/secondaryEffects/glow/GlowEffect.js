import { promises as fs } from 'fs';
import Jimp from 'jimp';
import { LayerEffect } from 'my-nft-gen';
import { getRandomIntInclusive, randomId } from 'my-nft-gen/src/core/math/random.js';
import { findValue } from 'my-nft-gen/src/core/math/findValue.js';
import { Settings } from 'my-nft-gen/src/core/Settings.js';
import { GlowConfig } from './GlowConfig.js';
import { Range } from 'my-nft-gen/src/core/layer/configType/Range.js';

export class GlowEffect extends LayerEffect {
    static _name_ = 'glow';

    static presets = [
        {
            name: 'subtle-glow',
            effect: 'glow',
            percentChance: 100,
            currentEffectConfig: {
                lowerRange: new Range(-10, -5),
                upperRange: new Range(5, 10),
                times: new Range(1, 3),
            }
        },
        {
            name: 'classic-glow',
            effect: 'glow',
            percentChance: 100,
            currentEffectConfig: {
                lowerRange: new Range(-18, 0),
                upperRange: new Range(0, 18),
                times: new Range(2, 6),
            }
        },
        {
            name: 'intense-glow',
            effect: 'glow',
            percentChance: 100,
            currentEffectConfig: {
                lowerRange: new Range(-30, -10),
                upperRange: new Range(10, 30),
                times: new Range(4, 10),
            }
        }
    ];

    constructor({
        name = GlowEffect._name_,
        requiresLayer = false,
        config = new GlowConfig({}),
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

        const hue = findValue(this.data.lower, this.data.upper, this.data.times, totalFrames, currentFrame);
        await jimpImage.color([{ apply: 'hue', params: [hue] }]);

        await jimpImage.writeAsync(filename);

        await layer.fromFile(filename);

        await fs.unlink(filename);
    }

    #generate(settings) {
        this.data = {
            lower: getRandomIntInclusive(this.config.lowerRange.lower, this.config.lowerRange.upper),
            upper: getRandomIntInclusive(this.config.upperRange.lower, this.config.upperRange.upper),
            times: getRandomIntInclusive(this.config.times.lower, this.config.times.upper),
        };
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#glowAnimated(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.times} times, ${this.data.lower} to ${this.data.upper}`;
    }
}
