import { EffectConfig } from 'my-nft-gen';

export class SingleLayerGlitchDrumrollHorizontalWaveConfig extends EffectConfig {
    constructor(
        {
            glitchChance = 100,
            glitchOffset = { lower: 40, upper: 80 },
            glitchOffsetTimes = { lower: 1, upper: 3 },
            cosineFactor = { lower: 2, upper: 6 },
        },
    ) {
        super();
        this.glitchChance = glitchChance;
        this.glitchOffset = glitchOffset;
        this.glitchOffsetTimes = glitchOffsetTimes;
        this.cosineFactor = cosineFactor;
    }
}
