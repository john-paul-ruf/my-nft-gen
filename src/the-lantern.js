import {Project} from "./app/Project.js";
import {NeonColorScheme, NeonColorSchemeFactory} from "./core/color/NeonColorSchemeFactory.js";
import {LayerConfig} from "./core/layer/LayerConfig.js";
import {FuzzyBandEffect} from "./effects/primaryEffects/fuzzyBands/FuzzyBandEffect.js";
import {FuzzyBandConfig} from "./effects/primaryEffects/fuzzyBands/FuzzyBandConfig.js";
import {ColorPicker} from "./core/layer/configType/ColorPicker.js";
import {EncircledSpiralEffect} from "./effects/primaryEffects/encircledSpiral/EncircledSpiralEffect.js";
import {EncircledSpiralConfig} from "./effects/primaryEffects/encircledSpiral/EncircledSpiralConfig.js";
import {Point2D} from "./core/layer/configType/Point2D.js";
import {LayeredHexEffect} from "./effects/primaryEffects/layeredHex/LayeredHexEffect.js";
import {LayeredHexConfig} from "./effects/primaryEffects/layeredHex/LayeredHexConfig.js";
import {Range} from "./core/layer/configType/Range.js";
import {AmpEffect} from "./effects/primaryEffects/amp/AmpEffect.js";
import {AmpConfig} from "./effects/primaryEffects/amp/AmpConfig.js";
import {GlowEffect} from "./effects/secondaryEffects/glow/GlowEffect.js";
import {GlowConfig} from "./effects/secondaryEffects/glow/GlowConfig.js";
import {MappedFramesEffect} from "./effects/primaryEffects/mappedFrames/MappedFramesEffect.js";
import {MappedFramesConfig} from "./effects/primaryEffects/mappedFrames/MappedFramesConfig.js";
import {LensFlareEffect} from "./effects/primaryEffects/lensFlare/LensFlareEffect.js";
import {LensFlareConfig} from "./effects/primaryEffects/lensFlare/LensFlareConfig.js";
import {DynamicRange} from "./core/layer/configType/DynamicRange.js";
import {PercentageRange} from "./core/layer/configType/PercentageRange.js";
import {PercentageShortestSide} from "./core/layer/configType/PercentageShortestSide.js";
import {PercentageLongestSide} from "./core/layer/configType/PercentageLongestSide.js";

const promiseArray = [];

async function addSpiral(myTestProject, color, point, speed) {
    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: EncircledSpiralEffect, percentChance: 100, currentEffectConfig: new EncircledSpiralConfig({
                outerColor: color,
                innerColor: new ColorPicker(ColorPicker.SelectionType.color, '#FFFFFF'),
                invertLayers: true,
                layerOpacity: 0.5,
                underLayerOpacity: 0.4,
                startAngle: {lower: 0, upper: 360},
                numberOfRings: new Range(6, 6),
                stroke: 1,
                thickness: 1,
                sparsityFactor: [30],
                sequencePixelConstant: {
                    lower: (finalSize) => finalSize.shortestSide * 0.001,
                    upper: (finalSize) => finalSize.shortestSide * 0.001
                },
                sequence: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181],
                minSequenceIndex: [9],
                numberOfSequenceElements: [3],
                speed: speed,
                accentRange: {bottom: {lower: 0, upper: 0}, top: {lower: 0, upper: 0}},
                blurRange: {bottom: {lower: 0, upper: 0}, top: {lower: 0, upper: 0}},
                featherTimes: {lower: 0, upper: 0}, //center
                center: point,
            }), defaultEffectConfig: EncircledSpiralConfig, possibleSecondaryEffects: [
                /*new LayerConfig({
                    effect: GlowEffect,
                    percentChance: 100,
                    currentEffectConfig: new GlowConfig({
                        lowerRange: {lower: -32, upper: -32},
                        upperRange: {lower: 32, upper: 32},
                        times: {lower: 1, upper: 1},
                    }),
                })*/
            ]
        })
    })
    ;
}

