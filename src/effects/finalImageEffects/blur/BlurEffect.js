import { LayerEffect } from 'my-nft-gen';
import { getRandomIntInclusive } from 'my-nft-gen/src/core/math/random.js';
import { findValue } from 'my-nft-gen/src/core/math/findValue.js';
import { Settings } from 'my-nft-gen/src/core/Settings.js';
import { BlurConfig } from './BlurConfig.js';
import { Range } from 'my-nft-gen/src/core/layer/configType/Range.js';



/**
 *
 * Blur Effect
 * Creates an animated blur for the composite image
 * Can be glitched to appear on a percentage of the frames generated
 * Instantiated through the project via the LayerConfig
 *
 */

export class BlurEffect extends LayerEffect {
    static _name_ = 'blur';
    static configClass = BlurConfig;

    static presets = [
        {
            name: 'subtle-blur',
            effect: 'blur',
            percentChance: 100,
            currentEffectConfig: {
                lowerRange: new Range(0, 0),
                upperRange: new Range(1, 3),
                times: new Range(1, 2),
                glitchChance: 100
            }
        },
        {
            name: 'medium-blur',
            effect: 'blur',
            percentChance: 100,
            currentEffectConfig: {
                lowerRange: new Range(0, 0),
                upperRange: new Range(4, 8),
                times: new Range(2, 6),
                glitchChance: 100
            }
        },
        {
            name: 'heavy-blur',
            effect: 'blur',
            percentChance: 100,
            currentEffectConfig: {
                lowerRange: new Range(0, 2),
                upperRange: new Range(10, 15),
                times: new Range(3, 8),
                glitchChance: 100
            }
        }
    ];

    constructor({
        name = BlurEffect._name_,
        requiresLayer = true,
        config = new BlurConfig({}),
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
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.glitchChance} chance, ${this.data.times} times, ${this.data.lower} to ${this.data.upper}`;
    }
}
