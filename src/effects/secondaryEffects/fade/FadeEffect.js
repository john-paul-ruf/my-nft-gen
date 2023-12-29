import {LayerEffect} from "../../LayerEffect.js";
import {getRandomIntInclusive, randomId, randomNumber} from "../../../core/math/random.js";
import {findValue} from "../../../core/math/findValue.js";

export class FadeEffect extends LayerEffect {
    constructor({
                    name = 'fade',
                    requiresLayer = false,
                    config = {
                        lowerRange: {lower: 0.6, upper: 0.8},
                        upperRange: {lower: 0.95, upper: 1},
                        times: {lower: 2, upper: 4},
                    }
                },
                additionalEffects = [],
                ignoreAdditionalEffects = false) {
        super({name: name, requiresLayer: requiresLayer, config: config}, additionalEffects, ignoreAdditionalEffects);
    }

    async #fadeAnimated(layer, currentFrame, totalFrames) {
        const opacity = findValue(this.data.lower, this.data.upper, this.data.times, totalFrames, currentFrame)
        await layer.adjustLayerOpacity(opacity);
    }

    async generate(settings) {

        super.generate(settings);


        super.generate(settings);
        this.data =
            {
                lower: randomNumber(this.config.lowerRange.lower, this.config.lowerRange.upper),
                upper: randomNumber(this.config.upperRange.lower, this.config.upperRange.upper),
                times: getRandomIntInclusive(this.config.times.lower, this.config.times.upper),
            }
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#fadeAnimated(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.times} times, ${this.data.lower.toFixed(3)} to ${this.data.upper.toFixed(3)}`
    }
}




