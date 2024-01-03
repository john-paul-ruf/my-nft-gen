import {EffectConfig} from "../../../core/layer/EffectConfig.js";

export class LayeredRingConfig extends EffectConfig {
    constructor(
        {
            thickness= 4,
            stroke= 0,

            layerOpacityRange= {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
            layerOpacityTimes= {lower: 2, upper: 4},

            indexOpacityRange= {bottom: {lower: 0.3, upper: 0.5}, top: {lower: 0.9, upper: 1}},
            indexOpacityTimes= {lower: 2, upper: 4},

            radius={lower: 40, upper: 60},
            offsetRadius= {lower: 30, upper: 60},

            numberOfIndex= {lower: 20, upper: 40},
            startIndex= {lower: 8, upper: 12},

            startAngle= 0,

            movementGaston= {lower: 1, upper: 12},

            initialNumberOfPoints= 4,
            scaleByFactor= 1.1
        }
    ) {
        super();
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
    }
}