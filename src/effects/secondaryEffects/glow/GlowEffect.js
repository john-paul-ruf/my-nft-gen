import { promises as fs } from 'fs';
import Jimp from 'jimp';
import { LayerEffect } from '../../../core/layer/LayerEffect.js';
import { getRandomIntInclusive, randomId } from '../../../core/math/random.js';
import { findValue } from '../../../core/math/findValue.js';
import { Settings } from '../../../core/Settings.js';
import { GlowConfig } from './GlowConfig.js';

export class GlowEffect extends LayerEffect {
    static _name_ = 'glow';

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
