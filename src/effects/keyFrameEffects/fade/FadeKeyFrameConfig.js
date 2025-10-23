import {EffectConfig} from 'my-nft-gen/src/core/layer/EffectConfig.js';
import {Range} from "my-nft-gen/src/core/layer/configType/Range.js";

export class FadeKeyFrameConfig extends EffectConfig {
    constructor(
        {
            keyFrames = [0, 120, 360, 900],
            glitchFrameCount = [15, 30],
            lowerRange = new Range(0.6, 0.8),
            upperRange = new Range(0.6, 0.8),
            times = new Range(2, 4),
        }
    ) {
        super();
        this.keyFrames = keyFrames;
        this.glitchFrameCount = glitchFrameCount;
        this.lowerRange = lowerRange;
        this.upperRange = upperRange;
        this.times = times;
    }
}
