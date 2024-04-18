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

    redEyeCount = getRandomFromArray([6]);

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

    redEyeCount = getRandomFromArray([8]);

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

    promiseArray.push(myTestProject.generateRandomLoop());
};

await createRedEye(NeonColorSchemeFactory.getColorScheme(NeonColorScheme.greenNeons));
await createRedEye(NeonColorSchemeFactory.getColorScheme(NeonColorScheme.neons));
await createRedEye(NeonColorSchemeFactory.getColorScheme(NeonColorScheme.primaryNeons));

await Promise.all(promiseArray);
