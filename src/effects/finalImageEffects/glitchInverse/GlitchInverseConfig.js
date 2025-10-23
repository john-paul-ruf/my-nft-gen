import { EffectConfig } from 'my-nft-gen';

/** *
 *
 * Config for Glitch Inverse Effect
 * Inverts all colors for the composite image
 * Can be glitched to appear on a percentage of the frames generated
 *
 * @glitchChance - the percent chance this effect could apply to a given frame
 */
export class GlitchInverseConfig extends EffectConfig {
    constructor(
        {
            glitchChance = 100,
        },
    ) {
        super();
        this.glitchChance = glitchChance;
    }
}
