import {EffectConfig} from '../../../core/layer/EffectConfig.js';

export class FadeKeyFrameConfig extends EffectConfig {
    constructor(
        {
            keyFrames = [0, 120, 360, 900],
            glitchFrameCount = [15, 30],
            lowerRange = { lower: 0.6, upper: 0.8 },
            upperRange = { lower: 0.6, upper: 0.8 },
            times = { lower: 2, upper: 4 },
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