const createLantern = async (crossColor, squareColor, outlierColor, ringColor, heartColor,  colorScheme) => {

    const myTestProject = new Project({
        artist: 'John Ruf',
        projectName: 'the-lantern',
        projectDirectory: "src/the-lantern/",
        neutrals: ['#FFFFFF'],
        backgrounds: ['#000000']
    });

    const length = 1080 / 7;
    myTestProject.colorScheme = colorScheme;

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: FuzzyBandEffect, percentChance: 100, currentEffectConfig: new FuzzyBandConfig({
                layerOpacity: 0.70,
                underLayerOpacityRange: {bottom: {lower: 0.4, upper: 0.5}, top: {lower: 0.6, upper: 0.7}},
                underLayerOpacityTimes: {lower: 2, upper: 8},
                color: new ColorPicker(),
                innerColor: new ColorPicker(ColorPicker.SelectionType.color, '#FFFFFF'),
                invertLayers: true,
                thickness: 1,
                stroke: 1,
                circles: {lower: 8, upper: 8},
                radius: {
                    lower: (finalSize) => finalSize.shortestSide * 0.5,
                    upper: (finalSize) => finalSize.longestSide * 0.5
                },
                accentRange: {bottom: {lower: 2, upper: 6}, top: {lower: 8, upper: 14}},
                blurRange: {bottom: {lower: 4, upper: 6}, top: {lower: 8, upper: 12}},
                featherTimes: {lower: 2, upper: 8},
            }), defaultEffectConfig: FuzzyBandConfig
        })
    });

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: LayeredHexEffect, percentChance: 100, currentEffectConfig: new LayeredHexConfig({
                layerOpacityRange: {bottom: {lower: 0.3, upper: 0.4}, top: {lower: 0.5, upper: 0.6}},
                layerOpacityTimes: {lower: 4, upper: 8},
                indexOpacityRange: {bottom: {lower: 0.3, upper: 0.4}, top: {lower: 0.5, upper: 0.6}},
                indexOpacityTimes: {lower: 4, upper: 8},
                thickness: 2,
                stroke: 1,
                layerOpacity: 0.75,
                radius: {lower: 30, upper: 60},
                offsetRadius: {lower: 45, upper: 65},
                numberOfIndex: {lower: 12, upper: 14},
                startIndex: {lower: 8, upper: 10},
                initialNumberOfPoints: 10,
                scaleByFactor: 1.1,
                movementGaston: {lower: 10, upper: 20},
                accentRange: {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 6}},
                blurRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
                featherTimes: {lower: 2, upper: 6},
            }),
        })
    });

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: AmpEffect, percentChance: 100, currentEffectConfig: new AmpConfig({
                layerOpacity: 0.5,
                underLayerOpacity: 0.25,
                thickness: 1,
                lineStart: 470,
                length: 10,
                sparsityFactor: [1],
                center: {x: 1080 / 2, y: 1920 / 2},
                speed: {lower: 240, upper: 240},
                innerColor: new ColorPicker(ColorPicker.SelectionType.color, '#FFFFFF'),
                outerColor: ringColor,
            }), defaultEffectConfig: AmpConfig,
        })
    });

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: AmpEffect, percentChance: 100, currentEffectConfig: new AmpConfig({
                layerOpacity: 0.5,
                underLayerOpacity: 0.25,
                thickness: 1,
                lineStart: 484,
                length: 10,
                sparsityFactor: [1],
                center: {x: 1080 / 2, y: 1920 / 2},
                speed: {lower: 480, upper: 480},
                innerColor: new ColorPicker(ColorPicker.SelectionType.color, '#FFFFFF'),
                outerColor: ringColor,
            }), defaultEffectConfig: AmpConfig,
        })
    });

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: AmpEffect, percentChance: 100, currentEffectConfig: new AmpConfig({
                layerOpacity: 0.5,
                underLayerOpacity: 0.25,
                thickness: 1,
                lineStart: 498,
                length: 10,
                sparsityFactor: [1],
                center: {x: 1080 / 2, y: 1920 / 2},
                speed: {lower: 720, upper: 720},
                innerColor: new ColorPicker(ColorPicker.SelectionType.color, '#FFFFFF'),
                outerColor: ringColor,
            }), defaultEffectConfig: AmpConfig,
        })
    });

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: AmpEffect, percentChance: 100, currentEffectConfig: new AmpConfig({
                layerOpacity: 0.5,
                underLayerOpacity: 0.25,
                thickness: 1,
                lineStart: 512,
                length: 10,
                sparsityFactor: [1],
                center: {x: 1080 / 2, y: 1920 / 2},
                speed: {lower: 480, upper: 480},
                innerColor: new ColorPicker(ColorPicker.SelectionType.color, '#FFFFFF'),
                outerColor: ringColor,
            }), defaultEffectConfig: AmpConfig,
        })
    });

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: AmpEffect, percentChance: 100, currentEffectConfig: new AmpConfig({
                layerOpacity: 0.5,
                underLayerOpacity: 0.25,
                thickness: 1,
                lineStart: 526,
                length: 10,
                sparsityFactor: [1],
                center: {x: 1080 / 2, y: 1920 / 2},
                speed: {lower: 240, upper: 240},
                innerColor: new ColorPicker(ColorPicker.SelectionType.color, '#FFFFFF'),
                outerColor: ringColor,
            }), defaultEffectConfig: AmpConfig,
        })
    });

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: LayeredHexEffect, percentChance: 100, currentEffectConfig: new LayeredHexConfig({
                layerOpacityRange: {bottom: {lower: 0.3, upper: 0.4}, top: {lower: 0.5, upper: 0.6}},
                layerOpacityTimes: {lower: 4, upper: 8},
                indexOpacityRange: {bottom: {lower: 0.3, upper: 0.4}, top: {lower: 0.5, upper: 0.6}},
                indexOpacityTimes: {lower: 4, upper: 8},
                thickness: 2,
                stroke: 1,
                layerOpacity: 0.75,
                radius: {lower: 10, upper: 25},
                offsetRadius: {lower: 30, upper: 35},
                numberOfIndex: {lower: 18, upper: 20},
                startIndex: {lower: 13, upper: 16},
                initialNumberOfPoints: 8,
                scaleByFactor: 1.1,
                movementGaston: {lower: 5, upper: 10},
                accentRange: {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 6}},
                blurRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
                featherTimes: {lower: 2, upper: 6},
            }),
        })
    });

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: LensFlareEffect,
            percentChance: 100,
            currentEffectConfig: new LensFlareConfig({
                numberOfFlareRings: new Range(5, 10),
                flareRingsSizeRange: new PercentageRange(new PercentageShortestSide(0.65), new PercentageLongestSide(1)),
                flareRingStroke: new Range(1, 3),

                numberOfFlareRays: new Range(40, 60),
                flareRaysSizeRange: new PercentageRange(new PercentageShortestSide(0.65), new PercentageLongestSide(1)),
                flareRaysStroke: new Range(1, 3),

                strategy: ['color-bucket'],
                layerOpacityRange: new DynamicRange(new Range(0.4, 0.5), new Range(0.6, 0.7)),
                layerOpacityTimes: new Range(2, 8),

                elementOpacityRange: new DynamicRange(new Range(0.4, 0.5), new Range(0.6, 0.7)),
                elementOpacityTimes: new Range(2, 8),

                elementGastonRange: new DynamicRange(new Range(5, 10), new Range(15, 20)),
                elementGastonTimes: new Range(2, 8),
            }),
            possibleSecondaryEffects: []
        })
    });


    //cross
    await addSpiral(myTestProject, crossColor, new Point2D((1080 / 2), (1920 / 2) + (length)), new Range(6, 6));
    await addSpiral(myTestProject, crossColor, new Point2D((1080 / 2) - length, (1920 / 2)), new Range(6, 6));
    await addSpiral(myTestProject, crossColor, new Point2D((1080 / 2) + length, (1920 / 2)), new Range(6, 6));
    await addSpiral(myTestProject, crossColor, new Point2D((1080 / 2), (1920 / 2) - (length)), new Range(6, 6));

    //square
    await addSpiral(myTestProject, squareColor, new Point2D((1080 / 2) + (length), (1920 / 2) + (length)), new Range(4, 4));
    await addSpiral(myTestProject, squareColor, new Point2D((1080 / 2) - (length), (1920 / 2) + (length)), new Range(4, 4));
    await addSpiral(myTestProject, squareColor, new Point2D((1080 / 2) - (length), (1920 / 2) - (length)), new Range(4, 4));
    await addSpiral(myTestProject, squareColor, new Point2D((1080 / 2) + (length), (1920 / 2) - (length)), new Range(4, 4));

    //outliers
    await addSpiral(myTestProject, outlierColor, new Point2D((1080 / 2), (1920 / 2) + (2 * length)), new Range(2, 2));
    await addSpiral(myTestProject, outlierColor, new Point2D((1080 / 2) - (2 * length), (1920 / 2)), new Range(2, 2));
    await addSpiral(myTestProject, outlierColor, new Point2D((1080 / 2) + (2 * length), (1920 / 2)), new Range(2, 2));
    await addSpiral(myTestProject, outlierColor, new Point2D((1080 / 2), (1920 / 2) - (2 * length)), new Range(2, 2));

    //heart
    await addSpiral(myTestProject, heartColor, new Point2D((1080 / 2), (1920 / 2)), new Range(8, 8));


    promiseArray.push(myTestProject.generateRandomLoop());
}


