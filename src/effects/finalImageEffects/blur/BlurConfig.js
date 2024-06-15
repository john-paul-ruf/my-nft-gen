import {EffectConfig} from '../../../core/layer/EffectConfig.js';

/** *
 *
 * Config for Blur Effect
 * Creates an animated blur for the composite image
 * Can be glitched to appear on a percentage of the frames generated
 *
 * @lowerRange - a lower and upper value for where the amount of blur starts
 * @upperRange - a lower and upper value for where the amount of blur ends
 * @times - the number of times to blur from lower to upper during the total frame count
 * @glitchChance - the percent chance this effect could apply to a given frame
 */
export class BlurConfig extends EffectConfig {
    constructor(
        {
            lowerRange = {lower: 0, upper: 0},
            upperRange = {lower: 4, upper: 8},
            times = {lower: 2, upper: 6},
            glitchChance = 100,
        },
    ) {
        super();
        this.lowerRange = lowerRange;
        this.upperRange = upperRange;
        this.times = times;
        this.glitchChance = glitchChance;
    }
}
