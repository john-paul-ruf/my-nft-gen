import { EffectConfig } from '../../../core/layer/EffectConfig.js';

export class HexConfig extends EffectConfig {
    constructor(
        {
            layerOpacity = 1,
            underLayerOpacity = 0.8,
            sparsityFactor = [12, 15, 18/* 20, 24, 30, 36 */],
            gapFactor = { lower: 3, upper: 6 },
            radiusFactor = { lower: 1, upper: 3 },
            accentRange = { bottom: { lower: 0, upper: 0 }, top: { lower: 0.75, upper: 1.5 } },
            blurRange = { bottom: { lower: 0, upper: 1 }, top: { lower: 2, upper: 3 } },
            featherTimes = { lower: 2, upper: 4 },
            stroke = 1,
            thickness = 0.5,
            scaleFactor = 0.5,
            numberOfHex = 12,
            strategy = ['static', 'angle', 'rotate'],
            overlayStrategy = ['flat', 'overlay'],
        },
    ) {
        super();
        this.layerOpacity = layerOpacity;
        this.underLayerOpacity = underLayerOpacity;
        this.sparsityFactor = sparsityFactor;
        this.gapFactor = gapFactor;
        this.radiusFactor = radiusFactor;
        this.accentRange = accentRange;
        this.blurRange = blurRange;
        this.featherTimes = featherTimes;
        this.stroke = stroke;
        this.thickness = thickness;
        this.scaleFactor = scaleFactor;
        this.numberOfHex = numberOfHex;
        this.strategy = strategy;
        this.overlayStrategy = overlayStrategy;
    }
}
