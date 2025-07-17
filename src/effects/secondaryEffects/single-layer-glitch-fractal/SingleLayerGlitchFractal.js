import { EffectConfig } from '../../../core/layer/EffectConfig.js';

export class SingleLayerGlitchFractalConfig extends EffectConfig {
    constructor(
        {
            theRandom = { lower: 12, upper: 12 },
            glitchChance = 100,
        },
    ) {
        super();
        this.theRandom = theRandom;
        this.glitchChance = glitchChance;
    }
}
