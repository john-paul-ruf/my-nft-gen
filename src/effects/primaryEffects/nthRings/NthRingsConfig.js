import { EffectConfig } from '../../../core/layer/EffectConfig.js';

export class NthRingsConfig extends EffectConfig {
    constructor(
        {
            invertLayers = true,
            totalRingCount = { lower: 12, upper: 16 },
            layerOpacity = 0.5,
            underLayerOpacity = 0.4,
            stroke = 2,
            thickness = 2,
            smallRadius = [(finalSize) => finalSize.longestSide * 0.10, (finalSize) => finalSize.longestSide * 0.1],
            smallNumberOfRings = { lower: 8, upper: 12 },
            ripple = [(finalSize) => finalSize.shortestSide * 0.05, (finalSize) => finalSize.shortestSide * 0.10],
            times = { lower: 2, upper: 4 },
            smallerRingsGroupRadius = [(finalSize) => finalSize.shortestSide * 0.45, (finalSize) => finalSize.shortestSide * 0.50, (finalSize) => finalSize.shortestSide * 0.55],
            accentRange = { bottom: { lower: 1, upper: 1 }, top: { lower: 3, upper: 5 } },
            blurRange = { bottom: { lower: 1, upper: 1 }, top: { lower: 2, upper: 4 } },
            featherTimes = { lower: 2, upper: 4 },
        },
    ) {
        super();
        this.invertLayers = invertLayers;
        this.totalRingCount = totalRingCount;
        this.layerOpacity = layerOpacity;
        this.underLayerOpacity = underLayerOpacity;
        this.stroke = stroke;
        this.thickness = thickness;
        this.smallRadius = smallRadius;
        this.smallNumberOfRings = smallNumberOfRings;
        this.ripple = ripple;
        this.times = times;
        this.smallerRingsGroupRadius = smallerRingsGroupRadius;
        this.accentRange = accentRange;
        this.blurRange = blurRange;
        this.featherTimes = featherTimes;
    }
}
