import { EffectConfig } from 'my-nft-gen';
import {Range} from "my-nft-gen/src/core/layer/configType/Range.js";

/** *
 *
 * Config for Glitch Drumroll Horizontal Wave Effect
 * Creates an animated glitch for the composite image
 * Can be glitched to appear on a percentage of the frames generated
 *
 * @glitchChance - the percent chance this effect could apply to a given frame
 * @glitchOffset - Range: the amount of 'slice' visible
 * @glitchOffsetTimes - Range: the number of times to glitch during the total frame count
 * @cosineFactor - Range: changes the 'slice'
 */
export class GlitchDrumrollHorizontalWaveConfig extends EffectConfig {
    constructor(
        {
            glitchChance = 100,
            glitchOffset = new Range(40, 80),
            glitchOffsetTimes = new Range(1, 3),
            cosineFactor = new Range(2, 6),
        },
    ) {
        super();
        this.glitchChance = glitchChance;
        this.glitchOffset = glitchOffset;
        this.glitchOffsetTimes = glitchOffsetTimes;
        this.cosineFactor = cosineFactor;
    }
}
