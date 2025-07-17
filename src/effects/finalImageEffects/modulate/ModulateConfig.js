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
export class ModulateConfig extends EffectConfig {
    constructor(
        {
            brightnessRange  = {bottom: {lower: 0.8, upper: 0.8}, top: {lower: 1, upper: 1}},
            brightnessTimes = {lower: 2, upper: 8},
            saturationRange  = {bottom: {lower: 0.8, upper: 0.8}, top: {lower: 1, upper: 1}},
            saturationTimes = {lower: 2, upper: 8},
            contrastRange  = {bottom: {lower: 1, upper: 1}, top: {lower: 1.5, upper: 1.5}},
            contrastTimes = {lower: 2, upper: 8},
        },
    ) {
        super();
        this.brightnessRange = brightnessRange;
        this.brightnessTimes = brightnessTimes;
        this.saturationRange = saturationRange;
        this.saturationTimes = saturationTimes;
        this.contrastRange = contrastRange;
        this.contrastTimes = contrastTimes;
    }
}
