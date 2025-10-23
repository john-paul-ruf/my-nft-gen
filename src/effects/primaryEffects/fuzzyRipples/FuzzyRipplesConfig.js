import { EffectConfig } from 'my-nft-gen';
import { Position } from 'my-nft-gen/src/core/position/Position.js';
import { ColorPicker } from 'my-nft-gen/src/core/layer/configType/ColorPicker.js';
import {PercentageRange} from "my-nft-gen/src/core/layer/configType/PercentageRange.js";
import {PercentageShortestSide} from "my-nft-gen/src/core/layer/configType/PercentageShortestSide.js";
import {PercentageLongestSide} from "my-nft-gen/src/core/layer/configType/PercentageLongestSide.js";
import {Range} from "my-nft-gen/src/core/layer/configType/Range.js";
import {DynamicRange} from "my-nft-gen/src/core/layer/configType/DynamicRange.js";

/** *
 *
 * Config for Fuzzy Ripples Effect
 * Creates a set of six outer rings, connected by a hexagon, with a larger set of rings generated from the center, with fuzz
 *
 * @invertLayers - False: fuzzy layer composites on the bottom, True: fuzzy layer composites over the top
 * @layerOpacity - the opacity of the top, non-fuzzy, layer
 * @underLayerOpacity - the opacity of the bottom, fuzzy, layer
 * @stroke = the stroke to apply to the drawing
 * @thickness = the thickness of the drawing
 * @center - Position: Where the center is in the overall composition
 * @innerColor - ColorPicker: the color for the thickness
 * @outerColor - ColorPicker: the color for the stroke and accent
 * @largeRadius = PercentageRange: the radius of the center circles,
 * @smallRadius = PercentageRange: the radius of the six outer circles
 * @largeNumberOfRings = Range: number of large rings,
 * @smallNumberOfRings = Range: number of smaller rings in each set,
 * @ripple = PercentageRange: amount to expand and then contract,
 * @times = Range: number of times to ripple,
 * @smallerRingsGroupRadius = PercentageRange: the radius of the outer six circles and the outer point of the hexagon,
 * @accentRange - Dynamic Range: the weight to oscillate the fuzzy layer over the total frames by the number of feather times
 * @blurRange - Dynamic Range: the amount of blur to apply to the fuzzy layer over the total frames by the number of feather times
 * @featherTimes - Range: the number of times to apply the accent range and blur range over the total number of frames
 *
 */

export class FuzzyRipplesConfig extends EffectConfig {
    constructor(
        {
            invertLayers = true,
            layerOpacity = 1,
            underLayerOpacity = 0.8,
            stroke = 1,
            thickness = 2,
            center = new Position({x: 1080 / 2, y: 1920 / 2}),
            innerColor = new ColorPicker(),
            outerColor = new ColorPicker(),
            speed = 1,
            invertDirection = false,
            largeRadius = new PercentageRange(new PercentageLongestSide(0.15), new PercentageLongestSide(0.15)),
            smallRadius = new PercentageRange(new PercentageLongestSide(0.25), new PercentageLongestSide(0.25)),
            largeNumberOfRings = new Range(8, 8),
            smallNumberOfRings = new Range(8, 8),
            ripple = new PercentageRange(new PercentageShortestSide(0.10), new PercentageShortestSide(0.10)),
            times = new Range(2, 4),
            smallerRingsGroupRadius = new PercentageRange(new PercentageShortestSide(0.3), new PercentageShortestSide(0.3)),
            accentRange = new DynamicRange(new Range(1, 1), new Range(3, 6)),
            blurRange = new DynamicRange(new Range(1, 1), new Range(1, 1)),
            featherTimes = new Range(2, 4),
        },
    ) {
        super();
        this.invertLayers = invertLayers;
        this.layerOpacity = layerOpacity;
        this.underLayerOpacity = underLayerOpacity;
        this.stroke = stroke;
        this.thickness = thickness;
        this.largeRadius = largeRadius;
        this.smallRadius = smallRadius;
        this.largeNumberOfRings = largeNumberOfRings;
        this.smallNumberOfRings = smallNumberOfRings;
        this.ripple = ripple;
        this.times = times;
        this.invertDirection = invertDirection;
        this.smallerRingsGroupRadius = smallerRingsGroupRadius;
        this.accentRange = accentRange;
        this.blurRange = blurRange;
        this.featherTimes = featherTimes;
        this.innerColor = innerColor;
        this.outerColor = outerColor;
        this.center = center;
        this.speed = speed;
    }
}
