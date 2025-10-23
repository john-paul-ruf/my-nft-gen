import { EffectConfig } from 'my-nft-gen';
import {Range} from "my-nft-gen/src/core/layer/configType/Range.js";

/** *
 *
 * Config for Pixelate Effect
 * Creates an animated glitch for the composite image
 * Can be glitched to appear on a percentage of the frames generated
 *
 * @lowerRange - Range: where the amount of pixelate starts
 * @upperRange - Range: where the amount of pixelate ends
 * @times - Range: the number of times to pixelate from lower to upper during the total frame count
 * @glitchChance - the percent chance this effect could apply to a given frame
 *
 */

export class PixelateConfig extends EffectConfig {
    constructor(
        {
            lowerRange = new Range(0, 0),
            upperRange = new Range(3, 6),
            times = new Range(1, 3),
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
