import {EffectConfig} from "../../EffectConfig.js";

export class GlitchFractalConfig extends EffectConfig {
    constructor(
        {
            theRandom = {lower: 5, upper: 10},
            glitchChance = 100,
        }
    ) {
        super();
        this.theRandom = theRandom;
        this.glitchChance = glitchChance;
    }
}