import { LayerEffect } from '../../../core/layer/LayerEffect.js';
import { getRandomIntInclusive, randomNumber } from '../../../core/math/random.js';
import { findValue } from '../../../core/math/findValue.js';
import { Settings } from '../../../core/Settings.js';
import { FadeConfig } from './FadeConfig.js';

export class FadeEffect extends LayerEffect {
    static _name_ = 'fade';

    constructor({
        name = FadeEffect._name_,
        requiresLayer = false,
        config = new FadeConfig({}),
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
        const opacity = findValue(this.data.lower, this.data.upper, this.data.times, totalFrames, currentFrame);
        await layer.adjustLayerOpacity(opacity);
    }

    #generate(settings) {
        this.data = {
            lower: randomNumber(this.config.lowerRange.lower, this.config.lowerRange.upper),
            upper: randomNumber(this.config.upperRange.lower, this.config.upperRange.upper),
            times: getRandomIntInclusive(this.config.times.lower, this.config.times.upper),
        };
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#fadeAnimated(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.times} times, ${this.data.lower.toFixed(3)} to ${this.data.upper.toFixed(3)}`;
    }
}
