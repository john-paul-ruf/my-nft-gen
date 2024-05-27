import {Project} from './app/Project.js';
import {LayerConfig} from './core/layer/LayerConfig.js';
import {ColorPicker} from './core/layer/configType/ColorPicker.js';
import {Range} from "./core/layer/configType/Range.js";
import {PercentageRange} from "./core/layer/configType/PercentageRange.js";
import {PercentageShortestSide} from "./core/layer/configType/PercentageShortestSide.js";
import {PercentageLongestSide} from "./core/layer/configType/PercentageLongestSide.js";
import {FuzzFlareEffect} from "./effects/primaryEffects/fuzz-flare/FuzzFlareEffect.js";
import {FuzzFlareConfig} from "./effects/primaryEffects/fuzz-flare/FuzzFlareConfig.js";
import {ColorScheme} from "./core/color/ColorScheme.js";
import {MultiStepDefinitionConfig} from "./core/math/MultiStepDefinitionConfig.js";
import {LayeredHexEffect} from "./effects/primaryEffects/layeredHex/LayeredHexEffect.js";
import {LayeredHexConfig} from "./effects/primaryEffects/layeredHex/LayeredHexConfig.js";

const promiseArray = [];

const createComposition = async (colorScheme) => {
    const myTestProject = new Project({
        artist: 'John Ruf',
        projectName: 'quick-test',
        projectDirectory: 'output/test-run',
        neutrals: ['#FFFFFF'],
        backgrounds: ['#000000'],
        numberOfFrame: 1800,
        colorScheme: colorScheme,
        longestSideInPixels: 640,
        shortestSideInPixels: 480
    });

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: LayeredHexEffect,
            percentChance: 100,
            currentEffectConfig: new LayeredHexConfig({
                invertLayers: true,

                thickness: 1,
                stroke: 1,

                layerOpacityRange: {bottom: {lower: 0.5, upper: 0.5}, top: {lower: 0.5, upper: 0.5}},
                layerOpacityTimes: {lower: 2, upper: 4},

                indexOpacityRange: {bottom: {lower: 0.3, upper: 0.5}, top: {lower: 0.6, upper: 0.7}},
                indexOpacityTimes: {lower: 2, upper: 4},

                radius: {lower: 5, upper: 10},
                offsetRadius: {lower: 15, upper: 20},

                numberOfIndex: {lower: 20, upper: 30},
                startIndex: {lower: 5, upper: 5},

                startAngle: 15,

                movementGaston: {lower: 1, upper: 6},

                initialNumberOfPoints: 8,
                scaleByFactor: 1.1,

                accentRange: {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 6}},
                blurRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
                featherTimes: {lower: 2, upper: 4},
            }),
        })
    });

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: FuzzFlareEffect,
            percentChance: 100,
            currentEffectConfig: new FuzzFlareConfig({
                invertLayers: false,

                outerColor: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                innerColor: new ColorPicker(ColorPicker.SelectionType.colorBucket),

                layerOpacity: 0.7,

                underLayerOpacityRange: {bottom: {lower: 0.35, upper: 0.4}, top: {lower: 0.5, upper: 0.55}},
                underLayerOpacityTimes: {lower: 2, upper: 8},

                elementGastonMultiStep: [
                    new MultiStepDefinitionConfig({
                        percentage: 25,
                        min: new Range(5, 10),
                        max: new Range(15, 25),
                        times: new Range(1, 2),
                        invert: false
                    }),
                    new MultiStepDefinitionConfig({
                        percentage: 50,
                        min: new Range(2, 4),
                        max: new Range(6, 8),
                        times: new Range(1, 4),
                        invert: false
                    }),
                    new MultiStepDefinitionConfig({
                        percentage: 25,
                        min: new Range(2, 10),
                        max: new Range(15, 20),
                        times: new Range(1, 3),
                        invert: false
                    })
                ],

                numberOfFlareRings: new Range(5, 5),
                flareRingsSizeRange: new PercentageRange(new PercentageShortestSide(0.05), new PercentageLongestSide(1)),
                flareRingStroke: new Range(1, 1),
                flareRingThickness: new Range(1, 3),

                numberOfFlareRays: new Range(10, 10),
                flareRaysSizeRange: new PercentageRange(new PercentageLongestSide(0.7), new PercentageLongestSide(1)),
                flareRaysStroke: new Range(1, 1),
                flareRayThickness: new Range(1, 3),
                flareOffset: new PercentageRange(new PercentageShortestSide(0.01), new PercentageShortestSide(0.06)),

                accentRange: {bottom: {lower: 2, upper: 6}, top: {lower: 8, upper: 14}},
                blurRange: {bottom: {lower: 4, upper: 6}, top: {lower: 8, upper: 12}},
                featherTimes: {lower: 2, upper: 8},
            }),
        }),
    });

    promiseArray.push(myTestProject.generateRandomLoop());
};

const colors = new ColorScheme({
    colorBucket: [
        '#ffd439',
        '#fa448c',
        '#faa405',
        '#f72215',
        '#a0c409',
        '#1cb0d4'
    ],
    colorSchemeInfo: "**Color Strategy**: bright & feisty\n"
});

await createComposition(colors);

await Promise.all(promiseArray);
