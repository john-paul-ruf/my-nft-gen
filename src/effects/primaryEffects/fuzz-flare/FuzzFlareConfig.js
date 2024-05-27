import {EffectConfig} from '../../../core/layer/EffectConfig.js';
import {PercentageRange} from '../../../core/layer/configType/PercentageRange.js';
import {PercentageShortestSide} from '../../../core/layer/configType/PercentageShortestSide.js';
import {PercentageLongestSide} from '../../../core/layer/configType/PercentageLongestSide.js';
import {Range} from '../../../core/layer/configType/Range.js';
import {ColorPicker} from '../../../core/layer/configType/ColorPicker.js';
import {DynamicRange} from "../../../core/layer/configType/DynamicRange.js";
import {MultiStepDefinitionConfig} from "../../../core/math/MultiStepDefinitionConfig.js";

export class FuzzFlareConfig extends EffectConfig {
    constructor(
        {
            invertLayers = false,

            outerColor = new ColorPicker(ColorPicker.SelectionType.colorBucket),
            innerColor = new ColorPicker(ColorPicker.SelectionType.colorBucket),

            layerOpacity = 0.7,

            underLayerOpacityRange = {bottom: {lower: 0.35, upper: 0.4}, top: {lower: 0.5, upper: 0.55}},
            underLayerOpacityTimes = {lower: 2, upper: 8},

            elementGastonMultiStep = [
                new MultiStepDefinitionConfig({
                    minPercentage: 0,
                    maxPercentage: 25,
                    min: new Range(5, 10),
                    max: new Range(15, 25),
                    times: new Range(1, 2),
                    invert: false,
                }),
                new MultiStepDefinitionConfig({
                    minPercentage: 25,
                    maxPercentage: 75,
                    min: new Range(2, 4),
                    max: new Range(8, 12),
                    times: new Range(1, 4),
                    invert: false,
                }),
                new MultiStepDefinitionConfig({
                    minPercentage: 75,
                    maxPercentage: 100,
                    min: new Range(2, 10),
                    max: new Range(15, 20),
                    times: new Range(1, 3),
                    invert: false,
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
        },
    ) {
        super();
        this.invertLayers = invertLayers;
        this.outerColor = outerColor;
        this.innerColor = innerColor;
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
    }
}
