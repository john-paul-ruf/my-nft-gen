import { EffectConfig } from 'my-nft-gen';
import {Range} from "my-nft-gen/src/core/layer/configType/Range.js";


/** *
 *
 * Config for Glitch Fractal Effect
 * Creates a static glitch for the composite image
 * Can be glitched to appear on a percentage of the frames generated
 *
 * @theRandom - Range: the fractal amount
 * @glitchChance - the percent chance this effect could apply to a given frame
 */
export class GlitchFractalConfig extends EffectConfig {
    constructor(
        {
            theRandom = new Range(5, 10),
            glitchChance = 100,
        },
    ) {
        super();
        this.theRandom = theRandom;
        this.glitchChance = glitchChance;
    }
}
