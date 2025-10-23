import {EffectConfig} from 'my-nft-gen/src/core/layer/EffectConfig.js';
import {Range} from "my-nft-gen/src/core/layer/configType/Range.js";

export class BlurKeyFrameConfig extends EffectConfig {
    constructor(
        {
            keyFrames = [0, 120, 360, 900],
            glitchFrameCount = [15, 30],
            upperRange = new Range(1, 8),
            times = new Range(1, 1),
        }
    ) {
        super();
        this.keyFrames = keyFrames;
        this.glitchFrameCount = glitchFrameCount;
        this.upperRange = upperRange;
        this.times = times;
    }
}
