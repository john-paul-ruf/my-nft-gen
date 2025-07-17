import { EffectConfig } from '../../../core/layer/EffectConfig.js';
import { Point2D } from '../../../core/layer/configType/Point2D.js';
import { ColorPicker } from '../../../core/layer/configType/ColorPicker.js';

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
 * @center - Point2D: Where the center is in the overall composition
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
            center = new Point2D(1080 / 2, 1920 / 2),
            innerColor = new ColorPicker(),
            outerColor = new ColorPicker(),
            speed = 1,
            invertDirection = false,
            largeRadius = {
                lower: (finalSize) => finalSize.longestSide * 0.15,
                upper: (finalSize) => finalSize.longestSide * 0.15,
            },
            smallRadius = {
                lower: (finalSize) => finalSize.longestSide * 0.25,
                upper: (finalSize) => finalSize.longestSide * 0.25,
            },
            largeNumberOfRings = { lower: 8, upper: 8 },
            smallNumberOfRings = { lower: 8, upper: 8 },
            ripple = {
                lower: (finalSize) => finalSize.shortestSide * 0.10,
                upper: (finalSize) => finalSize.shortestSide * 0.10,
            },
            times = { lower: 2, upper: 4 },
            smallerRingsGroupRadius = {
                lower: (finalSize) => finalSize.shortestSide * 0.3,
                upper: (finalSize) => finalSize.shortestSide * 0.3,
            },
            accentRange = { bottom: { lower: 1, upper: 1 }, top: { lower: 3, upper: 6 } },
            blurRange = { bottom: { lower: 1, upper: 1 }, top: { lower: 1, upper: 1 } },
            featherTimes = { lower: 2, upper: 4 },
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
