import {EffectConfig} from '../../../core/layer/EffectConfig.js';
import {PercentageRange} from '../../../core/layer/configType/PercentageRange.js';
import {PercentageShortestSide} from '../../../core/layer/configType/PercentageShortestSide.js';
import {PercentageLongestSide} from '../../../core/layer/configType/PercentageLongestSide.js';
import {Range} from '../../../core/layer/configType/Range.js';
import {ColorPicker} from '../../../core/layer/configType/ColorPicker.js';
import {DynamicRange} from "../../../core/layer/configType/DynamicRange.js";

export class FuzzFlareConfig extends EffectConfig {
    constructor(
        {
            invertLayers = true,

            outerColor = new ColorPicker(),
            innerColor = new ColorPicker(),

            layerOpacity = 1,

            underLayerOpacityRange = { bottom: { lower: 0.7, upper: 0.8 }, top: { lower: 0.9, upper: 0.95 } },
            underLayerOpacityTimes = { lower: 2, upper: 6 },

            elementGastonRange = new DynamicRange(new Range(5, 10), new Range(15, 30)),
            elementGastonTimes = new Range(2, 6),

            angleGastonTimes = new Range(1, 6),

            numberOfFlareRings = new Range(10, 20),
            flareRingsSizeRange = new PercentageRange(new PercentageShortestSide(0.25), new PercentageLongestSide(0.75)),
            flareRingStroke = new Range(1, 1),
            flareRingThickness= new Range(1, 1),

            numberOfFlareRays = new Range(20, 30),
            flareRaysSizeRange = new PercentageRange(new PercentageLongestSide(0.4), new PercentageLongestSide(1)),
            flareRaysStroke = new Range(1, 1),
            flareRayThickness= new Range(1, 1),
            flareOffset = new PercentageRange(new PercentageShortestSide(0.01), new PercentageShortestSide(0.15)),

            accentRange = { bottom: { lower: 6, upper: 12 }, top: { lower: 25, upper: 45 } },
            blurRange = { bottom: { lower: 1, upper: 3 }, top: { lower: 8, upper: 12 } },
            featherTimes = { lower: 2, upper: 6 },
        },
    ) {
        super();
        this.invertLayers = invertLayers;
        this.outerColor = outerColor;
        this.innerColor = innerColor;
        this.layerOpacity = layerOpacity;
        this.underLayerOpacityRange = underLayerOpacityRange;
        this.underLayerOpacityTimes = underLayerOpacityTimes;
        this.elementGastonRange = elementGastonRange;
        this.elementGastonTimes = elementGastonTimes;
        this.angleGastonTimes = angleGastonTimes;
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
    }
}
