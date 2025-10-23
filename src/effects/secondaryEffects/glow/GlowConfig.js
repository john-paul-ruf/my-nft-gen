import { EffectConfig } from 'my-nft-gen';
import {Range} from "my-nft-gen/src/core/layer/configType/Range.js";

export class GlowConfig extends EffectConfig {
    constructor(
        {
            lowerRange = new Range(-18, -0),
            upperRange = new Range(0, 18),
            times = new Range(2, 6),
        },
    ) {
        super();
        this.lowerRange = lowerRange;
        this.upperRange = upperRange;
        this.times = times;
    }
}
