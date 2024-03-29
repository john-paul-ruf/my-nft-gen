import { EffectConfig } from '../../../core/layer/EffectConfig.js';

export class SingleLayerBlurConfig extends EffectConfig {
    constructor(
        {
            lowerRange = { lower: 0, upper: 0 },
            upperRange = { lower: 2, upper: 6 },
            times = { lower: 2, upper: 9 },
            glitchChance = 100,
        },
    ) {
        super();
        this.lowerRange = lowerRange;
        this.upperRange = upperRange;
        this.times = times;
        this.glitchChance = glitchChance;
    }
}
