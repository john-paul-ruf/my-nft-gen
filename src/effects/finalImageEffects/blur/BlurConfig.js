import {EffectConfig} from 'my-nft-gen/src/core/layer/EffectConfig.js';
import {Range} from "my-nft-gen/src/core/layer/configType/Range.js";

/** *
 *
 * Config for Blur Effect
 * Creates an animated blur for the composite image
 * Can be glitched to appear on a percentage of the frames generated
 *
 * @lowerRange - Range: where the amount of blur starts
 * @upperRange - Range: where the amount of blur ends
 * @times - Range: the number of times to blur from lower to upper during the total frame count
 * @glitchChance - the percent chance this effect could apply to a given frame
 */
export class BlurConfig extends EffectConfig {
    constructor(
        {
            lowerRange = new Range(0, 0),
            upperRange = new Range(4, 8),
            times = new Range(2, 6),
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