const neons = NeonColorSchemeFactory.getColorScheme(NeonColorScheme.neons);
const primaryNeons = NeonColorSchemeFactory.getColorScheme(NeonColorScheme.primaryNeons);
const secondaryNeons = NeonColorSchemeFactory.getColorScheme(NeonColorScheme.secondaryNeons);


await createLantern(
    new ColorPicker(ColorPicker.SelectionType.color, neons.getColorFromBucket()),
    new ColorPicker(ColorPicker.SelectionType.color, neons.getColorFromBucket()),
    new ColorPicker(ColorPicker.SelectionType.color, neons.getColorFromBucket()),
    new ColorPicker(ColorPicker.SelectionType.color, neons.getColorFromBucket()),
    new ColorPicker(ColorPicker.SelectionType.color, '#FF0000'),
    neons,
);

await createLantern(
    new ColorPicker(ColorPicker.SelectionType.color, neons.getColorFromBucket()),
    new ColorPicker(ColorPicker.SelectionType.color, neons.getColorFromBucket()),
    new ColorPicker(ColorPicker.SelectionType.color, neons.getColorFromBucket()),
    new ColorPicker(ColorPicker.SelectionType.color, neons.getColorFromBucket()),
    new ColorPicker(ColorPicker.SelectionType.color, '#FF0000'),
    neons,
);

