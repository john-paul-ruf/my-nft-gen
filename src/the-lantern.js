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

const promiseArray = [];

async function addSpiral(myTestProject, color, point) {
    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: EncircledSpiralEffect, percentChance: 100, currentEffectConfig: new EncircledSpiralConfig({
                outerColor: color,
                innerColor: new ColorPicker(ColorPicker.SelectionType.color, '#FFFFFF'),
                invertLayers: true,
                layerOpacity: 0.7,
                underLayerOpacity: 0.5,
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
                speed: {lower: 3, upper: 3},
                accentRange: {bottom: {lower: 0, upper: 0}, top: {lower: 0, upper: 0}},
                blurRange: {bottom: {lower: 2, upper: 2}, top: {lower: 2, upper: 2}},
                featherTimes: {lower: 1, upper: 1}, //center
                center: point,
            }), defaultEffectConfig: EncircledSpiralConfig, possibleSecondaryEffects: [
                new LayerConfig({
                    effect: GlowEffect,
                    percentChance: 100,
                    currentEffectConfig: new GlowConfig({
                        lowerRange: {lower: -6, upper: -6},
                        upperRange: {lower: 6, upper: 6},
                        times: {lower: 4, upper: 4},
                    }),
                })
            ]
        })
    })
    ;
}

const createLantern = async (crossColor, squareColor, outlierColor, colorScheme) => {

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
            effect: LayeredHexEffect, percentChance: 100, currentEffectConfig: new LayeredHexConfig({
                layerOpacityRange: {bottom: {lower: 0.3, upper: 0.4}, top: {lower: 0.5, upper: 0.6}},
                layerOpacityTimes: {lower: 4, upper: 8},
                indexOpacityRange: {bottom: {lower: 0.3, upper: 0.4}, top: {lower: 0.5, upper: 0.6}},
                indexOpacityTimes: {lower: 4, upper: 8},
                thickness: 1,
                stroke: 1,
                layerOpacity: 0.75,
                radius: {lower: 40, upper: 80},
                offsetRadius: {lower: 45, upper: 65},
                numberOfIndex: {lower: 10, upper: 20},
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
                lineStart: 425,
                length: 75,
                sparsityFactor: [1],
                center: {x: 1080 / 2, y: 1920 / 2},
                speed: {lower: 60, upper: 60},
                innerColor: new ColorPicker(ColorPicker.SelectionType.color, '#FFFFFF')
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
                thickness: 1,
                stroke: 1,
                layerOpacity: 0.75,
                radius: {lower: 10, upper: 25},
                offsetRadius: {lower: 20, upper: 30},
                numberOfIndex: {lower: 30, upper: 30},
                startIndex: {lower: 20, upper: 20},
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
            effect: FuzzyBandEffect, percentChance: 100, currentEffectConfig: new FuzzyBandConfig({
                layerOpacity: 0.70,
                underLayerOpacityRange: {bottom: {lower: 0.1, upper: 0.2}, top: {lower: 0.3, upper: 0.4}},
                underLayerOpacityTimes: {lower: 2, upper: 6},
                color: new ColorPicker(),
                innerColor: new ColorPicker(ColorPicker.SelectionType.color, '#FFFFFF'),
                invertLayers: true,
                thickness: 1,
                stroke: 1,
                circles: {lower: 10, upper: 10},
                radius: {
                    lower: (finalSize) => finalSize.shortestSide * 0.4,
                    upper: (finalSize) => finalSize.shortestSide * 0.6
                },
                accentRange: {bottom: {lower: 10, upper: 15}, top: {lower: 30, upper: 45}},
                blurRange: {bottom: {lower: 4, upper: 6}, top: {lower: 8, upper: 12}},
                featherTimes: {lower: 2, upper: 6},
            }), defaultEffectConfig: FuzzyBandConfig
        })
    });

    await addSpiral(myTestProject, outlierColor, new Point2D((1080 / 2), (1920 / 2) + (2 * length)));
    await addSpiral(myTestProject, outlierColor, new Point2D((1080 / 2) - (2 * length), (1920 / 2)));
    await addSpiral(myTestProject, outlierColor, new Point2D((1080 / 2) + (2 * length), (1920 / 2)));
    await addSpiral(myTestProject, outlierColor, new Point2D((1080 / 2), (1920 / 2) - (2 * length)));

    await addSpiral(myTestProject, squareColor, new Point2D((1080 / 2) + (length), (1920 / 2) + (length)));
    await addSpiral(myTestProject, squareColor, new Point2D((1080 / 2) - (length), (1920 / 2) + (length)));
    await addSpiral(myTestProject, squareColor, new Point2D((1080 / 2) - (length), (1920 / 2) - (length)));
    await addSpiral(myTestProject, squareColor, new Point2D((1080 / 2) + (length), (1920 / 2) - (length)));

    await addSpiral(myTestProject, crossColor, new Point2D((1080 / 2), (1920 / 2) + (length)));
    await addSpiral(myTestProject, crossColor, new Point2D((1080 / 2) - length, (1920 / 2)));
    await addSpiral(myTestProject, crossColor, new Point2D((1080 / 2) + length, (1920 / 2)));
    await addSpiral(myTestProject, crossColor, new Point2D((1080 / 2), (1920 / 2) - (length)));

    promiseArray.push(myTestProject.generateRandomLoop());
}


