import { EffectConfig } from 'my-nft-gen';
import { Range } from "my-nft-gen/src/core/layer/configType/Range.js";

export class SingleLayerGlitchFractalConfig extends EffectConfig {
    constructor(
        {
            theRandom = new Range(12, 12),
            glitchChance = 100,
        },
    ) {
        super();
        this.theRandom = theRandom;
        this.glitchChance = glitchChance;
    }
}