await createLantern(
    new ColorPicker(ColorPicker.SelectionType.color, neons.getColorFromBucket()),
    new ColorPicker(ColorPicker.SelectionType.color, neons.getColorFromBucket()),
    new ColorPicker(ColorPicker.SelectionType.color, neons.getColorFromBucket()),
    new ColorPicker(ColorPicker.SelectionType.color, neons.getColorFromBucket()),
    new ColorPicker(ColorPicker.SelectionType.color, '#FF0000'),
    neons,
);

await createLantern(
    new ColorPicker(ColorPicker.SelectionType.color, primaryNeons.getColorFromBucket()),
    new ColorPicker(ColorPicker.SelectionType.color, primaryNeons.getColorFromBucket()),
    new ColorPicker(ColorPicker.SelectionType.color, primaryNeons.getColorFromBucket()),
    new ColorPicker(ColorPicker.SelectionType.color, primaryNeons.getColorFromBucket()),
    new ColorPicker(ColorPicker.SelectionType.color, '#FF0000'),
    primaryNeons,
);

await createLantern(
    new ColorPicker(ColorPicker.SelectionType.color, secondaryNeons.getColorFromBucket()),
    new ColorPicker(ColorPicker.SelectionType.color, secondaryNeons.getColorFromBucket()),
    new ColorPicker(ColorPicker.SelectionType.color, secondaryNeons.getColorFromBucket()),
    new ColorPicker(ColorPicker.SelectionType.color, secondaryNeons.getColorFromBucket()),
    new ColorPicker(ColorPicker.SelectionType.color, '#FF0000'),
    secondaryNeons,
);

await Promise.all(promiseArray);