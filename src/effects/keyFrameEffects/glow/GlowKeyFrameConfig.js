import {EffectConfig} from 'my-nft-gen/src/core/layer/EffectConfig.js';

export class GlowKeyFrameConfig extends EffectConfig {
    constructor(
        {
            keyFrames = [0, 120, 360, 900],
            glitchFrameCount = [15, 30],
            lowerRange = { lower: -18, upper: -0 },
            times = { lower: 2, upper: 6 },
        }
    ) {
        super();
        this.keyFrames = keyFrames;
        this.glitchFrameCount = glitchFrameCount;
        this.lowerRange = lowerRange;
        this.times = times;
    }
}
