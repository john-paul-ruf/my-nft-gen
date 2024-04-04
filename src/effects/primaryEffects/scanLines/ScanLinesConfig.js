import { EffectConfig } from '../../../core/layer/EffectConfig.js';

export class ScanLinesConfig extends EffectConfig {
    constructor(
        {
            lines = { lower: 2, upper: 4 },
            minlength = { lower: 30, upper: 40 },
            maxlength = { lower: 80, upper: 100 },
            times = { lower: 4, upper: 8 },
            alphaRange = { bottom: { lower: 0.3, upper: 0.4 }, top: { lower: 0.5, upper: 0.6 } },
            alphaTimes = { lower: 4, upper: 8 },
            loopTimes = { lower: 1, upper: 2 },
        },
    ) {
        super();
        this.lines = lines;
        this.minlength = minlength;
        this.maxlength = maxlength;
        this.times = times;
        this.alphaRange = alphaRange;
        this.alphaTimes = alphaTimes;
        this.loopTimes = loopTimes;
    }
}
