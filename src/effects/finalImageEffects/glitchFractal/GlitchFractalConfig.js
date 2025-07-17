import { EffectConfig } from '../../../core/layer/EffectConfig.js';


/** *
 *
 * Config for Glitch Fractal Effect
 * Creates a static glitch for the composite image
 * Can be glitched to appear on a percentage of the frames generated
 *
 * @theRandom - the fractal amount
 * @glitchChance - the percent chance this effect could apply to a given frame
 */
export class GlitchFractalConfig extends EffectConfig {
    constructor(
        {
            theRandom = { lower: 5, upper: 10 },
            glitchChance = 100,
        },
    ) {
        super();
        this.theRandom = theRandom;
        this.glitchChance = glitchChance;
    }
}
