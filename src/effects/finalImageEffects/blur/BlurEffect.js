import {LayerEffect} from "../../LayerEffect.js";
import {getRandomIntInclusive, randomId} from "../../../core/math/random.js";
import {findValue} from "../../../core/math/findValue.js";

export class BlurEffect extends LayerEffect {
    constructor({
                    name = 'blur',
                    requiresLayer = true,
                    config = {
                        lowerRange: {lower: 0, upper: 0},
                        upperRange: {lower: 4, upper: 8},
                        times: {lower: 2, upper: 6},
                        glitchChance: 100,
                    }
                },
                additionalEffects = [],
                ignoreAdditionalEffects = false) {
        super({name: name, requiresLayer: requiresLayer, config: config}, additionalEffects, ignoreAdditionalEffects);
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

    async generate(settings) {

        super.generate(settings);

        this.data =
            {
                glitchChance: this.config.glitchChance,
                lower: getRandomIntInclusive(this.config.lowerRange.lower, this.config.lowerRange.upper),
                upper: getRandomIntInclusive(this.config.upperRange.lower, this.config.upperRange.upper),
                times: getRandomIntInclusive(this.config.times.lower, this.config.times.upper),
            }
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#blur(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.glitchChance} chance, ${this.data.times} times, ${this.data.lower} to ${this.data.upper}`
    }
}




