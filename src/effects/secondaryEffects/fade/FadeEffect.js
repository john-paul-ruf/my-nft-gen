import { LayerEffect } from 'my-nft-gen';
import { getRandomIntInclusive, randomNumber } from 'my-nft-gen/src/core/math/random.js';
import { findValue } from 'my-nft-gen/src/core/math/findValue.js';
import { Settings } from 'my-nft-gen/src/core/Settings.js';
import { FadeConfig } from './FadeConfig.js';
import { Range } from 'my-nft-gen/src/core/layer/configType/Range.js';

export class FadeEffect extends LayerEffect {
    static _name_ = 'fade';

    static presets = [
        {
            name: 'gentle-fade',
            effect: 'fade',
            percentChance: 100,
            currentEffectConfig: {
                lowerRange: new Range(0.8, 0.9),
                upperRange: new Range(0.95, 1),
                times: new Range(1, 2),
            }
        },
        {
            name: 'classic-fade',
            effect: 'fade',
            percentChance: 100,
            currentEffectConfig: {
                lowerRange: new Range(0.6, 0.8),
                upperRange: new Range(0.95, 1),
                times: new Range(2, 4),
            }
        },
        {
            name: 'dramatic-fade',
            effect: 'fade',
            percentChance: 100,
            currentEffectConfig: {
                lowerRange: new Range(0.3, 0.5),
                upperRange: new Range(0.9, 1),
                times: new Range(3, 6),
            }
        }
    ];

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
