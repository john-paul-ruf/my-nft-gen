import { EffectConfig } from '../../../core/layer/EffectConfig.js';

/**
 * Config for Chromatic Aberration Effect
 * Shifts color channels to create an RGB split/glitch effect.
 * Can be glitched to appear on a percentage of frames generated.
 *
 * @offsetRange - lower and upper bound for pixel offset applied to channels
 * @glitchChance - percent chance this effect applies to a given frame
 */
export class ChromaticAberrationConfig extends EffectConfig {
    constructor({
        offsetRange = { lower: 1, upper: 5 },
        glitchChance = 50,
    }) {
        super();
        this.offsetRange = offsetRange;
        this.glitchChance = glitchChance;
    }
}
