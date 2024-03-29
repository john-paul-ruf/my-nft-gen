import { EffectConfig } from '../../../core/layer/EffectConfig.js';

export class FadeConfig extends EffectConfig {
    constructor(
        {
            lowerRange = { lower: 0.6, upper: 0.8 },
            upperRange = { lower: 0.95, upper: 1 },
            times = { lower: 2, upper: 4 },
        },
    ) {
        super();
        this.lowerRange = lowerRange;
        this.upperRange = upperRange;
        this.times = times;
    }
}
