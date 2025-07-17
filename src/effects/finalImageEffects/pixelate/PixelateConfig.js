import { EffectConfig } from '../../../core/layer/EffectConfig.js';

/** *
 *
 * Config for Pixelate Effect
 * Creates an animated glitch for the composite image
 * Can be glitched to appear on a percentage of the frames generated
 *
 * @lowerRange - a lower and upper value for where the amount of pixelate starts
 * @upperRange - a lower and upper value for where the amount of pixelate ends
 * @times - the number of times to pixelate from lower to upper during the total frame count
 * @glitchChance - the percent chance this effect could apply to a given frame
 *
 */

export class PixelateConfig extends EffectConfig {
    constructor(
        {
            lowerRange = { lower: 0, upper: 0 },
            upperRange = { lower: 3, upper: 6 },
            times = { lower: 1, upper: 3 },
            glitchChance = 80,
        },
    ) {
        super();
        this.lowerRange = lowerRange;
        this.upperRange = upperRange;
        this.times = times;
        this.glitchChance = glitchChance;
    }
}
