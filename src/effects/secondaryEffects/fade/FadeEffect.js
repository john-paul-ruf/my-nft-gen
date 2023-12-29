import {LayerEffect} from "../../LayerEffect.js";
import {getRandomIntInclusive, randomNumber} from "../../../core/math/random.js";
import {findValue} from "../../../core/math/findValue.js";
import {Settings} from "../../../core/Settings.js";

export class FadeEffect extends LayerEffect {

    static _name_ = 'fade';

    static _config_ = {
        lowerRange: {lower: 0.6, upper: 0.8},
        upperRange: {lower: 0.95, upper: 1},
        times: {lower: 2, upper: 4},
    }

    constructor({
                    name = FadeEffect._name_,
                    requiresLayer = false,
                    config =FadeEffect._config_,
                    additionalEffects = [],
                    ignoreAdditionalEffects = false,
                    settings = new Settings({})
                }) {
        super({
            name: name,
            requiresLayer: requiresLayer,
            config: config,
            additionalEffects: additionalEffects,
            ignoreAdditionalEffects: ignoreAdditionalEffects,
            settings: settings
        });
        this.#generate(settings)
    }

    async #fadeAnimated(layer, currentFrame, totalFrames) {
        const opacity = findValue(this.data.lower, this.data.upper, this.data.times, totalFrames, currentFrame)
        await layer.adjustLayerOpacity(opacity);
    }

    #generate(settings) {
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




