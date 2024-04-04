import { EffectConfig } from '../../../core/layer/EffectConfig.js';

export class GlowConfig extends EffectConfig {
    constructor(
        {
            lowerRange = { lower: -18, upper: -0 },
            upperRange = { lower: 0, upper: 18 },
            times = { lower: 2, upper: 6 },
        },
    ) {
        super();
        this.lowerRange = lowerRange;
        this.upperRange = upperRange;
        this.times = times;
    }
}
