import { Project } from './app/Project.js';
import { LayerConfig } from './core/layer/LayerConfig.js';
import { NeonColorScheme, NeonColorSchemeFactory } from './core/color/NeonColorSchemeFactory.js';
import { ColorPicker } from './core/layer/configType/ColorPicker.js';
import { RedEyeEffect } from './effects/primaryEffects/red-eye/RedEyeEffect.js';
import { Point2D } from './core/layer/configType/Point2D.js';
import { RedEyeConfig } from './effects/primaryEffects/red-eye/RedEyeConfig.js';
import { FuzzyBandEffect } from './effects/primaryEffects/fuzzyBands/FuzzyBandEffect.js';
import { FuzzyBandConfig } from './effects/primaryEffects/fuzzyBands/FuzzyBandConfig.js';
import { getRandomFromArray, getRandomIntInclusive } from './core/math/random.js';
import { FuzzyRipplesEffect } from './effects/primaryEffects/fuzzyRipples/FuzzyRipplesEffect.js';
import { FuzzyRipplesConfig } from './effects/primaryEffects/fuzzyRipples/FuzzyRipplesConfig.js';
import {ImageOverlayEffect} from "./effects/primaryEffects/imageOverlay/ImageOverlayEffect.js";
import {ImageOverlayConfig} from "./effects/primaryEffects/imageOverlay/ImageOverlayConfig.js";
import {LensFlareEffect} from "./effects/primaryEffects/lensFlare/LensFlareEffect.js";
import {LensFlareConfig} from "./effects/primaryEffects/lensFlare/LensFlareConfig.js";
import {DynamicRange} from "./core/layer/configType/DynamicRange.js";
import {Range} from "./core/layer/configType/Range.js";
import {PercentageRange} from "./core/layer/configType/PercentageRange.js";
import {PercentageShortestSide} from "./core/layer/configType/PercentageShortestSide.js";
import {PercentageLongestSide} from "./core/layer/configType/PercentageLongestSide.js";
import {ViewportEffect} from "./effects/primaryEffects/viewport/ViewportEffect.js";
import {ViewportConfig} from "./effects/primaryEffects/viewport/ViewportConfig.js";

const promiseArray = [];

