import {LayerEffect} from 'my-nft-gen/src/core/layer/LayerEffect.js';
import {getRandomIntInclusive, randomNumber} from 'my-nft-gen/src/core/math/random.js';
import {findValue} from 'my-nft-gen/src/core/math/findValue.js';
import {Settings} from 'my-nft-gen/src/core/Settings.js';
import {ModulateConfig} from './ModulateConfig.js';
import {Range} from 'my-nft-gen/src/core/layer/configType/Range.js';
import {DynamicRange} from 'my-nft-gen/src/core/layer/configType/DynamicRange.js';


/**
 *
 * Modulate Effect
 * Creates an animated modulation for the composite image
 * Adjusts brightness, saturation, and contrast
 * Instantiated through the project via the LayerConfig
 *
 */

export class ModulateEffect extends LayerEffect {
    static _name_ = 'modulate';

    static presets = [
        {
            name: 'subtle-modulate',
            effect: 'modulate',
            percentChance: 100,
            currentEffectConfig: {
                brightnessRange: new DynamicRange(new Range(0.9, 0.95), new Range(1, 1.05)),
                brightnessTimes: new Range(1, 3),
                saturationRange: new DynamicRange(new Range(0.9, 0.95), new Range(1, 1.05)),
                saturationTimes: new Range(1, 3),
                contrastRange: new DynamicRange(new Range(1, 1), new Range(1.1, 1.2)),
                contrastTimes: new Range(1, 3)
            }
        },
        {
            name: 'vibrant-modulate',
            effect: 'modulate',
            percentChance: 100,
            currentEffectConfig: {
                brightnessRange: new DynamicRange(new Range(0.8, 0.8), new Range(1, 1)),
                brightnessTimes: new Range(2, 8),
                saturationRange: new DynamicRange(new Range(0.8, 0.8), new Range(1, 1)),
                saturationTimes: new Range(2, 8),
                contrastRange: new DynamicRange(new Range(1, 1), new Range(1.5, 1.5)),
                contrastTimes: new Range(2, 8)
            }
        },
        {
            name: 'dramatic-modulate',
            effect: 'modulate',
            percentChance: 100,
            currentEffectConfig: {
                brightnessRange: new DynamicRange(new Range(0.6, 0.7), new Range(1.2, 1.3)),
                brightnessTimes: new Range(3, 10),
                saturationRange: new DynamicRange(new Range(0.5, 0.6), new Range(1.3, 1.5)),
                saturationTimes: new Range(3, 10),
                contrastRange: new DynamicRange(new Range(1, 1.2), new Range(1.8, 2)),
                contrastTimes: new Range(3, 10)
            }
        }
    ];

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
