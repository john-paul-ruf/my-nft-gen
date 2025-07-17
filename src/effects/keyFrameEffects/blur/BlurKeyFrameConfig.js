import {EffectConfig} from '../../../core/layer/EffectConfig.js';

export class BlurKeyFrameConfig extends EffectConfig {
    constructor(
        {
            keyFrames = [0, 120, 360, 900],
            glitchFrameCount = [15, 30],
            upperRange = { lower: 1, upper: 8 },
            times = { lower: 1, upper: 1 },
        }
    ) {
        super();
        this.keyFrames = keyFrames;
        this.glitchFrameCount = glitchFrameCount;
        this.upperRange = upperRange;
        this.times = times;
    }
}
