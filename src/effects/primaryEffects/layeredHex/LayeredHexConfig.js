import { EffectConfig } from '../../../core/layer/EffectConfig.js';

export class LayeredHexConfig extends EffectConfig {
    constructor(
        {
            invertLayers = true,

            thickness = 1,
            stroke = 1,

            layerOpacityRange = { bottom: { lower: 1, upper: 1 }, top: { lower: 1, upper: 1 } },
            layerOpacityTimes = { lower: 2, upper: 4 },

            indexOpacityRange = { bottom: { lower: 0.3, upper: 0.5 }, top: { lower: 0.9, upper: 1 } },
            indexOpacityTimes = { lower: 2, upper: 4 },

            radius = { lower: 10, upper: 20 },
            offsetRadius = { lower: 15, upper: 30 },

            numberOfIndex = { lower: 10, upper: 30 },
            startIndex = { lower: 8, upper: 12 },

            startAngle = 15,

            movementGaston = { lower: 1, upper: 6 },

            initialNumberOfPoints = 12,
            scaleByFactor = 1.3,

            accentRange = { bottom: { lower: 1, upper: 1 }, top: { lower: 3, upper: 6 } },
            blurRange = { bottom: { lower: 1, upper: 1 }, top: { lower: 1, upper: 1 } },
            featherTimes = { lower: 2, upper: 4 },
        },
    ) {
        super();
        this.invertLayers = invertLayers;
        this.thickness = thickness;
        this.stroke = stroke;
        this.layerOpacityRange = layerOpacityRange;
        this.layerOpacityTimes = layerOpacityTimes;
        this.indexOpacityRange = indexOpacityRange;
        this.indexOpacityTimes = indexOpacityTimes;
        this.radius = radius;
        this.offsetRadius = offsetRadius;
        this.numberOfIndex = numberOfIndex;
        this.startIndex = startIndex;
        this.startAngle = startAngle;
        this.movementGaston = movementGaston;
        this.initialNumberOfPoints = initialNumberOfPoints;
        this.scaleByFactor = scaleByFactor;
        this.accentRange = accentRange;
        this.blurRange = blurRange;
        this.featherTimes = featherTimes;
    }
}
