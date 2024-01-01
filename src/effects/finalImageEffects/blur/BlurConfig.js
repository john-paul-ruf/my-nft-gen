import {EffectConfig} from "../../EffectConfig.js";

export class BlurConfig extends EffectConfig {
    constructor(
        {
            lowerRange= {lower: 0, upper: 0},
            upperRange= {lower: 4, upper: 8},
            times= {lower: 2, upper: 6},
            glitchChance= 100,
        }
    ) {
        super();
        this.lowerRange = lowerRange;
        this.upperRange = upperRange;
        this.times = times;
        this.glitchChance = glitchChance;
    }
}