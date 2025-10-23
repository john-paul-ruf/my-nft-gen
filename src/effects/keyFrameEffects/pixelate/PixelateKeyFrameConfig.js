import {EffectConfig} from 'my-nft-gen/src/core/layer/EffectConfig.js';

export class PixelateKeyFrameConfig extends EffectConfig {
    constructor(
        {
            keyFrames = [0, 120, 360, 900],
            glitchFrameCount = [15, 30],
            lowerRange = { lower: 0, upper: 0 },
            upperRange = { lower: 3, upper: 6 },
            times = { lower: 1, upper: 3 },
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
