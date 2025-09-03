import {LayerEffect} from '../../../core/layer/LayerEffect.js';
import {Settings} from '../../../core/Settings.js';
import {ColorPulseConfig} from './ColorPulseConfig.js';
import {getRandomIntInclusive} from '../../../core/math/random.js';

/**
 * ColorPulseEffect
 *
 * Modulates the final image saturation and brightness using a sinusoidal
 * waveform. An optional glitch chance introduces irregular spikes in
 * intensity.
 */
export class ColorPulseEffect extends LayerEffect {
    static _name_ = 'colorPulse';

    constructor({
        name = ColorPulseEffect._name_,
        requiresLayer = true,
        config = new ColorPulseConfig({}),
        additionalEffects = [],
        ignoreAdditionalEffects = false,
        settings = new Settings({}),
    } = {}) {
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

    async #pulse(layer, currentFrame, totalFrames) {
        const t = currentFrame / totalFrames;
        const angle = t * this.data.pulseSpeed * Math.PI * 2;
        let factor = 1 + this.data.pulseAmount * Math.sin(angle);

        const glitchRoll = getRandomIntInclusive(0, 100);
        if (glitchRoll <= this.data.glitchChance) {
            factor += this.data.pulseAmount * Math.random();
        }

        await layer.modulate({
            saturation: factor,
            brightness: factor,
        });
    }

    #generate(settings) {
        this.data = {
            pulseAmount: this.config.pulseAmount,
            pulseSpeed: this.config.pulseSpeed,
            glitchChance: this.config.glitchChance,
        };
    }

    async invoke(layer, currentFrame, totalFrames) {
        await this.#pulse(layer, currentFrame, totalFrames);
        await super.invoke(layer, currentFrame, totalFrames);
    }

    getInfo() {
        return `${this.name}: amount ${this.data.pulseAmount}, speed ${this.data.pulseSpeed}, glitch ${this.data.glitchChance}`;
    }
}
