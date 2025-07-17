import { EffectConfig } from '../../../core/layer/EffectConfig.js';

export class ScopesConfig extends EffectConfig {
    constructor(
        {
            layerOpacity = 1,
            sparsityFactor = [4, 5, 6, 8, 9, 10],
            gapFactor = { lower: 0.2, upper: 0.4 },
            radiusFactor = { lower: 0.1, upper: 0.2 },
            scaleFactor = 1.2,
            alphaRange = { bottom: { lower: 0.3, upper: 0.5 }, top: { lower: 0.8, upper: 1 } },
            alphaTimes = { lower: 2, upper: 8 },
            rotationTimes = { lower: 0, upper: 0 },
            numberOfScopesInALine = 40,
        },
    ) {
        super();
        this.layerOpacity = layerOpacity;
        this.sparsityFactor = sparsityFactor;
        this.gapFactor = gapFactor;
        this.radiusFactor = radiusFactor;
        this.scaleFactor = scaleFactor;
        this.alphaRange = alphaRange;
        this.alphaTimes = alphaTimes;
        this.rotationTimes = rotationTimes;
        this.numberOfScopesInALine = numberOfScopesInALine;
    }
}
