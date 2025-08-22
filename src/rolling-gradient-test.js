import {Project} from './app/Project.js';
import {LayerConfig} from './core/layer/LayerConfig.js';
import {RollingGradientEffect} from './effects/primaryEffects/rollingGradient/RollingGradientEffect.js';
import {RollingGradientConfig} from './effects/primaryEffects/rollingGradient/RollingGradientConfig.js';
import {ColorScheme} from './core/color/ColorScheme.js';

const createRollingGradientTest = async () => {
    const myTestProject = new Project({
        artist: 'John Ruf',
        projectName: 'rolling-gradient-test',
        projectDirectory: 'output/rolling-gradient-test',
        neutrals: ['#FFFFFF'],
        backgrounds: ['#000000'],
        numberOfFrame: 120,
        colorScheme: new ColorScheme({
            colorBucket: ['#ff0000', '#00ff00', '#0000ff', '#ffff00']
        }),
        longestSideInPixels: 640,
        shortestSideInPixels: 640
    });

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: RollingGradientEffect,
            percentChance: 100,
            currentEffectConfig: new RollingGradientConfig({
                colorStops: [
                    [0, '#ff0000'],
                    [0.33, '#00ff00'], 
                    [0.66, '#0000ff'],
                    [1, '#ffff00']
                ],
                loopTimes: {lower: 3, upper: 3},
                direction: 'up'
            }),
        }),
    });

    await myTestProject.generateRandomLoop();
};

await createRollingGradientTest();