import {EffectConfig} from 'my-nft-gen/src/core/layer/EffectConfig.js';

export class CRTDegaussConfig extends EffectConfig {
    constructor(
        {
            keyFrames = [0, 120, 360, 900],
            glitchFrameCount = [15, 30],
            sectionHeight = [5, 20, 30, 40, 50, 75],
            offset = {lower: 5, upper: 15},
            direction = [-1, 1],
            glitchTimes = {lower: 1, upper: 2},
            backgroundRed = {lower: 0, upper: 0},
            backgroundGreen = {lower: 0, upper: 0},
            backgroundBlue = {lower: 0, upper: 0},
            backgroundAlpha = {lower: 1, upper: 1},
            amount = {lower: 0.4,  upper: 0.7},
        }
    ) {
        super();
        this.keyFrames = keyFrames;
        this.glitchFrameCount = glitchFrameCount;
        this.sectionHeight = sectionHeight;
        this.offset = offset;
        this.direction = direction;
        this.glitchTimes = glitchTimes;
        this.backgroundRed = backgroundRed;
        this.backgroundGreen = backgroundGreen;
        this.backgroundBlue = backgroundBlue;
        this.backgroundAlpha = backgroundAlpha;
        this.amount = amount;
    }
}
