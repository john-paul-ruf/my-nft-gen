import {EffectConfig} from 'my-nft-gen/src/core/layer/EffectConfig.js';
import {PercentageRange} from 'my-nft-gen/src/core/layer/configType/PercentageRange.js';
import {PercentageShortestSide} from 'my-nft-gen/src/core/layer/configType/PercentageShortestSide.js';
import {PercentageLongestSide} from 'my-nft-gen/src/core/layer/configType/PercentageLongestSide.js';
import {Range} from 'my-nft-gen/src/core/layer/configType/Range.js';
import {ColorPicker} from 'my-nft-gen/src/core/layer/configType/ColorPicker.js';
import {DynamicRange} from "my-nft-gen/src/core/layer/configType/DynamicRange.js";
import {MultiStepDefinitionConfig} from "my-nft-gen/src/core/math/MultiStepDefinitionConfig.js";
import {Position} from "my-nft-gen/src/core/position/Position.js";
import {FindValueAlgorithm, getAllFindValueAlgorithms} from "my-nft-gen/src/core/math/findValue.js";

/** *
 *
 * Config for Fuzz Flare Effect
 * Creates a lens flare with the ability to add fuzz
 *
 * @invertLayers - False: fuzzy layer composites on the bottom, True: fuzzy layer composites over the top
 * @innerColor - ColorPicker: the color for the thickness
 * @outerColor - ColorPicker: the color for the stroke and accent
 * @layerOpacity - the opacity of the top, non-fuzzy, layer
 * @center - Position: Where the center is in the overall composition
 * @underLayerOpacityRange - DynamicRange: the opacity of the bottom, fuzzy, layer
 * @underLayerOpacityTimes - Range: the number of times to move through the underlay opacity range over the number of frames
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
 * @accentRange - DynamicRange: the weight to oscillate the fuzzy layer over the total frames by the number of feather times
 * @blurRange - DynamicRange: the amount of blur to apply to the fuzzy layer over the total frames by the number of feather times
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

            center = new Position({x: 1080 / 2, y: 1920 / 2}),

            underLayerOpacityRange = new DynamicRange(new Range(0.35, 0.4), new Range(0.5, 0.55)),
            underLayerOpacityTimes = new Range(2, 8),

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

            accentRange = new DynamicRange(new Range(2, 6), new Range(8, 14)),
            blurRange = new DynamicRange(new Range(4, 6), new Range(8, 12)),
            featherTimes = new Range(2, 8),

            accentFindValueAlgorithm = getAllFindValueAlgorithms(),
            blurFindValueAlgorithm = getAllFindValueAlgorithms(),
            opacityFindValueAlgorithm = getAllFindValueAlgorithms(),
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
