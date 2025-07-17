import {LayerEffect} from '../../../core/layer/LayerEffect.js';
import {getRandomIntInclusive, randomNumber} from '../../../core/math/random.js';
import {findValue} from '../../../core/math/findValue.js';
import {Settings} from '../../../core/Settings.js';
import {ModulateConfig} from './ModulateConfig.js';


/**
 *
 * Blur Effect
 * Creates an animated blur for the composite image
 * Can be glitched to appear on a percentage of the frames generated
 * Instantiated through the project via the LayerConfig
 *
 */

export class ModulateEffect extends LayerEffect {
    static _name_ = 'modulate';

    constructor({
                    name = ModulateEffect._name_,
                    requiresLayer = true,
                    config = new ModulateConfig({}),
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

    async #effect(layer, currentFrame, totalFrames) {

        const options = {
            brightness: findValue(this.data.brightnessRange.lower, this.data.brightnessRange.upper, this.data.brightnessTimes, totalFrames, currentFrame),
            saturation: findValue(this.data.saturationRange.lower, this.data.saturationRange.upper, this.data.saturationTimes, totalFrames, currentFrame),
            contrast: findValue(this.data.contrastRange.lower, this.data.contrastRange.upper, this.data.contrastTimes, totalFrames, currentFrame),
        }

        await layer.modulate(options);
    }

    #generate(settings) {
        this.data = {
            brightnessRange: {
                lower: randomNumber(this.config.brightnessRange.bottom.lower, this.config.brightnessRange.bottom.upper),
                upper: randomNumber(this.config.brightnessRange.top.lower, this.config.brightnessRange.top.upper),
            },
            brightnessTimes: getRandomIntInclusive(this.config.brightnessTimes.lower, this.config.brightnessTimes.upper),
            saturationRange: {
                lower: randomNumber(this.config.saturationRange.bottom.lower, this.config.saturationRange.bottom.upper),
                upper: randomNumber(this.config.saturationRange.top.lower, this.config.saturationRange.top.upper),
            },
            saturationTimes: getRandomIntInclusive(this.config.saturationTimes.lower, this.config.saturationTimes.upper),
            contrastRange: {
                lower: randomNumber(this.config.contrastRange.bottom.lower, this.config.contrastRange.bottom.upper),
                upper: randomNumber(this.config.contrastRange.top.lower, this.config.contrastRange.top.upper),
            },
            contrastTimes: getRandomIntInclusive(this.config.contrastTimes.lower, this.config.contrastTimes.upper),
        };
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#effect(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: 
            brightness ${this.data.brightnessRange.lower} to ${this.data.brightnessRange.upper} ${this.data.brightnessTimes} times
            saturation ${this.data.saturationRange.lower} to ${this.data.saturationRange.upper} ${this.data.saturationTimes} times
            contrast ${this.data.contrastRange.lower} to ${this.data.contrastRange.upper} ${this.data.contrastTimes} times`;
    }
}
