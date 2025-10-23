import { EffectConfig } from 'my-nft-gen';

export class PorousConfig extends EffectConfig {
    constructor(
        {
            layerOpacity = 0.5,
        },
    ) {
        super();
        this.layerOpacity = layerOpacity;
    }
}
