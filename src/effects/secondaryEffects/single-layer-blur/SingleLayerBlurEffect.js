import { LayerEffect } from 'my-nft-gen';
import { getRandomIntInclusive } from 'my-nft-gen/src/core/math/random.js';
import { findValue } from 'my-nft-gen/src/core/math/findValue.js';
import { Settings } from 'my-nft-gen/src/core/Settings.js';
import { SingleLayerBlurConfig } from './SingleLayerBlurConfig.js';
import { Range } from 'my-nft-gen/src/core/layer/configType/Range.js';

export class SingleLayerBlurEffect extends LayerEffect {
    static _name_ = 'single-layer-blur';

    static presets = [
        {
            name: 'subtle-layer-blur',
            effect: 'single-layer-blur',
            percentChance: 100,
            currentEffectConfig: {
                lowerRange: new Range(0, 0),
                upperRange: new Range(1, 3),
                times: new Range(1, 4),
                glitchChance: 50,
            }
        },
        {
            name: 'medium-layer-blur',
            effect: 'single-layer-blur',
            percentChance: 100,
            currentEffectConfig: {
                lowerRange: new Range(0, 0),
                upperRange: new Range(2, 6),
                times: new Range(2, 9),
                glitchChance: 100,
            }
        },
        {
            name: 'heavy-layer-blur',
            effect: 'single-layer-blur',
            percentChance: 100,
            currentEffectConfig: {
                lowerRange: new Range(0, 2),
                upperRange: new Range(6, 12),
                times: new Range(4, 12),
                glitchChance: 100,
            }
        }
    ];

    constructor({
        name = SingleLayerBlurEffect._name_,
        requiresLayer = false,
        config = new SingleLayerBlurConfig({}),
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

    async #blur(layer, currentFrame, totalFrames) {
        const theGlitch = getRandomIntInclusive(0, 100);
        if (theGlitch <= this.data.glitchChance) {
            const blurGaston = Math.floor(findValue(this.data.lower, this.data.upper, this.data.times, totalFrames, currentFrame));
            if (blurGaston > 0) {
                await layer.blur(blurGaston);
            }
        }
    }

    #generate(settings) {
        this.data = {
            glitchChance: this.config.glitchChance,
            lower: getRandomIntInclusive(this.config.lowerRange.lower, this.config.lowerRange.upper),
            upper: getRandomIntInclusive(this.config.upperRange.lower, this.config.upperRange.upper),
            times: getRandomIntInclusive(this.config.times.lower, this.config.times.upper),
        };
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#blur(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.glitchChance} chance, ${this.data.times} times, ${this.data.lower} to ${this.data.upper}`;
    }
}
