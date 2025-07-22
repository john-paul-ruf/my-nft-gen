import {promises as fs} from 'fs';
import {Settings} from '../core/Settings.js';
import {ColorScheme} from '../core/color/ColorScheme.js';
import {LayerConfig} from '../core/layer/LayerConfig.js';
import {LoopBuilder} from '../core/animation/LoopBuilder.js';
import {randomId} from '../core/math/random.js';
import {execFile} from 'child_process';
import {RequestNewWorkerThread} from "../core/worker-threads/RequestNewWorkerThread.js";
import {StandardEffects} from "../plugin-repo/StandardEffects.js";
import {EffectRegistry} from "../plugin-repo/EffectRegistry.js";

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
                    maxConcurrentFrameBuilderThreads = 5,
                    renderJumpFrames = 1,
                    frameStart = 0,
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
        this.maxConcurrentFrameBuilderThreads = maxConcurrentFrameBuilderThreads;
        this.renderJumpFrames = renderJumpFrames;
        this.frameStart = frameStart;

        this.selectedPrimaryEffectConfigs = [];
        this.selectedFinalEffectConfigs = [];
    }

    get shortestSideInPixels() {
        return this.internalShortestSideInPixels;
    }

    get longestSideInPixels() {
        return this.internalLongestSideInPixels;
    }

    get height() {
        return !this.isHorizontal ? this.internalLongestSideInPixels : this.internalShortestSideInPixels;
    }

    get width() {
        return !this.isHorizontal ? this.internalShortestSideInPixels : this.internalLongestSideInPixels;
    }

    addPrimaryEffect({layerConfig = new LayerConfig({})}) {
        this.selectedPrimaryEffectConfigs.push(layerConfig);
    }

    removePrimaryEffect(layerConfig) {
        this.selectedPrimaryEffectConfigs.push(layerConfig);
    }

    addFinalEffect({layerConfig = new LayerConfig({})}) {
        this.selectedFinalEffectConfigs.push(layerConfig);
    }

    removeFinalEffect(layerConfig) {
        this.selectedFinalEffectConfigs.push(layerConfig);
    }

    registerCustomEffect(name, effectClass) {

    }

    async generateRandomLoop(keepFrames = false) {

        const finalFinalName = this.projectName + randomId();
        const workingDirectory = `${this.projectDirectory}/${finalFinalName}/`;

        await fs.mkdir(workingDirectory + 'settings/', {recursive: true});

        const settings = new Settings({
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
            maxConcurrentFrameBuilderThreads: this.maxConcurrentFrameBuilderThreads,
            frameInc: this.renderJumpFrames,
            frameStart: this.frameStart,
        });

        settings.backgroundColor = settings.getBackgroundFromBucket();


        await fs.writeFile(`${settings.config.configFileOut}-settings.json`, JSON.stringify(settings));

        await RequestNewWorkerThread(`${settings.config.configFileOut}-settings.json`);
    }
}
