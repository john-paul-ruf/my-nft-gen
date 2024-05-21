import {Project} from "./src/app/Project.js";
import {LayerConfig} from "./src/core/layer/LayerConfig.js";
import {AmpConfig} from "./src/effects/primaryEffects/amp/AmpConfig.js";
import {AmpEffect} from "./src/effects/primaryEffects/amp/AmpEffect.js";
import {NeonColorScheme, NeonColorSchemeFactory} from "./src/core/color/NeonColorSchemeFactory.js";


const promiseArray = [];

const test640by480 = async (colorSheme) => {
    const myTestProject = new Project({
        artist: 'quick-test',
        projectName: 'test-run',
        projectDirectory: 'src/test-run/',
        neutrals: ['#EEEEEE'],
        backgrounds: ['#000000'],
        colorScheme: colorSheme,
        numberOfFrame: 120*3,
        longestSideInPixels: 640,
        shortestSideInPixels: 480,
        isHorizontal: true,
    });

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: AmpEffect,
            percentChance: 100,
            currentEffectConfig: new AmpConfig({
                invertLayers: false,
                layerOpacity: 1,
                underLayerOpacity: 0.6,
                sparsityFactor: [3],
                stroke: 1,
                thickness: 1,
                accentRange: {bottom: {lower: 4, upper: 4}, top: {lower: 8, upper: 8}},
                blurRange: {bottom: {lower: 3, upper: 3}, top: {lower: 6, upper: 6}},
                featherTimes: {lower: 3, upper: 3},
                speed: {lower: 24, upper: 24},
                length: 100,
                lineStart: 150,
                center: {x: 640 / 2, y: 480 / 2},
            }),
            defaultEffectConfig: AmpConfig,
        }),
    });

    promiseArray.push(myTestProject.generateRandomLoop());
};

await test640by480(NeonColorSchemeFactory.getColorScheme(NeonColorScheme.clashNeons));

await Promise.all(promiseArray);
