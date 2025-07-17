import { EffectConfig } from '../../../core/layer/EffectConfig.js';

export class RayRingConfig extends EffectConfig {
    constructor(
        {
            layerOpacity = 1,
            underLayerOpacity = 0.8,
            circles = { lower: 4, upper: 8 },
            radiusInitial = 300,
            radiusGap = 60,
            stroke = 1,
            thickness = 1,
            rayStroke = 1,
            rayThickness = 1,
            scaleFactor = 1.25,
            densityFactor = 1.75,
            accentRange = { bottom: { lower: 0, upper: 0 }, top: { lower: 3, upper: 6 } },
            blurRange = { bottom: { lower: 0, upper: 0 }, top: { lower: 1, upper: 3 } },
            featherTimes = { lower: 2, upper: 4 },
            lengthRange = { bottom: { lower: 5, upper: 15 }, top: { lower: 20, upper: 50 } }, // when spin enabled, length must be at 0 or glitches the loop
            lengthTimes = { lower: 2, upper: 6 },
            sparsityFactor = [1, 2, 3],
            speed = { lower: 0, upper: 0 },
        },
    ) {
        super();
        this.layerOpacity = layerOpacity;
        this.underLayerOpacity = underLayerOpacity;
        this.circles = circles;
        this.radiusInitial = radiusInitial;
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
