import { EffectConfig } from 'my-nft-gen';
import {Position} from "my-nft-gen/src/core/position/Position.js";
import {ColorPicker} from "my-nft-gen/src/core/layer/configType/ColorPicker.js";
import {Range} from "my-nft-gen/src/core/layer/configType/Range.js";
import {DynamicRange} from "my-nft-gen/src/core/layer/configType/DynamicRange.js";

/** *
 *
 * Config for Gates Effect
 * Creates number of polygons with fuzz
 *
 * @layerOpacity - the opacity of the top, non-fuzzy, layer
 * @underLayerOpacity - the opacity of the bottom, fuzzy, layer
 * @center - Position: Where the center is in the overall composition
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
            center = new Position({x: 1080 / 2, y: 1920 / 2}),
            gates = new Range(1, 3),
            numberOfSides = new Range(4, 4),
            innerColor = new ColorPicker(),
            outerColor = new ColorPicker(),
            thickness = 24,
            stroke = 0,
            accentRange = new DynamicRange(new Range(2, 5), new Range(10, 15)),
            blurRange = new DynamicRange(new Range(1, 2), new Range(3, 4)),
            featherTimes = new Range(2, 4),
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
