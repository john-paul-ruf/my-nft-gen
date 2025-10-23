import {EffectConfig} from 'my-nft-gen/src/core/layer/EffectConfig.js';
import {Range} from "my-nft-gen/src/core/layer/configType/Range.js";
import {DynamicRange} from "my-nft-gen/src/core/layer/configType/DynamicRange.js";

/** *
 *
 * Config for Modulate Effect
 * Creates an animated modulation for the composite image
 * Can be glitched to appear on a percentage of the frames generated
 *
 * @brightnessRange - DynamicRange: where the amount of brightness starts and ends
 * @brightnessTimes - Range: the number of times to modulate brightness from lower to upper during the total frame count
 * @saturationRange - DynamicRange: where the amount of saturation starts and ends
 * @saturationTimes - Range: the number of times to modulate saturation from lower to upper during the total frame count
 * @contrastRange - DynamicRange: where the amount of contrast starts and ends
 * @contrastTimes - Range: the number of times to modulate contrast from lower to upper during the total frame count
 */
export class ModulateConfig extends EffectConfig {
    constructor(
        {
            brightnessRange  = new DynamicRange(new Range(0.8, 0.8), new Range(1, 1)),
            brightnessTimes = new Range(2, 8),
            saturationRange  = new DynamicRange(new Range(0.8, 0.8), new Range(1, 1)),
            saturationTimes = new Range(2, 8),
            contrastRange  = new DynamicRange(new Range(1, 1), new Range(1.5, 1.5)),
            contrastTimes = new Range(2, 8),
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
