import { EffectConfig } from 'my-nft-gen';
import {Range} from "my-nft-gen/src/core/layer/configType/Range.js";

/** *
 *
 * Config for Fade Effect
 * Creates an animated fade for the composite image
 *
 * @lowerRange - Range: where the fade starts
 * @upperRange - Range: where the fade ends
 * @times - Range: the number of times to fade from lower to upper during the total frame count
 */
export class FadeConfig extends EffectConfig {
    constructor(
        {
            lowerRange = new Range(0.6, 0.8),
            upperRange = new Range(0.95, 1),
            times = new Range(2, 4),
        },
    ) {
        super();
        this.lowerRange = lowerRange;
        this.upperRange = upperRange;
        this.times = times;
    }
}