const createRedEye = async (colorSheme) => {
    const myTestProject = new Project({
        artist: 'John Ruf',
        projectName: 'red-eye',
        projectDirectory: 'src/red-eye/',
        neutrals: ['#FFFFFF'],
        backgrounds: ['#000000'],
        numberOfFrame: 1800,
        colorScheme: colorSheme,
    });

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: FuzzyBandEffect,
            percentChance: 100,
            currentEffectConfig: new FuzzyBandConfig({

                layerOpacity: 0.4,
                underLayerOpacityRange: { bottom: { lower: 0.4, upper: 0.5 }, top: { lower: 0.6, upper: 0.7 } },
                underLayerOpacityTimes: { lower: 2, upper: 8 },
                color: new ColorPicker(),
                innerColor: new ColorPicker(ColorPicker.SelectionType.color, '#FFFFFF'),
                invertLayers: true,
                thickness: 1,
                stroke: 1,
                circles: { lower: 12, upper: 12 },
                radius: {
                    lower: (finalSize) => finalSize.shortestSide * 0.4,
                    upper: (finalSize) => finalSize.longestSide * 0.6,
                },
                accentRange: { bottom: { lower: 20, upper: 20 }, top: { lower: 30, upper: 30 } },
                blurRange: { bottom: { lower: 10, upper: 10 }, top: { lower: 20, upper: 20 } },
                featherTimes: { lower: 2, upper: 8 },
            }),
            defaultEffectConfig: FuzzyBandConfig,
        }),
    });

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: FuzzyRipplesEffect,
            percentChance: 100,
            currentEffectConfig: new FuzzyRipplesConfig({
                color: new ColorPicker(ColorPicker.SelectionType.neutralBucket),
                invertLayers: true,
                layerOpacity: 0.7,
                underLayerOpacity: 0.5,
                stroke: 1,
                thickness: 1,
                center: new Point2D(1080 / 2, 1920 / 2),
                speed: 1,
                largeRadius: {
                    lower: (finalSize) => finalSize.longestSide * 0.25,
                    upper: (finalSize) => finalSize.longestSide * 0.25,
                },
                smallRadius: {
                    lower: (finalSize) => finalSize.longestSide * 0.10,
                    upper: (finalSize) => finalSize.longestSide * 0.10,
                },
                largeNumberOfRings: { lower: 16, upper: 16 },
                smallNumberOfRings: { lower: 8, upper: 8 },
                ripple: {
                    lower: (finalSize) => finalSize.shortestSide * 0.05,
                    upper: (finalSize) => finalSize.shortestSide * 0.05,
                },
                times: { lower: 2, upper: 4 },
                smallerRingsGroupRadius: {
                    lower: (finalSize) => finalSize.shortestSide * 0.15,
                    upper: (finalSize) => finalSize.shortestSide * 0.15,
                },
                accentRange: { bottom: { lower: 4, upper: 4 }, top: { lower: 8, upper: 8 } },
                blurRange: { bottom: { lower: 3, upper: 3 }, top: { lower: 6, upper: 6 } },
                featherTimes: { lower: 2, upper: 8 },
            }),
        }),
    });

    let redEyeCount = getRandomFromArray([4]);

    for (let i = 0; i < redEyeCount; i++) {
        await myTestProject.addPrimaryEffect({
            layerConfig: new LayerConfig({
                effect: RedEyeEffect,
                percentChance: 100,
                currentEffectConfig: new RedEyeConfig({
                    invertLayers: true,
                    layerOpacity: 0.7,
                    underLayerOpacity: 0.5,
                    center: new Point2D(1080 / 2, 1920 / 2),
                    innerColor: new ColorPicker(ColorPicker.SelectionType.neutralBucket),
                    outerColor: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                    stroke: 1,
                    thickness: 1,
                    sparsityFactor: [9, 10, 12],
                    innerRadius: getRandomIntInclusive(myTestProject.shortestSideInPixels * 0.1, myTestProject.shortestSideInPixels * 0.20),
                    outerRadius: getRandomIntInclusive(myTestProject.shortestSideInPixels * 0.30, myTestProject.shortestSideInPixels * 0.40),
                    possibleJumpRangeInPixels: { lower: 5, upper: 15 },
                    lineLength: { lower: 75, upper: 150 },
                    numberOfLoops: { lower: 1, upper: 6 },
                    accentRange: { bottom: { lower: 4, upper: 4 }, top: { lower: 8, upper: 8 } },
                    blurRange: { bottom: { lower: 3, upper: 3 }, top: { lower: 6, upper: 6 } },
                    featherTimes: { lower: 2, upper: 8 },
                }),
            }),
        });
    }

    redEyeCount = getRandomFromArray([4]);

    for (let i = 0; i < redEyeCount; i++) {
        await myTestProject.addPrimaryEffect({
            layerConfig: new LayerConfig({
                effect: RedEyeEffect,
                percentChance: 100,
                currentEffectConfig: new RedEyeConfig({
                    invertLayers: true,
                    layerOpacity: 0.7,
                    underLayerOpacity: 0.5,
                    center: new Point2D(1080 / 2, 1920 / 2),
                    innerColor: new ColorPicker(ColorPicker.SelectionType.neutralBucket),
                    outerColor: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                    stroke: 1,
                    thickness: 1,
                    sparsityFactor: [9, 10, 12],
                    innerRadius: getRandomIntInclusive(myTestProject.shortestSideInPixels * 0.2, myTestProject.shortestSideInPixels * 0.30),
                    outerRadius: getRandomIntInclusive(myTestProject.shortestSideInPixels * 0.40, myTestProject.shortestSideInPixels * 0.50),
                    possibleJumpRangeInPixels: { lower: 5, upper: 15 },
                    lineLength: { lower: 75, upper: 150 },
                    numberOfLoops: { lower: 1, upper: 6 },
                    accentRange: { bottom: { lower: 4, upper: 4 }, top: { lower: 8, upper: 8 } },
                    blurRange: { bottom: { lower: 3, upper: 3 }, top: { lower: 6, upper: 6 } },
                    featherTimes: { lower: 2, upper: 8 },
                }),
            }),
        });
    }

    redEyeCount = getRandomFromArray([4]);

    for (let i = 0; i < redEyeCount; i++) {
        await myTestProject.addPrimaryEffect({
            layerConfig: new LayerConfig({
                effect: RedEyeEffect,
                percentChance: 100,
                currentEffectConfig: new RedEyeConfig({
                    invertLayers: true,
                    layerOpacity: 0.7,
                    underLayerOpacity: 0.5,
                    center: new Point2D(1080 / 2, 1920 / 2),
                    innerColor: new ColorPicker(ColorPicker.SelectionType.neutralBucket),
                    outerColor: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                    stroke: 1,
                    thickness: 1,
                    sparsityFactor: [8, 9, 10],
                    innerRadius: getRandomIntInclusive(myTestProject.shortestSideInPixels * 0.30, myTestProject.shortestSideInPixels * 0.40),
                    outerRadius: getRandomIntInclusive(myTestProject.shortestSideInPixels * 0.50, myTestProject.shortestSideInPixels * 0.60),
                    possibleJumpRangeInPixels: { lower: 10, upper: 30 },
                    lineLength: { lower: 100, upper: 175 },
                    numberOfLoops: { lower: 1, upper: 6 },
                    accentRange: { bottom: { lower: 4, upper: 4 }, top: { lower: 8, upper: 8 } },
                    blurRange: { bottom: { lower: 3, upper: 3 }, top: { lower: 6, upper: 6 } },
                    featherTimes: { lower: 2, upper: 8 },
                }),
            }),
        });
    }

    redEyeCount = getRandomFromArray([4]);

    for (let i = 0; i < redEyeCount; i++) {
        await myTestProject.addPrimaryEffect({
            layerConfig: new LayerConfig({
                effect: RedEyeEffect,
                percentChance: 100,
                currentEffectConfig: new RedEyeConfig({
                    invertLayers: true,
                    layerOpacity: 0.7,
                    underLayerOpacity: 0.5,
                    center: new Point2D(1080 / 2, 1920 / 2),
                    innerColor: new ColorPicker(ColorPicker.SelectionType.neutralBucket),
                    outerColor: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                    stroke: 1,
                    thickness: 1,
                    sparsityFactor: [6, 8, 9],
                    innerRadius: getRandomIntInclusive(myTestProject.shortestSideInPixels * 0.40, myTestProject.shortestSideInPixels * 0.50),
                    outerRadius: getRandomIntInclusive(myTestProject.shortestSideInPixels * 0.60, myTestProject.shortestSideInPixels * 0.70),
                    possibleJumpRangeInPixels: { lower: 10, upper: 30 },
                    lineLength: { lower: 125, upper: 175 },
                    numberOfLoops: { lower: 1, upper: 6 },
                    accentRange: { bottom: { lower: 4, upper: 4 }, top: { lower: 8, upper: 8 } },
                    blurRange: { bottom: { lower: 3, upper: 3 }, top: { lower: 6, upper: 6 } },
                    featherTimes: { lower: 2, upper: 8 },
                }),
            }),
        });
    }

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: LensFlareEffect,
            percentChance: 100,
            currentEffectConfig: new LensFlareConfig({
                layerOpacityRange: new DynamicRange(new Range(0.7, 0.7), new Range(0.7, 0.7)),
                layerOpacityTimes: new Range(2, 6),

                elementOpacityRange: new DynamicRange(new Range(0.4, 0.5), new Range(0.5, 0.6)),
                elementOpacityTimes: new Range(2, 6),

                elementGastonRange: new DynamicRange(new Range(5, 10), new Range(15, 30)),
                elementGastonTimes: new Range(2, 6),

                numberOfFlareHex: new Range(0, 0),
                flareHexSizeRange: new PercentageRange(new PercentageShortestSide(0.015), new PercentageShortestSide(0.025)),

                angleRangeFlareHex: new DynamicRange(new Range(1, 2), new Range(4, 6)),
                angleGastonTimes: new Range(1, 6),

                numberOfFlareRings: new Range(15, 15),
                flareRingsSizeRange: new PercentageRange(new PercentageShortestSide(0.25), new PercentageLongestSide(0.75)),
                flareRingStroke: new Range(1, 1),

                numberOfFlareRays: new Range(50, 50),
                flareRaysSizeRange: new PercentageRange(new PercentageLongestSide(0.5), new PercentageLongestSide(0.95)),
                flareRaysStroke: new Range(1, 1),

                blurRange: new DynamicRange(new Range(0, 0), new Range(0, 0)),
                blurTimes: new Range(0, 0),

                strategy: ['color-bucket'],
            }),
        }),
    });

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: ViewportEffect,
            percentChance: 100,
            currentEffectConfig: new ViewportConfig({
                invertLayers: false,
                layerOpacity: 1,
                underLayerOpacity: 0.5,
                stroke: 5,
                thickness: 10,
                ampStroke: 0,
                ampThickness: 1,
                radius: [400],
                startAngle: [270],
                amplitude: { lower: 150, upper: 150 },
                times: { lower: 3, upper: 3 },
                accentRange: { bottom: { lower: 0, upper: 0 }, top: { lower: 20, upper: 30 } },
                blurRange: { bottom: { lower: 2, upper: 3 }, top: { lower: 5, upper: 8 } },
                featherTimes: { lower: 3, upper: 3 },
            }),
        }),
    });

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: ImageOverlayEffect,
            percentChance: 100,
            currentEffectConfig: new ImageOverlayConfig({
                folderName: '/image-store/generated/eyes/',
                layerOpacity: [1],
                buffer: [0],
            }),
        }),
    });




    promiseArray.push(myTestProject.generateRandomLoop());
};

await createRedEye(NeonColorSchemeFactory.getColorScheme(NeonColorScheme.neons));

await Promise.all(promiseArray);
