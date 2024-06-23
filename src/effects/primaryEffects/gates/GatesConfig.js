import { EffectConfig } from '../../../core/layer/EffectConfig.js';
import {Point2D} from "../../../core/layer/configType/Point2D.js";
import {ColorPicker} from "../../../core/layer/configType/ColorPicker.js";

/** *
 *
 * Config for Gates Effect
 * Creates number of polygons with fuzz
 *
 * @layerOpacity - the opacity of the top, non-fuzzy, layer
 * @underLayerOpacity - the opacity of the bottom, fuzzy, layer
 * @center - Point2D: Where the center is in the overall composition
 * @gates - Range: number of polygons to draw
 * @numberOfSides  - Range: the type of polygon to draw
 * @innerColor - ColorPicker: the color for the thickness
 * @outerColor - ColorPicker: the color for the stroke and accent
 * @thickness = the thickness of the polygon
 * @stroke = the stroke to apply to the polygon
 * @accentRange - Dynamic Range: the weight to oscillate the fuzzy layer over the total frames by the number of feather times
 * @blurRange - Dynamic Range: the amount of blur to apply to the fuzzy layer over the total frames by the number of feather times
 * @featherTimes - Range: the number of times to apply the accent range and blur range over the total number of frames
 *
 */

export class GatesConfig extends EffectConfig {
    constructor(
        {
            layerOpacity = 1,
            underLayerOpacity = 0.5,
            center = new Point2D(1080 / 2, 1920 / 2),
            gates = { lower: 1, upper: 3 },
            numberOfSides = { lower: 4, upper: 4 },
            innerColor = new ColorPicker(),
            outerColor = new ColorPicker(),
            thickness = 24,
            stroke = 0,
            accentRange = { bottom: { lower: 2, upper: 5 }, top: { lower: 10, upper: 15 } },
            blurRange = { bottom: { lower: 1, upper: 2 }, top: { lower: 3, upper: 4 } },
            featherTimes = { lower: 2, upper: 4 },
        },
    ) {
        super();
        this.layerOpacity = layerOpacity;
        this.underLayerOpacity = underLayerOpacity;
        this.gates = gates;
        this.numberOfSides = numberOfSides;
        this.stroke = stroke;
        this.thickness = thickness;
        this.accentRange = accentRange;
        this.blurRange = blurRange;
        this.featherTimes = featherTimes;
        this.center = center;
        this.innerColor = innerColor;
        this.outerColor = outerColor;
    }
}
