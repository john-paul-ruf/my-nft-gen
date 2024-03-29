import { EffectConfig } from '../../../core/layer/EffectConfig.js';

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
