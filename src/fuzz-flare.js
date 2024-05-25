import {Project} from './app/Project.js';
import {LayerConfig} from './core/layer/LayerConfig.js';
import {NeonColorScheme, NeonColorSchemeFactory} from './core/color/NeonColorSchemeFactory.js';
import {ColorPicker} from './core/layer/configType/ColorPicker.js';
import {Range} from "./core/layer/configType/Range.js";
import {PercentageRange} from "./core/layer/configType/PercentageRange.js";
import {PercentageShortestSide} from "./core/layer/configType/PercentageShortestSide.js";
import {PercentageLongestSide} from "./core/layer/configType/PercentageLongestSide.js";
import {FuzzFlareEffect} from "./effects/primaryEffects/fuzz-flare/FuzzFlareEffect.js";
import {FuzzFlareConfig} from "./effects/primaryEffects/fuzz-flare/FuzzFlareConfig.js";
import {Color} from "three";

const promiseArray = [];

const createRedEye = async (colorSheme) => {
    const myTestProject = new Project({
        artist: 'John Ruf',
        projectName: 'fuzz-flare',
        projectDirectory: 'src/fuzz-flare/',
        neutrals: ['#FFFFFF'],
        backgrounds: ['#000000'],
        numberOfFrame: 1800,
        colorScheme: colorSheme,
    });

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: FuzzFlareEffect,
            percentChance: 100,
            currentEffectConfig: new FuzzFlareConfig({
                invertLayers: true,

                outerColor: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                innerColor: new ColorPicker(ColorPicker.SelectionType.neutralBucket),

                layerOpacity: 0.7,

                underLayerOpacityRange: {bottom: {lower: 0.35, upper: 0.4}, top: {lower: 0.5, upper: 0.55}},
                underLayerOpacityTimes: {lower: 2, upper: 6},

                angleGastonTimes: new Range(1, 6),

                numberOfFlareRings: new Range(75, 75),
                flareRingsSizeRange: new PercentageRange(new PercentageShortestSide(0.05), new PercentageLongestSide(1)),
                flareRingStroke: new Range(1, 1),

                numberOfFlareRays: new Range(75, 75),
                flareRaysSizeRange: new PercentageRange(new PercentageLongestSide(0.65), new PercentageLongestSide(1)),
                flareRaysStroke: new Range(1, 1),
                flareOffset: new PercentageRange(new PercentageShortestSide(0.01), new PercentageShortestSide(0.05)),

                accentRange: {bottom: {lower: 4, upper: 4}, top: {lower: 12, upper: 12}},
                blurRange: {bottom: {lower: 3, upper: 3}, top: {lower: 6, upper: 6}},
                featherTimes: {lower: 3, upper: 3},
            }),
        }),
    });

    promiseArray.push(myTestProject.generateRandomLoop());
};

await createRedEye(NeonColorSchemeFactory.getColorScheme(NeonColorScheme.neons));

await Promise.all(promiseArray);
