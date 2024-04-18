import { Project } from './app/Project.js';
import { LayerConfig } from './core/layer/LayerConfig.js';
import { NeonColorScheme, NeonColorSchemeFactory } from './core/color/NeonColorSchemeFactory.js';
import { ColorPicker } from './core/layer/configType/ColorPicker.js';
import { RedEyeEffect } from './effects/primaryEffects/red-eye/RedEyeEffect.js';
import { Point2D } from './core/layer/configType/Point2D.js';
import { RedEyeConfig } from './effects/primaryEffects/red-eye/RedEyeConfig.js';
import { MappedFramesEffect } from './effects/primaryEffects/mappedFrames/MappedFramesEffect.js';
import { MappedFramesConfig } from './effects/primaryEffects/mappedFrames/MappedFramesConfig.js';
import { FuzzyBandEffect } from './effects/primaryEffects/fuzzyBands/FuzzyBandEffect.js';
import { FuzzyBandConfig } from './effects/primaryEffects/fuzzyBands/FuzzyBandConfig.js';
import { getRandomFromArray, getRandomIntInclusive } from './core/math/random.js';
import { EncircledSpiralEffect } from './effects/primaryEffects/encircledSpiral/EncircledSpiralEffect.js';
import { EncircledSpiralConfig } from './effects/primaryEffects/encircledSpiral/EncircledSpiralConfig.js';
import { Range } from './core/layer/configType/Range.js';
import { ViewportEffect } from './effects/primaryEffects/viewport/ViewportEffect.js';
import { ViewportConfig } from './effects/primaryEffects/viewport/ViewportConfig.js';
import {LayeredHexEffect} from "./effects/primaryEffects/layeredHex/LayeredHexEffect.js";
import {LayeredHexConfig} from "./effects/primaryEffects/layeredHex/LayeredHexConfig.js";

const myTestProject = new Project({
    artist: 'John Ruf',
    projectName: 'red-eye',
    projectDirectory: 'src/red-eye/',
    neutrals: ['#FFFFFF'],
    backgrounds: ['#000000'],
    numberOfFrame: 1800,
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: FuzzyBandEffect,
        percentChance: 100,
        currentEffectConfig: new FuzzyBandConfig({
            layerOpacity: 0.65,
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
        effect: ViewportEffect,
        percentChance: 100,
        currentEffectConfig: new ViewportConfig({
            invertLayers: false,
            layerOpacity: 1,
            underLayerOpacity: 0.65,
            stroke: 0,
            thickness: 12,
            ampStroke: 0,
            ampThickness: 0,
            radius: [350],
            startAngle: [270],
            ampLength: [50, 75, 100],
            ampRadius: [50, 75, 100],
            sparsityFactor: [3, 4, 5, 6],
            amplitude: { lower: 0, upper: 0 },
            times: { lower: 0, upper: 0 },
            accentRange: { bottom: { lower: 20, upper: 20 }, top: { lower: 30, upper: 30 } },
            blurRange: { bottom: { lower: 10, upper: 10 }, top: { lower: 20, upper: 20 } },
            featherTimes: { lower: 2, upper: 8 },
        }),
    }),
});


let redEyeCount = getRandomFromArray([6]);

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

redEyeCount = getRandomFromArray([10]);

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

redEyeCount = getRandomFromArray([12]);

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

const promiseArray = [];
myTestProject.colorScheme = NeonColorSchemeFactory.getColorScheme(NeonColorScheme.clashNeons);

promiseArray.push(myTestProject.generateRandomLoop());

await Promise.all(promiseArray);