const neons = NeonColorSchemeFactory.getColorScheme(NeonColorScheme.neons);
const redNeons = NeonColorSchemeFactory.getColorScheme(NeonColorScheme.redNeons);
const greenNeons = NeonColorSchemeFactory.getColorScheme(NeonColorScheme.greenNeons);
const blueNeons = NeonColorSchemeFactory.getColorScheme(NeonColorScheme.blueNeons);
const primaryNeons = NeonColorSchemeFactory.getColorScheme(NeonColorScheme.primaryNeons);
const secondaryNeons = NeonColorSchemeFactory.getColorScheme(NeonColorScheme.secondaryNeons);

/*
await createLantern(
    new ColorPicker(ColorPicker.SelectionType.color, neons.getColorFromBucket()),
    new ColorPicker(ColorPicker.SelectionType.color, neons.getColorFromBucket()),
    new ColorPicker(ColorPicker.SelectionType.color, neons.getColorFromBucket()),
    neons,
);

await createLantern(
    new ColorPicker(ColorPicker.SelectionType.color, redNeons.getColorFromBucket()),
    new ColorPicker(ColorPicker.SelectionType.color, redNeons.getColorFromBucket()),
    new ColorPicker(ColorPicker.SelectionType.color, redNeons.getColorFromBucket()),
    redNeons,
);

await createLantern(
    new ColorPicker(ColorPicker.SelectionType.color, greenNeons.getColorFromBucket()),
    new ColorPicker(ColorPicker.SelectionType.color, greenNeons.getColorFromBucket()),
    new ColorPicker(ColorPicker.SelectionType.color, greenNeons.getColorFromBucket()),
    greenNeons,
);

await createLantern(
    new ColorPicker(ColorPicker.SelectionType.color, blueNeons.getColorFromBucket()),
    new ColorPicker(ColorPicker.SelectionType.color, blueNeons.getColorFromBucket()),
    new ColorPicker(ColorPicker.SelectionType.color, blueNeons.getColorFromBucket()),
    blueNeons,
);
*/

await createLantern(new ColorPicker(ColorPicker.SelectionType.color, primaryNeons.getColorFromBucket()), new ColorPicker(ColorPicker.SelectionType.color, primaryNeons.getColorFromBucket()), new ColorPicker(ColorPicker.SelectionType.color, primaryNeons.getColorFromBucket()), primaryNeons,);

await createLantern(new ColorPicker(ColorPicker.SelectionType.color, secondaryNeons.getColorFromBucket()), new ColorPicker(ColorPicker.SelectionType.color, secondaryNeons.getColorFromBucket()), new ColorPicker(ColorPicker.SelectionType.color, secondaryNeons.getColorFromBucket()), secondaryNeons,);

await Promise.all(promiseArray);