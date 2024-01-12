import {EffectConfig} from "../../../core/layer/EffectConfig.js";

export class PixelateConfig extends EffectConfig {
    constructor(
        {
            lowerRange= {lower: 0, upper: 0},
            upperRange= {lower: 3, upper: 6},
            times= {lower: 1, upper: 3},
            glitchChance= 80,
        }
    ) {
        super();
        this.lowerRange = lowerRange;
        this.upperRange = upperRange;
        this.times = times;
        this.glitchChance = glitchChance;

    }
}