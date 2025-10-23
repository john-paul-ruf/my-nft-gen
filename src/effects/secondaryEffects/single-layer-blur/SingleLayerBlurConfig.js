import { EffectConfig } from 'my-nft-gen';
import {Range} from "my-nft-gen/src/core/layer/configType/Range.js";

export class SingleLayerBlurConfig extends EffectConfig {
    constructor(
        {
            lowerRange = new Range(0, 0),
            upperRange = new Range(2, 6),
            times = new Range(2, 9),
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
