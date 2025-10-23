import {EffectConfig} from 'my-nft-gen/src/core/layer/EffectConfig.js';

export class SetOpacityKeyFrameConfig extends EffectConfig {
    constructor(
        {
            keyFrames = [0, 120, 360, 900],
            glitchFrameCount = [15, 30],
            opacity = 1,
        }
    ) {
        super();
        this.keyFrames = keyFrames;
        this.glitchFrameCount = glitchFrameCount;
        this.opacity = opacity;
    }
}
