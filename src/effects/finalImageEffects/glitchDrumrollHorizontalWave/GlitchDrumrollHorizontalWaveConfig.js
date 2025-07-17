import { EffectConfig } from '../../../core/layer/EffectConfig.js';

/** *
 *
 * Config for Glitch Drumroll Horizontal Wave Effect
 * Creates an animated glitch for the composite image
 * Can be glitched to appear on a percentage of the frames generated
 *
 * @glitchChance - the percent chance this effect could apply to a given frame
 * @glitchOffset - the amount of 'slice' visible
 * @glitchOffsetTimes - the number of times to glitch during the total frame count
 * @cosineFactor - changes the 'slice'
 */
export class GlitchDrumrollHorizontalWaveConfig extends EffectConfig {
    constructor(
        {
            glitchChance = 100,
            glitchOffset = { lower: 40, upper: 80 },
            glitchOffsetTimes = { lower: 1, upper: 3 },
            cosineFactor = { lower: 2, upper: 6 },
        },
    ) {
        super();
        this.glitchChance = glitchChance;
        this.glitchOffset = glitchOffset;
        this.glitchOffsetTimes = glitchOffsetTimes;
        this.cosineFactor = cosineFactor;
    }
}
