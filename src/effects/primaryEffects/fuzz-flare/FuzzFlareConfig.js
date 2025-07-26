import {EffectConfig} from '../../../core/layer/EffectConfig.js';
import {PercentageRange} from '../../../core/layer/configType/PercentageRange.js';
import {PercentageShortestSide} from '../../../core/layer/configType/PercentageShortestSide.js';
import {PercentageLongestSide} from '../../../core/layer/configType/PercentageLongestSide.js';
import {Range} from '../../../core/layer/configType/Range.js';
import {ColorPicker} from '../../../core/layer/configType/ColorPicker.js';
import {DynamicRange} from "../../../core/layer/configType/DynamicRange.js";
import {MultiStepDefinitionConfig} from "../../../core/math/MultiStepDefinitionConfig.js";
import {Point2D} from "../../../core/layer/configType/Point2D.js";
import {FindValueAlgorithm} from "../../../core/math/findValue.js";

/** *
 *
 * Config for Fuzz Flare Effect
 * Creates a lens flare with the ability to add fuzz
 *
 * @invertLayers - False: fuzzy layer composites on the bottom, True: fuzzy layer composites over the top
 * @innerColor - ColorPicker: the color for the thickness
 * @outerColor - ColorPicker: the color for the stroke and accent
 * @layerOpacity - the opacity of the top, non-fuzzy, layer
 * @center - Point2D: Where the center is in the overall composition
 * @underLayerOpacityRange - the opacity of the bottom, fuzzy, layer
 * @underLayerOpacityTimes - the number of times to move through the underlay opacity range over the number of frames
 * @elementGastonMultiStep Array of MultiStepDefinitionConfig - experimental
 * @numberOfFlareRings = Range: number of rings to draw,
 * @flareRingsSizeRange = PercentageRange: the range to draw the rings within,
 * @flareRingStroke = Range: the stroke to apply to the rings,
 * @flareRingThickness = Range: the thickness of the rings,
 * @numberOfFlareRays = Range: the number of rays to draw
 * @flareRaysSizeRange = PercentageRange: how long the rays should be,
 * @flareRaysStroke = Range: the stroke to apply to the rays,
 * @flareRayThickness = Range: the thickness of the rays,
 * @flareOffset = PercentageRange: the radius from the center to start drawing the rays,
 * @accentRange - Dynamic Range: the weight to oscillate the fuzzy layer over the total frames by the number of feather times
 * @blurRange - Dynamic Range: the amount of blur to apply to the fuzzy layer over the total frames by the number of feather times
 * @featherTimes - Range: the number of times to apply the accent range and blur range over the total number of frames
 *
 */

export class FuzzFlareConfig extends EffectConfig {
    constructor(
        {
            invertLayers = false,

            outerColor = new ColorPicker(ColorPicker.SelectionType.colorBucket),
            innerColor = new ColorPicker(ColorPicker.SelectionType.colorBucket),

            layerOpacity = 0.7,

            center = new Point2D(1080 / 2, 1920 / 2),

            underLayerOpacityRange = {bottom: {lower: 0.35, upper: 0.4}, top: {lower: 0.5, upper: 0.55}},
            underLayerOpacityTimes = {lower: 2, upper: 8},

            elementGastonMultiStep = [
                new MultiStepDefinitionConfig({
                    minPercentage: 0,
                    maxPercentage: 25,
                    max: new Range(15, 25),
                    times: new Range(1, 2),
                }),
                new MultiStepDefinitionConfig({
                    minPercentage: 25,
                    maxPercentage: 75,
                    max: new Range(8, 12),
                    times: new Range(1, 4),
                }),
                new MultiStepDefinitionConfig({
                    minPercentage: 75,
                    maxPercentage: 100,
                    max: new Range(15, 20),
                    times: new Range(1, 3),
                }),
            ],

            numberOfFlareRings = new Range(25, 25),
            flareRingsSizeRange = new PercentageRange(new PercentageShortestSide(0.05), new PercentageLongestSide(1)),
            flareRingStroke = new Range(1, 1),
            flareRingThickness = new Range(1, 3),

            numberOfFlareRays = new Range(50, 50),
            flareRaysSizeRange = new PercentageRange(new PercentageLongestSide(0.7), new PercentageLongestSide(1)),
            flareRaysStroke = new Range(1, 1),
            flareRayThickness = new Range(1, 3),
            flareOffset = new PercentageRange(new PercentageShortestSide(0.01), new PercentageShortestSide(0.06)),

            accentRange = {bottom: {lower: 2, upper: 6}, top: {lower: 8, upper: 14}},
            blurRange = {bottom: {lower: 4, upper: 6}, top: {lower: 8, upper: 12}},
            featherTimes = {lower: 2, upper: 8},

            accentFindValueAlgorithm = [FindValueAlgorithm.TRIANGLE, FindValueAlgorithm.SMOOTHSTEP, FindValueAlgorithm.COSINE_BELL],
            blurFindValueAlgorithm = [FindValueAlgorithm.TRIANGLE, FindValueAlgorithm.SMOOTHSTEP, FindValueAlgorithm.COSINE_BELL],
            opacityFindValueAlgorithm = [FindValueAlgorithm.TRIANGLE, FindValueAlgorithm.SMOOTHSTEP, FindValueAlgorithm.COSINE_BELL],
        },
    ) {
        super();
        this.invertLayers = invertLayers;
        this.outerColor = outerColor;
        this.innerColor = innerColor;
        this.center = center;
        this.layerOpacity = layerOpacity;
        this.underLayerOpacityRange = underLayerOpacityRange;
        this.underLayerOpacityTimes = underLayerOpacityTimes;
        this.elementGastonMultiStep = elementGastonMultiStep;
        this.numberOfFlareRings = numberOfFlareRings;
        this.flareRingsSizeRange = flareRingsSizeRange;
        this.flareRingStroke = flareRingStroke;
        this.flareRingThickness = flareRingThickness;
        this.flareOffset = flareOffset;
        this.numberOfFlareRays = numberOfFlareRays;
        this.flareRaysSizeRange = flareRaysSizeRange;
        this.flareRaysStroke = flareRaysStroke;
        this.flareRayThickness = flareRayThickness;
        this.accentRange = accentRange;
        this.blurRange = blurRange;
        this.featherTimes = featherTimes;
        this.accentFindValueAlgorithm = accentFindValueAlgorithm;
        this.blurFindValueAlgorithm = blurFindValueAlgorithm;
        this.opacityFindValueAlgorithm = opacityFindValueAlgorithm;

    }
}
