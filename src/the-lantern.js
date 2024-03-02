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
import {ImageOverlayEffect} from "./effects/primaryEffects/imageOverlay/ImageOverlayEffect.js";
import {ImageOverlayConfig} from "./effects/primaryEffects/imageOverlay/ImageOverlayConfig.js";
import {Range} from "./core/layer/configType/Range.js";
import {AmpEffect} from "./effects/primaryEffects/amp/AmpEffect.js";
import {AmpConfig} from "./effects/primaryEffects/amp/AmpConfig.js";

const promiseArray = [];

async function addSpiral(myTestProject, color, point) {
    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: EncircledSpiralEffect,
            percentChance: 100,
            currentEffectConfig: new EncircledSpiralConfig({
                outerColor: color,
                innerColor: new ColorPicker(ColorPicker.SelectionType.color, '#FFFFFF'),
                invertLayers: true,
                layerOpacity: 1,
                underLayerOpacity: 0.5,
                startAngle: {lower: 0, upper: 360},
                numberOfRings: new Range(2, 2),
                stroke: 1,
                thickness: 1,
                sparsityFactor: [20],
                sequencePixelConstant: {
                    lower: (finalSize) => finalSize.shortestSide * 0.001,
                    upper: (finalSize) => finalSize.shortestSide * 0.001
                },
                sequence: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181],
                minSequenceIndex: [5],
                numberOfSequenceElements: [7],
                speed: {lower: 4, upper: 4},
                accentRange: {bottom: {lower: 0, upper: 0}, top: {lower: 0, upper: 0}},
                blurRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
                featherTimes: {lower: 1, upper: 1},
                //center
                center: point,
            }),
            defaultEffectConfig: EncircledSpiralConfig
        })
    });
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
            effect: FuzzyBandEffect,
            percentChance: 100,
            currentEffectConfig: new FuzzyBandConfig({
                layerOpacity: 0.70,
                underLayerOpacityRange: {bottom: {lower: 0.1, upper: 0.2}, top: {lower: 0.3, upper: 0.4}},
                underLayerOpacityTimes: {lower: 2, upper: 6},
                color: new ColorPicker(),
                innerColor: new ColorPicker(ColorPicker.SelectionType.color, '#FFFFFF'),
                invertLayers: true,
                thickness: 1,
                stroke: 1,
                circles: {lower: 8, upper: 8},
                radius: {
                    lower: (finalSize) => finalSize.shortestSide * 0.3,
                    upper: (finalSize) => finalSize.shortestSide * 0.8
                },
                accentRange: {bottom: {lower: 10, upper: 15}, top: {lower: 30, upper: 45}},
                blurRange: {bottom: {lower: 1, upper: 3}, top: {lower: 4, upper: 8}},
                featherTimes: {lower: 2, upper: 8},
            }),
            defaultEffectConfig: FuzzyBandConfig
        })
    });


    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: LayeredHexEffect,
            percentChance: 100,
            currentEffectConfig: new LayeredHexConfig({
                layerOpacityRange: {bottom: {lower: 0.3, upper: 0.4}, top: {lower: 0.5, upper: 0.6}},
                layerOpacityTimes: {lower: 4, upper: 8},
                indexOpacityRange: {bottom: {lower: 0.3, upper: 0.4}, top: {lower: 0.5, upper: 0.6}},
                indexOpacityTimes: {lower: 4, upper: 8},
                thickness: 1,
                stroke: 1,
                layerOpacity: 0.75,
                radius: {lower: 40, upper: 80},
                offsetRadius: {lower: 50, upper: 60},
                numberOfIndex: {lower: 15, upper: 15},
                startIndex: {lower: 8, upper: 10},
                initialNumberOfPoints: 10,
                scaleByFactor: 1.1,
                movementGaston: {lower: 10, upper: 20},
                accentRange: {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 6}},
                blurRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
                featherTimes: {lower: 4, upper: 8},
            }),
        })
    });

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: AmpEffect,
            percentChance: 100,
            currentEffectConfig: new AmpConfig({
                layerOpacity: 0.5,
                underLayerOpacity: 0.25,
                thickness: 1,
                lineStart: 550,
                length: 100,
                sparsityFactor: [1],
                center: {x: 1080 / 2, y: 1920 / 2},
                speed: {lower: 120, upper: 120},
                innerColor: new ColorPicker(ColorPicker.SelectionType.color, '#FFFFFF')
            }),
            defaultEffectConfig: AmpConfig,
        })
    });

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: LayeredHexEffect,
            percentChance: 100,
            currentEffectConfig: new LayeredHexConfig({
                layerOpacityRange: {bottom: {lower: 0.3, upper: 0.4}, top: {lower: 0.5, upper: 0.6}},
                layerOpacityTimes: {lower: 4, upper: 8},
                indexOpacityRange: {bottom: {lower: 0.3, upper: 0.4}, top: {lower: 0.5, upper: 0.6}},
                indexOpacityTimes: {lower: 4, upper: 8},
                thickness: 1,
                stroke: 1,
                layerOpacity: 0.75,
                radius: {lower: 5, upper: 15},
                offsetRadius: {lower: 20, upper: 20},
                numberOfIndex: {lower: 22, upper: 22},
                startIndex: {lower: 14, upper: 14},
                initialNumberOfPoints: 8,
                scaleByFactor: 1.1,
                movementGaston: {lower: 30, upper: 40},
                accentRange: {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 6}},
                blurRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
                featherTimes: {lower: 8, upper: 16},
            }),
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


Promise.all(promiseArray);