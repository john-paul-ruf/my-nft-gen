import {promises as fs} from 'fs';
import {Settings} from '../core/Settings.js';
import {ColorScheme} from '../core/color/ColorScheme.js';
import {LayerConfig} from '../core/layer/LayerConfig.js';
import {LoopBuilder} from '../core/animation/LoopBuilder.js';
import {randomId} from '../core/math/random.js';
import {execFile} from 'child_process';
import {RequestNewWorkerThread} from "../core/worker-threads/RequestNewWorkerThread.js";
import {RequestNewFrameBuilderThread} from "../core/worker-threads/RequestNewFrameBuilderThread.js";
import { WorkerEvents, WorkerEventCategories } from '../core/events/WorkerEventCategories.js';
import { globalEventBus, createProjectEventBus } from '../core/events/GlobalEventBus.js';

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
    FRAME_GENERATION_STARTED: 'frameGenerationStarted',
    FRAME_GENERATION_COMPLETED: 'frameGenerationCompleted',
    WARNING: 'warning',
    ERROR: 'error',

    // Worker events - re-exported for convenience
    ...WorkerEvents
};

// Export categories for easy access
export { WorkerEventCategories };

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
        // Create project-specific event bus connected to global bus
        const projectId = `${projectName}-${Date.now()}`;
        this.projectId = projectId;
        this.eventBus = createProjectEventBus(projectId, {
            enableDebug: false,
            enableMetrics: true,
            enableEventHistory: true
        });

        // Register this project with the global event bus
        globalEventBus.registerProject(projectId, this);

        // Initialize event listeners storage for backward compatibility
        this._eventListeners = new Map();

        // Connect the event bus to also trigger listeners on this Project instance
        // This ensures backward compatibility with existing SelectiveEventSubscriber code
        const originalBusEmit = this.eventBus.emit;
        this.eventBus.emit = (eventName, ...args) => {
            // Call the original bus emit first
            const result = originalBusEmit.apply(this.eventBus, [eventName, ...args]);

            // Also trigger listeners registered directly on this Project instance
            // This allows SelectiveEventSubscriber to work with the old project.on() approach
            if (this._eventListeners.has(eventName)) {
                const listeners = this._eventListeners.get(eventName);
                listeners.forEach(listener => {
                    try {
                        listener(...args);
                    } catch (error) {
                        console.error(`Error in event listener for ${eventName}:`, error);
                    }
                });
            }

            return result;
        };

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

    // EventEmitter compatibility methods
    emit(eventName, data) {
        return this.eventBus.emit(eventName, data);
    }

    on(eventName, listener) {
        // Store listeners for backward compatibility with SelectiveEventSubscriber
        if (!this._eventListeners.has(eventName)) {
            this._eventListeners.set(eventName, []);
        }
        this._eventListeners.get(eventName).push(listener);

        // Also register with the event bus
        return this.eventBus.on(eventName, listener);
    }

    off(eventName, listener) {
        // Remove from compatibility listeners
        if (this._eventListeners.has(eventName)) {
            const listeners = this._eventListeners.get(eventName);
            const index = listeners.indexOf(listener);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }

        // Also remove from event bus
        return this.eventBus.off(eventName, listener);
    }

    once(eventName, listener) {
        const onceWrapper = (...args) => {
            listener(...args);
            this.off(eventName, onceWrapper);
        };
        return this.on(eventName, onceWrapper);
    }

    // Global event bus methods
    getGlobalEventBus() {
        return globalEventBus;
    }

    emitGlobal(eventName, data) {
        return this.eventBus.emitGlobal(eventName, data);
    }

    subscribeToGlobal(eventName, handler) {
        return this.eventBus.subscribeToGlobal(eventName, handler);
    }

    // UnifiedEventBus specific methods
    getEventBus() {
        return this.eventBus;
    }

    getEventMetrics() {
        return this.eventBus.getMetrics();
    }

    getEventHistory() {
        return this.eventBus.getHistory();
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

            // Generate effects asynchronously with the new registration system
            await settings.generateEffects();

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
            await RequestNewWorkerThread(configPath, this.eventBus, { suppressWorkerLogs: this._suppressWorkerLogs || false });
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

    /**
     * Generate a single frame at a specific position in the animation loop
     * @param {number} frameNumber - The frame number to generate (0 to numberOfFrame-1)
     * @param {number} totalFrames - Total number of frames in the animation (defaults to this.numberOfFrame)
     * @param {boolean} returnAsBuffer - If true, returns the image as a buffer and cleans up files (default: true)
     * @param {string} outputDirectory - Directory to save the frame (optional, will create temp directory if not provided)
     * @returns {Promise<Buffer|string>} - Image buffer if returnAsBuffer=true, otherwise path to the generated frame file
     */
    async generateSingleFrame(frameNumber, totalFrames = null, returnAsBuffer = true, outputDirectory = null) {
        try {
            // Validate frame number
            const actualTotalFrames = totalFrames || this.numberOfFrame;
            if (frameNumber < 0 || frameNumber >= actualTotalFrames) {
                throw new Error(`Frame number ${frameNumber} is out of range (0 to ${actualTotalFrames - 1})`);
            }

            this.emit(ProjectEvents.FRAME_GENERATION_STARTED, {
                frameNumber,
                totalFrames: actualTotalFrames,
                projectName: this.projectName,
                timestamp: new Date().toISOString()
            });

            // Create temporary directory for frame generation if not provided
            const tempDir = outputDirectory || `${this.projectDirectory}/temp-frame-${randomId()}/`;
            const finalFinalName = this.projectName + '-frame-' + frameNumber;
            const workingDirectory = `${tempDir}${finalFinalName}/`;

            this.emit(ProjectEvents.DIRECTORY_CREATING, { workingDirectory });
            await fs.mkdir(workingDirectory + 'settings/', { recursive: true });
            this.emit(ProjectEvents.DIRECTORY_CREATED, { workingDirectory });

            // Create settings for single frame generation
            this.emit(ProjectEvents.SETTINGS_CREATING, { finalFileName: finalFinalName });
            const settings = new Settings({
                colorScheme: this.colorScheme,
                neutrals: this.neutrals,
                backgrounds: this.backgrounds,
                lights: this.lights,
                _INVOKER_: this.artist,
                runName: this.projectName,
                finalFileName: finalFinalName,
                numberOfFrame: actualTotalFrames, // Use the total frames for proper animation calculation
                longestSideInPixels: this.longestSideInPixels,
                shortestSideInPixels: this.shortestSideInPixels,
                isHorizontal: this.isHorizontal,
                workingDirectory,
                allPrimaryEffects: this.selectedPrimaryEffectConfigs,
                allFinalImageEffects: this.selectedFinalEffectConfigs,
                maxConcurrentFrameBuilderThreads: 1, // Single frame, no concurrency needed
                frameInc: 1,
                frameStart: frameNumber, // Start at the specific frame
            });

            // Generate effects with proper config reconstruction
            await settings.generateEffects();

            settings.backgroundColor = settings.getBackgroundFromBucket();
            this.emit(ProjectEvents.SETTINGS_CREATED, {
                settings: settings,
                projectInfo: {
                    finalFileName: finalFinalName,
                    numberOfFrame: actualTotalFrames,
                    frameNumber,
                    backgroundColor: settings.backgroundColor
                }
            });

            const configPath = `${settings.config.configFileOut}-settings.json`;
            this.emit(ProjectEvents.CONFIG_SAVING, { configPath });
            await fs.writeFile(configPath, JSON.stringify(settings));
            this.emit(ProjectEvents.CONFIG_SAVED, { configPath, settings });

            // Generate the specific frame
            this.emit(ProjectEvents.WORKER_THREAD_STARTING, {
                configPath,
                frameNumber,
                message: `Generating frame ${frameNumber} of ${actualTotalFrames}`
            });

            const result = await RequestNewFrameBuilderThread(
                configPath,
                frameNumber,
                this.eventBus,
                { suppressWorkerLogs: this._suppressWorkerLogs || false }
            );

            // Determine the generated frame path (matches CreateFrame.js pattern)
            const frameFilename = `${settings.workingDirectory}${settings.config.finalFileName}-frame-${frameNumber}.png`;

            let returnValue;

            if (returnAsBuffer) {
                // Read the file as a buffer
                const imageBuffer = await fs.readFile(frameFilename);

                // Clean up temporary files and directory
                try {
                    await fs.unlink(frameFilename); // Remove the PNG file
                    await fs.unlink(configPath); // Remove the config file

                    // Remove the settings directory
                    const settingsDir = `${workingDirectory}settings/`;
                    await fs.rmdir(settingsDir, { recursive: true });

                    // Remove the working directory if it's empty
                    await fs.rmdir(workingDirectory, { recursive: true });

                    // Remove temp directory if we created it
                    if (!outputDirectory) {
                        const tempDir = workingDirectory.split('/').slice(0, -2).join('/') + '/';
                        await fs.rmdir(tempDir, { recursive: true });
                    }
                } catch (cleanupError) {
                    // Emit warning but don't fail the operation
                    this.emit(ProjectEvents.WARNING, {
                        type: 'generateSingleFrame_cleanup',
                        message: 'Failed to clean up temporary files',
                        error: cleanupError,
                        frameNumber,
                        workingDirectory
                    });
                }

                returnValue = imageBuffer;
            } else {
                returnValue = frameFilename;
            }

            this.emit(ProjectEvents.FRAME_GENERATION_COMPLETED, {
                frameNumber,
                totalFrames: actualTotalFrames,
                projectName: this.projectName,
                frameFilename,
                workingDirectory,
                configPath,
                returnedAsBuffer: returnAsBuffer,
                timestamp: new Date().toISOString()
            });

            return returnValue;
        } catch (error) {
            this.emit(ProjectEvents.ERROR, {
                type: 'generateSingleFrame',
                error,
                frameNumber,
                totalFrames: totalFrames || this.numberOfFrame,
                projectName: this.projectName,
                timestamp: new Date().toISOString()
            });
            throw error;
        }
    }
}
