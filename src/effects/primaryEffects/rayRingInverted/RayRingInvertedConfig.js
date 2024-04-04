import { EffectConfig } from '../../../core/layer/EffectConfig.js';

export class RayRingInvertedConfig extends EffectConfig {
    constructor(
        {
            layerOpacity = 0.25,
            underLayerOpacity = 0.15,
            circles = { lower: 4, upper: 8 },
            radiusGap = 75,
            stroke = 1,
            thickness = 1,
            rayStroke = 1,
            rayThickness = 1,
            scaleFactor = 1.25,
            densityFactor = 1.75,
            accentRange = { bottom: { lower: 0, upper: 3 }, top: { lower: 4, upper: 0 } },
            blurRange = { bottom: { lower: 0, upper: 2 }, top: { lower: 4, upper: 8 } },
            featherTimes = { lower: 2, upper: 4 },
            lengthRange = { bottom: { lower: 5, upper: 15 }, top: { lower: 20, upper: 50 } }, // when spin enabled, length must be at 0 or glitches the loop
            lengthTimes = { lower: 4, upper: 8 },
            sparsityFactor = [1, 2, 3, 4, 5, 6, 8, 9, 10],
            speed = { lower: 0, upper: 0 },
        },
    ) {
        super();
        this.layerOpacity = layerOpacity;
        this.underLayerOpacity = underLayerOpacity;
        this.circles = circles;
        this.radiusGap = radiusGap;
        this.stroke = stroke;
        this.thickness = thickness;
        this.rayStroke = rayStroke;
        this.rayThickness = rayThickness;
        this.scaleFactor = scaleFactor;
        this.densityFactor = densityFactor;
        this.accentRange = accentRange;
        this.blurRange = blurRange;
        this.featherTimes = featherTimes;
        this.lengthRange = lengthRange;
        this.lengthTimes = lengthTimes;
        this.sparsityFactor = sparsityFactor;
        this.speed = speed;
    }
}
