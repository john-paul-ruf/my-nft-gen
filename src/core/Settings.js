import {getRandomIntExclusive, randomId} from './math/random.js';
import {ColorScheme} from './color/ColorScheme.js';
import {LayerEffectFromJSON} from './layer/LayerEffectFromJSON.js';
import {LayerConfig} from './layer/LayerConfig.js';
import {globalBufferPool} from './pool/BufferPool.js';
import {ConfigReconstructor} from './ConfigReconstructor.js';

export class Settings {

    static async from(json) {
        const settings = Object.assign(new Settings({}), json);

        settings.colorScheme = Object.assign(new ColorScheme({}), settings.colorScheme);

        for (let i = 0; i < settings.effects.length; i++) {
            settings.effects[i] = await LayerEffectFromJSON.from(settings.effects[i]);
        }

        for (let i = 0; i < settings.finalImageEffects.length; i++) {
            settings.finalImageEffects[i] = await LayerEffectFromJSON.from(settings.finalImageEffects[i]);
        }

        return settings;
    }

    constructor({
                    colorScheme = new ColorScheme({}),
                    neutrals = ['#FFFFFF'],
                    backgrounds = ['#000000'],
                    lights = ['#FFFF00', '#FF00FF', '#00FFFF', '#FF0000', '#00FF00', '#0000FF'],
                    _INVOKER_ = 'unknown',
                    runName = 'null-space-void',
                    frameInc = 1,
                    numberOfFrame = 1800,
                    longestSideInPixels = 1920,
                    shortestSideInPixels = 1080,
                    isHorizontal = false,
                    workingDirectory = 'src/img/working/',
                    layerStrategy = 'sharp', // jimp no longer supported
                    allPrimaryEffects = [new LayerConfig({})],
                    allFinalImageEffects = [new LayerConfig({})],
                    finalFileName = `nsv${randomId()}`,
                    fileOut = workingDirectory + finalFileName,
                    configFileOut = workingDirectory + `settings/` + finalFileName,
                    maxConcurrentFrameBuilderThreads = 5,
                    frameStart = 0,
                }) {
        this.frameStart = frameStart;

        this.colorScheme = colorScheme;
        this.maxConcurrentFrameBuilderThreads = maxConcurrentFrameBuilderThreads;

        const finalImageHeight = isHorizontal ? shortestSideInPixels : longestSideInPixels;
        const finalImageWidth = isHorizontal ? longestSideInPixels : shortestSideInPixels;

        this.finalSize = {
            width: finalImageWidth,
            height: finalImageHeight,
            longestSide: finalImageHeight > finalImageWidth ? finalImageHeight : finalImageWidth,
            shortestSide: finalImageHeight > finalImageWidth ? finalImageWidth : finalImageHeight,
        };

        this.workingDirectory = workingDirectory;

        this.fileConfig = {
            finalImageSize: this.finalSize,
            workingDirectory: this.workingDirectory,
            layerStrategy,
        };

        // For 2D palettes
        this.neutrals = neutrals;

        // For 2D palettes
        this.backgrounds = backgrounds;

        // for three-dimensional lighting
        this.lights = lights;

        this.config = {
            _INVOKER_,
            runName,
            frameInc,
            numberOfFrame,
            finalFileName,
            fileOut,
            configFileOut,
        };

        this.allPrimaryEffects = allPrimaryEffects;
        this.allFinalImageEffects = allFinalImageEffects;

        // This determines the final image contents
        // The effect array is super important
        // Understanding effects is key to running this program.
        // Note: Effects generation is now async and handled in generateEffects()
        this.effects = [];
        this.finalImageEffects = [];
    }

    /**
     * Generate effects asynchronously with config reconstruction
     */
    async generateEffects() {
        this.effects = await this.#generatePrimaryEffects();
        this.finalImageEffects = await this.#generateFinalImageEffects();
    }

    async #generatePrimaryEffects() {
        const effectList = [];

        // For each effect in the possible effects list.
        for (const obj of this.allPrimaryEffects) {
            const chance = getRandomIntExclusive(0, 100); // roll the dice
            if (obj.percentChance > chance) { // if the roll was below the chance of hit
                // Reconstruct proper config instance from plain object
                const reconstructedConfig = await ConfigReconstructor.reconstruct(
                    obj.Effect._name_,
                    obj.currentEffectConfig
                );

                effectList.push(new obj.Effect({
                    config: reconstructedConfig,
                    additionalEffects: this.#applySecondaryEffects(obj.possibleSecondaryEffects),
                    ignoreAdditionalEffects: obj.ignoreSecondaryEffects,
                    settings: this,
                }));
            }
        }

        return effectList;
    }

    #applySecondaryEffects(possibleEffects) {
        const effectList = [];

        // For each effect in the possible effects list.
        possibleEffects.forEach((obj) => {
            const chance = getRandomIntExclusive(0, 100); // roll the dice
            if (obj.percentChance > chance) { // if the roll was below the chance of hit
                effectList.push(new obj.Effect({
                    config: obj.currentEffectConfig,
                    additionalEffects: [],
                    ignoreAdditionalEffects: obj.ignoreSecondaryEffects,
                    settings: this,
                }));
            }
        });
        return effectList;
    }

    async #generateFinalImageEffects() {
        const effectList = [];

        // For each effect in the possible effects list.
        for (const obj of this.allFinalImageEffects) {
            const chance = getRandomIntExclusive(0, 100); // roll the dice
            if (obj.percentChance > chance) { // if the roll was below the chance of hit
                // Reconstruct proper config instance from plain object
                const reconstructedConfig = await ConfigReconstructor.reconstruct(
                    obj.Effect._name_,
                    obj.currentEffectConfig
                );

                effectList.push(new obj.Effect({
                    config: reconstructedConfig,
                    additionalEffects: this.#applySecondaryEffects(obj.possibleSecondaryEffects),
                    ignoreAdditionalEffects: obj.ignoreSecondaryEffects,
                    settings: this,
                }));
            }
        }

        return effectList;
    }

    getColorFromBucket() {
        return this.colorScheme.getColorFromBucket();
    }

    getNeutralFromBucket() {
        return this.neutrals[getRandomIntExclusive(0, this.neutrals.length)];
    }

    getBackgroundFromBucket() {
        return this.backgrounds[getRandomIntExclusive(0, this.backgrounds.length)];
    }

    getLightFromBucket() {
        return this.lights[getRandomIntExclusive(0, this.lights.length)];
    }

    async getColorSchemeInfo() {
        return this.colorScheme.getColorSchemeInfo();
    }

    getPoolStats() {
        return {
            bufferPool: globalBufferPool.getStats(),
            canvasPool: globalCanvasPool.getStats(),
        };
    }

    clearPools() {
        globalBufferPool.clear();
        globalCanvasPool.clear();
    }
}
