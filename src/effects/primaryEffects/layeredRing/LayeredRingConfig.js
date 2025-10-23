import { EffectConfig } from 'my-nft-gen';
import {Range} from "my-nft-gen/src/core/layer/configType/Range.js";
import {Position} from "my-nft-gen/src/core/position/Position.js";
import {DynamicRange} from "my-nft-gen/src/core/layer/configType/DynamicRange.js";

export class LayeredRingConfig extends EffectConfig {
    constructor(
        {
            thickness = 4,
            stroke = 0,

            layerOpacityRange = new DynamicRange(new Range(1, 1), new Range(1, 1)),
            layerOpacityTimes = new Range(2, 4),

            indexOpacityRange = new DynamicRange(new Range(0.3, 0.5), new Range(0.9, 1)),
            indexOpacityTimes = new Range(2, 4),

            radius = new Range(20, 30),
            offsetRadius = new Range(20, 40),

            numberOfIndex = new Range(5, 20),
            startIndex = new Range(8, 12),

            startAngle = 0,

            movementGaston = new Range(1, 6),

            initialNumberOfPoints = 4,
            scaleByFactor = 1.2,
            center = new Position({x: 1080 / 2, y: 1920 / 2}),
        },
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
        this.center = center;
    }
}
