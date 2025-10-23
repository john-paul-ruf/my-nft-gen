import {EffectConfig} from 'my-nft-gen/src/core/layer/EffectConfig.js';

/**
 * Configuration for ColorPulseEffect.
 * Pulses saturation and brightness using a sinusoidal wave.
 *
 * @pulseAmount - amplitude of the pulse (0-1 range typical)
 * @pulseSpeed - number of pulses across the total animation frames
 * @glitchChance - percent chance per frame to add a random spike
 */
export class ColorPulseConfig extends EffectConfig {
    constructor({
        pulseAmount = 0.2,
        pulseSpeed = 2,
        glitchChance = 5,
    } = {}) {
        super();
        this.pulseAmount = pulseAmount;
        this.pulseSpeed = pulseSpeed;
        this.glitchChance = glitchChance;
    }
}
