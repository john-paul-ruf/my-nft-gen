import {promises as fs} from 'fs';
import {EventEmitter} from 'events';
import {Settings} from '../core/Settings.js';
import {ColorScheme} from '../core/color/ColorScheme.js';
import {LayerConfig} from '../core/layer/LayerConfig.js';
import {LoopBuilder} from '../core/animation/LoopBuilder.js';
import {randomId} from '../core/math/random.js';
import {execFile} from 'child_process';
import {RequestNewWorkerThread} from "../core/worker-threads/RequestNewWorkerThread.js";
import { WorkerEvents, WorkerEventCategories } from '../core/events/WorkerEventCategories.js';

export const ProjectEvents = {
    // Project lifecycle events
    PRIMARY_EFFECT_ADDED: 'primaryEffectAdded',
    PRIMARY_EFFECT_REMOVED: 'primaryEffectRemoved',
    FINAL_EFFECT_ADDED: 'finalEffectAdded',
    FINAL_EFFECT_REMOVED: 'finalEffectRemoved',
    GENERATION_STARTED: 'generationStarted',
    DIRECTORY_CREATING: 'directoryCreating',
    DIRECTORY_CREATED: 'directoryCreated',
    SETTINGS_CREATING: 'settingsCreating',
    SETTINGS_CREATED: 'settingsCreated',
    CONFIG_SAVING: 'configSaving',
    CONFIG_SAVED: 'configSaved',
    WORKER_THREAD_STARTING: 'workerThreadStarting',
    GENERATION_COMPLETED: 'generationCompleted',
    WARNING: 'warning',
    ERROR: 'error',

    // Worker events - re-exported for convenience
    ...WorkerEvents
};

// Export categories for easy access
export { WorkerEventCategories };

export class Project extends EventEmitter {
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
        super();
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
        this._suppressWorkerLogs = false;
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
        try {
            this.selectedPrimaryEffectConfigs.push(layerConfig);
            this.emit(ProjectEvents.PRIMARY_EFFECT_ADDED, {
                effect: layerConfig,
                totalEffects: this.selectedPrimaryEffectConfigs.length
            });
        } catch (error) {
            this.emit(ProjectEvents.ERROR, {
                type: 'addPrimaryEffect',
                error,
                effect: layerConfig
            });
            throw error;
        }
    }

    removePrimaryEffect(layerConfig) {
        try {
            const index = this.selectedPrimaryEffectConfigs.indexOf(layerConfig);
            if (index > -1) {
                this.selectedPrimaryEffectConfigs.splice(index, 1);
                this.emit(ProjectEvents.PRIMARY_EFFECT_REMOVED, {
                    effect: layerConfig,
                    totalEffects: this.selectedPrimaryEffectConfigs.length
                });
            } else {
                this.emit(ProjectEvents.WARNING, {
                    type: 'removePrimaryEffect',
                    message: 'Effect not found in primary effects list',
                    effect: layerConfig
                });
            }
        } catch (error) {
            this.emit(ProjectEvents.ERROR, {
                type: 'removePrimaryEffect',
                error,
                effect: layerConfig
            });
            throw error;
        }
    }

    addFinalEffect({layerConfig = new LayerConfig({})}) {
        try {
            this.selectedFinalEffectConfigs.push(layerConfig);
            this.emit(ProjectEvents.FINAL_EFFECT_ADDED, {
                effect: layerConfig,
                totalEffects: this.selectedFinalEffectConfigs.length
            });
        } catch (error) {
            this.emit(ProjectEvents.ERROR, {
                type: 'addFinalEffect',
                error,
                effect: layerConfig
            });
            throw error;
        }
    }

    removeFinalEffect(layerConfig) {
        try {
            const index = this.selectedFinalEffectConfigs.indexOf(layerConfig);
            if (index > -1) {
                this.selectedFinalEffectConfigs.splice(index, 1);
                this.emit(ProjectEvents.FINAL_EFFECT_REMOVED, {
                    effect: layerConfig,
                    totalEffects: this.selectedFinalEffectConfigs.length
                });
            } else {
                this.emit(ProjectEvents.WARNING, {
                    type: 'removeFinalEffect',
                    message: 'Effect not found in final effects list',
                    effect: layerConfig
                });
            }
        } catch (error) {
            this.emit(ProjectEvents.ERROR, {
                type: 'removeFinalEffect',
                error,
                effect: layerConfig
            });
            throw error;
        }
    }

    /**
     * Enable or disable suppression of unstructured worker logs
     * @param {boolean} suppress - Whether to suppress worker logs
     */
    setSuppressWorkerLogs(suppress = true) {
        this._suppressWorkerLogs = suppress;
    }

    async generateRandomLoop(keepFrames = false) {
        try {
            this.emit(ProjectEvents.GENERATION_STARTED, {
                projectName: this.projectName,
                keepFrames,
                timestamp: new Date().toISOString()
            });

            const finalFinalName = this.projectName + randomId();
            const workingDirectory = `${this.projectDirectory}/${finalFinalName}/`;

            this.emit(ProjectEvents.DIRECTORY_CREATING, { workingDirectory });
            await fs.mkdir(workingDirectory + 'settings/', {recursive: true});
            this.emit(ProjectEvents.DIRECTORY_CREATED, { workingDirectory });

            this.emit(ProjectEvents.SETTINGS_CREATING, { finalFileName: finalFinalName });
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
            this.emit(ProjectEvents.SETTINGS_CREATED, {
                settings: settings, // Pass the full settings object
                projectInfo: {
                    finalFileName: finalFinalName,
                    numberOfFrame: this.numberOfFrame,
                    backgroundColor: settings.backgroundColor
                }
            });

            const configPath = `${settings.config.configFileOut}-settings.json`;
            this.emit(ProjectEvents.CONFIG_SAVING, { configPath });
            await fs.writeFile(configPath, JSON.stringify(settings));
            this.emit(ProjectEvents.CONFIG_SAVED, { configPath, settings });

            this.emit(ProjectEvents.WORKER_THREAD_STARTING, { configPath });
            await RequestNewWorkerThread(configPath, this, { suppressWorkerLogs: this._suppressWorkerLogs || false });
            this.emit(ProjectEvents.GENERATION_COMPLETED, {
                projectName: this.projectName,
                finalFileName: finalFinalName,
                workingDirectory,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            this.emit(ProjectEvents.ERROR, {
                type: 'generateRandomLoop',
                error,
                projectName: this.projectName,
                timestamp: new Date().toISOString()
            });
            throw error;
        }
    }
}
