import { EffectConfig } from '../../../core/layer/EffectConfig.js';
import { ColorPicker } from '../../../core/layer/configType/ColorPicker.js';
import {Point2D} from "../../../core/layer/configType/Point2D.js";

/** *
 *
 * Config for Fuzzy Band Effect
 * Creates a set of rings with fuzz
 *
 * @outerColor - ColorPicker: the color for the stroke and accent
 * @innerColor - ColorPicker: the color for the thickness
 * @invertLayers - False: fuzzy layer composites on the bottom, True: fuzzy layer composites over the top
 * @layerOpacity - the opacity of the top, non-fuzzy, layer
 * @center - Point2D: Where the center is in the overall composition
 * @underLayerOpacityRange - the opacity of the bottom, fuzzy, layer
 * @underLayerOpacityTimes - the number of times to move through the underlay opacity range over the number of frames
 * @circles = Range: the number of circles to draw
 * @stroke = the stroke to apply to the bands
 * @thickness = the thickness of the Bands
 * @radius = PercentageRange: the range to draw the circles in
 * @accentRange - Dynamic Range: the weight to oscillate the fuzzy layer over the total frames by the number of feather times
 * @blurRange - Dynamic Range: the amount of blur to apply to the fuzzy layer over the total frames by the number of feather times
 * @featherTimes - Range: the number of times to apply the accent range and blur range over the total number of frames
 *
 */

export class FuzzyBandConfig extends EffectConfig {
    constructor(
        {
            color = new ColorPicker(),
            innerColor = new ColorPicker(),
            invertLayers = true,
            layerOpacity = 1,
            center = new Point2D(1080 / 2, 1920 / 2),
            underLayerOpacityRange = { bottom: { lower: 0.7, upper: 0.8 }, top: { lower: 0.9, upper: 0.95 } },
            underLayerOpacityTimes = { lower: 2, upper: 6 },
            circles = { lower: 6, upper: 10 },
            stroke = 0,
            thickness = 4,
            radius = {
                lower: (finalSize) => finalSize.shortestSide * 0.10,
                upper: (finalSize) => finalSize.longestSide * 0.45,
            },
            accentRange = { bottom: { lower: 6, upper: 12 }, top: { lower: 25, upper: 45 } },
            blurRange = { bottom: { lower: 1, upper: 3 }, top: { lower: 8, upper: 12 } },
            featherTimes = { lower: 2, upper: 6 },
        },
    ) {
        super();
        this.invertLayers = invertLayers;
        this.layerOpacity = layerOpacity;
        this.underLayerOpacityRange = underLayerOpacityRange;
        this.underLayerOpacityTimes = underLayerOpacityTimes;
        this.circles = circles;
        this.stroke = stroke;
        this.thickness = thickness;
        this.radius = radius;
        this.accentRange = accentRange;
        this.blurRange = blurRange;
        this.featherTimes = featherTimes;
        this.color = color;
        this.innerColor = innerColor;
    }
}
