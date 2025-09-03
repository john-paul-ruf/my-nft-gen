import {Project} from './app/Project.js';
import {LayerConfig} from './core/layer/LayerConfig.js';
import {PerlinNoiseEffect} from './effects/primaryEffects/perlinNoise/PerlinNoiseEffect.js';
import {PerlinNoiseConfig} from './effects/primaryEffects/perlinNoise/PerlinNoiseConfig.js';
import {ColorScheme} from './core/color/ColorScheme.js';

const createPerlinNoiseTest = async () => {
    const myTestProject = new Project({
        artist: 'John Ruf',
        projectName: 'perlin-noise-test',
        projectDirectory: 'output/perlin-noise-test',
        neutrals: ['#FFFFFF'],
        backgrounds: ['#000000'],
        numberOfFrame: 60,
        colorScheme: new ColorScheme({
            colorBucket: ['#ff0000', '#00ff00', '#0000ff']
        }),
        longestSideInPixels: 640,
        shortestSideInPixels: 640
    });

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: PerlinNoiseEffect,
            percentChance: 100,
            currentEffectConfig: new PerlinNoiseConfig({
                scale: 0.02,
                speed: 1,
                colorScheme: ['#000000', '#ff00ff']
            }),
        }),
    });

    await myTestProject.generateRandomLoop();
};

await createPerlinNoiseTest();
