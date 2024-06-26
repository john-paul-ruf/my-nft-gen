import { promises as fs } from 'fs';
import { Settings } from '../core/Settings.js';
import { ColorScheme } from '../core/color/ColorScheme.js';
import { LayerConfig } from '../core/layer/LayerConfig.js';
import { LoopBuilder } from '../core/animation/LoopBuilder.js';
import { randomId } from '../core/math/random.js';

export class Project {
    constructor({
        artist = 'unknown',
        projectName = 'new-project',
        colorScheme = new ColorScheme({}),
        neutrals = ['#FFFFFF'],
        backgrounds = ['#000000'],
        lights = ['#FFFF00', '#FF00FF', '#00FFFF', '#FF0000', '#00FF00', '#0000FF'],
        numberOfFrame = 1800,
        longestSideInPixels = 1920,
        shortestSideInPixels = 1080,
        isHorizontal = false,
        projectDirectory = 'src/projects/',
    }) {
        this.projectName = projectName;
        this.artist = artist;
        this.colorScheme = colorScheme;
        this.neutrals = neutrals;
        this.backgrounds = backgrounds;
        this.lights = lights;
        this.numberOfFrame = numberOfFrame;
        this.internalLongestSideInPixels = longestSideInPixels;
        this.internalShortestSideInPixels = shortestSideInPixels;
        this.isHorizontal = isHorizontal;
        this.projectDirectory = projectDirectory;

        this.selectedPrimaryEffectConfigs = [];
        this.selectedFinalEffectConfigs = [];
    }

    get shortestSideInPixels() {
        return this.internalShortestSideInPixels;
    }

    get longestSideInPixels() {
        return this.internalLongestSideInPixels;
    }

    addPrimaryEffect({ layerConfig = new LayerConfig({}) }) {
        this.selectedPrimaryEffectConfigs.push(layerConfig);
    }

    removePrimaryEffect(layerConfig) {
        this.selectedPrimaryEffectConfigs.push(layerConfig);
    }

    addFinalEffect({ layerConfig = new LayerConfig({}) }) {
        this.selectedFinalEffectConfigs.push(layerConfig);
    }

    removeFinalEffect(layerConfig) {
        this.selectedFinalEffectConfigs.push(layerConfig);
    }

    async generateRandomLoop(keepFrames = false) {
        const finalFinalName = this.projectName + randomId();
        const workingDirectory = `${this.projectDirectory}/${finalFinalName}/`;

        await fs.mkdir(workingDirectory, { recursive: true });

        const loopBuilder = new LoopBuilder(
            new Settings({
                colorScheme: this.colorScheme,
                neutrals: this.neutrals,
                backgrounds: this.backgrounds,
                lights: this.lights,
                _INVOKER_: this.artist,
                runName: this.projectName,
                finalFileName: finalFinalName,
                numberOfFrame: this.numberOfFrame,
                longestSideInPixels: this.longestSideInPixels,
                shortestSideInPixels: this.shortestSideInPixels,
                isHorizontal: this.isHorizontal,
                workingDirectory,
                allPrimaryEffects: this.selectedPrimaryEffectConfigs,
                allFinalImageEffects: this.selectedFinalEffectConfigs,
            }),
        );
        return loopBuilder.constructLoop(keepFrames);
    }
}
