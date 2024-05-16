import {Project} from './app/Project.js';
import {LayerConfig} from './core/layer/LayerConfig.js';
import {NeonColorScheme, NeonColorSchemeFactory} from './core/color/NeonColorSchemeFactory.js';
import {ColorPicker} from './core/layer/configType/ColorPicker.js';
import {RedEyeEffect} from './effects/primaryEffects/red-eye/RedEyeEffect.js';
import {Point2D} from './core/layer/configType/Point2D.js';
import {RedEyeConfig} from './effects/primaryEffects/red-eye/RedEyeConfig.js';
import {FuzzyBandEffect} from './effects/primaryEffects/fuzzyBands/FuzzyBandEffect.js';
import {FuzzyBandConfig} from './effects/primaryEffects/fuzzyBands/FuzzyBandConfig.js';
import {getRandomFromArray, getRandomIntInclusive} from './core/math/random.js';
import {FuzzyRipplesEffect} from './effects/primaryEffects/fuzzyRipples/FuzzyRipplesEffect.js';
import {FuzzyRipplesConfig} from './effects/primaryEffects/fuzzyRipples/FuzzyRipplesConfig.js';
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
import {MappedFramesEffect} from "./effects/primaryEffects/mappedFrames/MappedFramesEffect.js";
import {MappedFramesConfig} from "./effects/primaryEffects/mappedFrames/MappedFramesConfig.js";
import {ScopesEffect} from "./effects/primaryEffects/scopes/ScopesEffect.js";
import {ScopesConfig} from "./effects/primaryEffects/scopes/ScopesConfig.js";
import {Color} from "three";
import {EncircledSpiralEffect} from "./effects/primaryEffects/encircledSpiral/EncircledSpiralEffect.js";
import {EncircledSpiralConfig} from "./effects/primaryEffects/encircledSpiral/EncircledSpiralConfig.js";
import {AmpEffect} from "./effects/primaryEffects/amp/AmpEffect.js";
import {AmpConfig} from "./effects/primaryEffects/amp/AmpConfig.js";

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
            effect: AmpEffect,
            percentChance: 100,
            currentEffectConfig: new AmpConfig({
                invertLayers: true,
                layerOpacity: 0.4,
                underLayerOpacity: 0.25,
                sparsityFactor: [3],
                stroke: 1,
                thickness: 1,
                accentRange: {bottom: {lower: 4, upper: 4}, top: {lower: 8, upper: 8}},
                blurRange: {bottom: {lower: 3, upper: 3}, top: {lower: 6, upper: 6}},
                featherTimes: {lower: 3, upper: 3},
                speed: {lower: 24, upper: 24},
                length: 100,
                lineStart: 150,
                center: {x: 1080 / 2, y: 1920 / 2},
            }),
            defaultEffectConfig: AmpConfig,
        }),
    });

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: AmpEffect,
            percentChance: 100,
            currentEffectConfig: new AmpConfig({
                invertLayers: true,
                layerOpacity: 0.4,
                underLayerOpacity: 0.25,
                sparsityFactor: [3],
                stroke: 1,
                thickness: 1,
                accentRange: {bottom: {lower: 4, upper: 4}, top: {lower: 8, upper: 8}},
                blurRange: {bottom: {lower: 3, upper: 3}, top: {lower: 6, upper: 6}},
                featherTimes: {lower: 3, upper: 3},
                speed: {lower: 24, upper: 24},
                length: 200,
                lineStart: 300,
                center: {x: 1080 / 2, y: 1920 / 2},
            }),
            defaultEffectConfig: AmpConfig,
        }),
    });

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: AmpEffect,
            percentChance: 100,
            currentEffectConfig: new AmpConfig({
                invertLayers: true,
                layerOpacity: 0.4,
                underLayerOpacity: 0.25,
                sparsityFactor: [1],
                stroke: 1,
                thickness: 1,
                accentRange: {bottom: {lower: 4, upper: 4}, top: {lower: 8, upper: 8}},
                blurRange: {bottom: {lower: 3, upper: 3}, top: {lower: 6, upper: 6}},
                featherTimes: {lower: 3, upper: 3},
                speed: {lower: 48, upper: 48},
                length: 333,
                lineStart: 700,
                center: {x: 1080 / 2, y: 1920 / 2},
            }),
            defaultEffectConfig: AmpConfig,
        }),
    });

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: ScopesEffect,
            percentChance: 100,
            currentEffectConfig: new ScopesConfig({
                layerOpacity: 1,
                sparsityFactor: [3],
                gapFactor: {lower: 0.1, upper: 0.1},
                radiusFactor: {lower: 0.1, upper: 0.1},
                scaleFactor: 1.2,
                alphaRange: {bottom: {lower: 0.5, upper: 0.5}, top: {lower: 0.6, upper: 0.6}},
                alphaTimes: {lower: 3, upper: 3},
                rotationTimes: {lower: 3, upper: 3},
                numberOfScopesInALine: 60,
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
                    possibleJumpRangeInPixels: {lower: 5, upper: 15},
                    lineLength: {lower: 75, upper: 150},
                    numberOfLoops: {lower: 1, upper: 3},
                    accentRange: {bottom: {lower: 4, upper: 4}, top: {lower: 8, upper: 8}},
                    blurRange: {bottom: {lower: 3, upper: 3}, top: {lower: 6, upper: 6}},
                    featherTimes: {lower: 3, upper: 3},
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
                    possibleJumpRangeInPixels: {lower: 5, upper: 15},
                    lineLength: {lower: 75, upper: 150},
                    numberOfLoops: {lower: 1, upper: 3},
                    accentRange: {bottom: {lower: 4, upper: 4}, top: {lower: 8, upper: 8}},
                    blurRange: {bottom: {lower: 3, upper: 3}, top: {lower: 6, upper: 6}},
                    featherTimes: {lower: 3, upper: 3},
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
                    possibleJumpRangeInPixels: {lower: 10, upper: 30},
                    lineLength: {lower: 100, upper: 175},
                    numberOfLoops: {lower: 1, upper: 3},
                    accentRange: {bottom: {lower: 4, upper: 4}, top: {lower: 8, upper: 8}},
                    blurRange: {bottom: {lower: 3, upper: 3}, top: {lower: 6, upper: 6}},
                    featherTimes: {lower: 3, upper: 3},
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
                    possibleJumpRangeInPixels: {lower: 10, upper: 30},
                    lineLength: {lower: 125, upper: 175},
                    numberOfLoops: {lower: 1, upper: 3},
                    accentRange: {bottom: {lower: 4, upper: 4}, top: {lower: 8, upper: 8}},
                    blurRange: {bottom: {lower: 3, upper: 3}, top: {lower: 6, upper: 6}},
                    featherTimes: {lower: 3, upper: 3},
                }),
            }),
        });
    }

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: ViewportEffect,
            percentChance: 100,
            currentEffectConfig: new ViewportConfig({
                invertLayers: true,
                layerOpacity: 0.7,
                underLayerOpacity: 0.5,
                color: new ColorPicker(ColorPicker.SelectionType.color, '#FF00FF'),
                stroke: 4,
                thickness: 15,
                ampStroke: 0,
                ampThickness: 1,
                radius: [300],
                startAngle: [270],
                amplitude: {lower: 75, upper: 75},
                times: {lower: 3, upper: 3},
                accentRange: {bottom: {lower: 10, upper: 10}, top: {lower: 40, upper: 40}},
                blurRange: {bottom: {lower: 3, upper: 3}, top: {lower: 8, upper: 8}},
                featherTimes: {lower: 3, upper: 3},
            }),
        }),
    });

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: LensFlareEffect,
            percentChance: 100,
            currentEffectConfig: new LensFlareConfig({
                layerOpacityRange: new DynamicRange(new Range(0.4, 0.4), new Range(0.4, 0.4)),
                layerOpacityTimes: new Range(2, 6),

                elementOpacityRange: new DynamicRange(new Range(0.4, 0.5), new Range(0.5, 0.6)),
                elementOpacityTimes: new Range(2, 6),

                elementGastonRange: new DynamicRange(new Range(5, 10), new Range(15, 30)),
                elementGastonTimes: new Range(2, 6),

                numberOfFlareHex: new Range(8, 8),
                flareHexSizeRange: new PercentageRange(new PercentageShortestSide(0.01), new PercentageShortestSide(0.05)),
                flareHexOffsetRange: new PercentageRange(new PercentageShortestSide(0.01), new PercentageShortestSide(0.25)),

                angleRangeFlareHex: new DynamicRange(new Range(1, 1), new Range(4, 4)),
                angleGastonTimes: new Range(1, 6),

                numberOfFlareRings: new Range(100, 100),
                flareRingsSizeRange: new PercentageRange(new PercentageShortestSide(0.20), new PercentageLongestSide(0.80)),
                flareRingStroke: new Range(4, 4),

                numberOfFlareRays: new Range(250, 250),
                flareRaysSizeRange: new PercentageRange(new PercentageLongestSide(0.5), new PercentageLongestSide(0.95)),
                flareRaysStroke: new Range(3, 3),

                blurRange: new DynamicRange(new Range(0, 0), new Range(0, 0)),
                blurTimes: new Range(0, 0),

                strategy: ['color-bucket'],
            }),
        }),
    });

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: MappedFramesEffect,
            percentChance: 100,
            currentEffectConfig: new MappedFramesConfig({
                folderName: '/mappedFrames/',
                layerOpacity: [0.9],
                buffer: [555],
                loopTimes: 30,
            }),
        }),
    });

    promiseArray.push(myTestProject.generateRandomLoop());
};

await createRedEye(NeonColorSchemeFactory.getColorScheme(NeonColorScheme.blueNeons));

await Promise.all(promiseArray);
