import {EffectConfig} from 'my-nft-gen/src/core/layer/EffectConfig.js';

export class CRTBarrelConfig extends EffectConfig {
    constructor(
        {
            strength = {lower: 0.5, upper: 0.5},
            edgeThreshold = {lower: 0.1, upper: 0.1},
            corner = {lower: 0.1, upper: 0.1},
        },
    ) {
        super();
        this.strength = strength;
        this.edgeThreshold = edgeThreshold;
        this.corner = corner;
    }
}
