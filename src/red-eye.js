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
import { ViewportEffect } from './effects/primaryEffects/viewport/ViewportEffect.js';
import { ViewportConfig } from './effects/primaryEffects/viewport/ViewportConfig.js';
import {ScanLinesEffect} from "./effects/primaryEffects/scanLines/ScanLinesEffect.js";
import {ScanLinesConfig} from "./effects/primaryEffects/scanLines/ScanLinesConfig.js";

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
        effect: ScanLinesEffect,
        percentChance: 100,
        currentEffectConfig: new ScanLinesConfig({
                lines: {lower: 6, upper: 8},
                minlength: {lower: 20, upper: 30},
                maxlength: {lower: 40, upper: 55},
                times: {lower: 4, upper: 8},
                alphaRange: {bottom: {lower: 0.2, upper: 0.3}, top: {lower: 0.4, upper: 0.5}},
                alphaTimes: {lower: 2, upper: 8},
                loopTimes: {lower: 1, upper: 3},
            }
        ),
    }),
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: FuzzyBandEffect,
        percentChance: 100,
        currentEffectConfig: new FuzzyBandConfig({
            layerOpacity: 0.70,
            underLayerOpacityRange: { bottom: { lower: 0.4, upper: 0.5 }, top: { lower: 0.6, upper: 0.7 } },
            underLayerOpacityTimes: { lower: 2, upper: 8 },
            color: new ColorPicker(),
            innerColor: new ColorPicker(ColorPicker.SelectionType.color, '#FFFFFF'),
            invertLayers: true,
            thickness: 1,
            stroke: 1,
            circles: { lower: 12, upper: 12 },
            radius: {
                lower: (finalSize) => finalSize.shortestSide * 0.15,
                upper: (finalSize) => finalSize.longestSide * 0.5,
            },
            accentRange: { bottom: { lower: 20, upper: 20 }, top: { lower: 28, upper: 28 } },
            blurRange: { bottom: { lower: 10, upper: 10 }, top: { lower: 14, upper: 14 } },
            featherTimes: { lower: 2, upper: 8 },
        }),
        defaultEffectConfig: FuzzyBandConfig,
    }),
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: MappedFramesEffect,
        percentChance: 100,
        currentEffectConfig: new MappedFramesConfig({
            folderName: '/mappedFrames/',
            layerOpacity: [0.85],
            buffer: [50],
            loopTimes: 15,
        }),
    }),
});

let redEyeCount = getRandomFromArray([8]);

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
                sparsityFactor: [6, 8, 9, 10, 12],
                innerRadius: getRandomIntInclusive(250, 300),
                outerRadius: getRandomIntInclusive(400, 500),
                possibleJumpRangeInPixels: { lower: 10, upper: 30 },
                lineLength: { lower: 75, upper: 150 },
                numberOfLoops: { lower: 1, upper: 8 },
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
                sparsityFactor: [6, 8, 9, 10, 12],
                innerRadius: getRandomIntInclusive(350, 400),
                outerRadius: getRandomIntInclusive(500, 600),
                possibleJumpRangeInPixels: { lower: 10, upper: 30 },
                lineLength: { lower: 75, upper: 150 },
                numberOfLoops: { lower: 1, upper: 8 },
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
                sparsityFactor: [6, 8, 9, 10, 12],
                innerRadius: getRandomIntInclusive(600, 800),
                outerRadius: getRandomIntInclusive(1000, 1200),
                possibleJumpRangeInPixels: { lower: 10, upper: 30 },
                lineLength: { lower: 75, upper: 150 },
                numberOfLoops: { lower: 1, upper: 8 },
                accentRange: { bottom: { lower: 4, upper: 4 }, top: { lower: 8, upper: 8 } },
                blurRange: { bottom: { lower: 3, upper: 3 }, top: { lower: 6, upper: 6 } },
                featherTimes: { lower: 2, upper: 8 },
            }),
        }),
    });
}
const promiseArray = [];
myTestProject.colorScheme = NeonColorSchemeFactory.getColorScheme(NeonColorScheme.neons);

promiseArray.push(myTestProject.generateRandomLoop());

await Promise.all(promiseArray);
