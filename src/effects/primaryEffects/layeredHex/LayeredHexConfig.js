import { EffectConfig } from 'my-nft-gen';
import {Range} from "my-nft-gen/src/core/layer/configType/Range.js";
import {Position} from "my-nft-gen/src/core/position/Position.js";
import {DynamicRange} from "my-nft-gen/src/core/layer/configType/DynamicRange.js";

/** *
 *
 * Config for Layered Hex Effect
 * Creates layered hexagonal patterns with animated properties
 *
 * @invertLayers - boolean: whether to invert layer compositing order
 * @thickness - number: line thickness
 * @stroke - number: stroke width
 * @layerOpacityRange - DynamicRange: layer opacity modulation range
 * @layerOpacityTimes - Range: number of layer opacity cycles
 * @indexOpacityRange - DynamicRange: index opacity modulation range
 * @indexOpacityTimes - Range: number of index opacity cycles
 * @radius - Range: hexagon radius range
 * @offsetRadius - Range: offset radius range
 * @numberOfIndex - Range: number of index elements
 * @startIndex - Range: starting index range
 * @startAngle - number: starting angle in degrees
 * @movementGaston - Range: movement factor range
 * @initialNumberOfPoints - number: initial number of points
 * @scaleByFactor - number: scaling factor
 * @accentRange - DynamicRange: accent weight range
 * @blurRange - DynamicRange: blur amount range
 * @featherTimes - Range: number of feather cycles
 */
export class LayeredHexConfig extends EffectConfig {
    constructor(
        {
            invertLayers = true,

            thickness = 1,
            stroke = 1,

            layerOpacityRange = new DynamicRange(new Range(1, 1), new Range(1, 1)),
            layerOpacityTimes = new Range(2, 4),

            indexOpacityRange = new DynamicRange(new Range(0.3, 0.5), new Range(0.9, 1)),
            indexOpacityTimes = new Range(2, 4),

            radius = new Range(10, 20),
            offsetRadius = new Range(15, 30),

            numberOfIndex = new Range(10, 30),
            startIndex = new Range(8, 12),

            startAngle = 15,

            movementGaston = new Range(1, 6),

            initialNumberOfPoints = 12,
            scaleByFactor = 1.3,

            accentRange = new DynamicRange(new Range(1, 1), new Range(3, 6)),
            blurRange = new DynamicRange(new Range(1, 1), new Range(1, 1)),
            featherTimes = new Range(2, 4),
            center = new Position({x: 1080 / 2, y: 1920 / 2}),
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
        this.center = center;
    }
}
