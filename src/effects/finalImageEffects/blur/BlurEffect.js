import { LayerEffect } from '../../../core/layer/LayerEffect.js';
import { getRandomIntInclusive } from '../../../core/math/random.js';
import { findValue } from '../../../core/math/findValue.js';
import { Settings } from '../../../core/Settings.js';
import { BlurConfig } from './BlurConfig.js';



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
