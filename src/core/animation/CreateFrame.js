import {LayerFactory} from "../factory/layer/LayerFactory.js";
import {WorkerEventEmitter} from "../events/WorkerEventEmitter.js";

export class CreateFrame {
    constructor(settings, eventEmitter = null) {
        this.settings = settings;
        this.finalFileName = settings.config.finalFileName;
        this.config = settings.config;
        this.eventEmitter = eventEmitter;

        this.context = {
            numberOfFrame: this.config.numberOfFrame,
            finalImageSize: settings.finalSize,
            workingDirectory: settings.workingDirectory,
            finalFileName: this.config.finalFileName,
        };
    }

    /// //////////////////////////
    // Process the main and secondary effects
    /// /////////////////////////
    async #processFrame(frameNumber) {
        const effects = this.settings.effects;
        const layers = this.context.layers;
        const total = layers.length;
        const maxConcurrency = 3;
        let currentIndex = 0;
        let active = 0;

        // Emit structured event instead of console.log
        if (this.eventEmitter) {
            this.eventEmitter.emitFrameStarted(frameNumber, this.config.numberOfFrame);
        }

        const formatDuration = (ms) => {
            const minutes = Math.floor(ms / 60000);
            const seconds = Math.floor((ms % 60000) / 1000);
            const millis = Math.floor(ms % 1000);
            return `${minutes}m ${seconds}s ${millis}ms`;
        };

        return new Promise(resolve => {
            const launchNext = () => {
                if (currentIndex >= total && active === 0) {
                    return resolve();
                }

                while (active < maxConcurrency && currentIndex < total) {
                    const idx = currentIndex++;
                    active++;

                    // Emit structured event for effect start
                    if (this.eventEmitter) {
                        this.eventEmitter.emitEffectStarted(effects[idx].name, frameNumber);
                    }
                    const start = performance.now();

                    effects[idx].invoke(
                        layers[idx],
                        frameNumber,
                        this.context.numberOfFrame
                    ).then(() => {
                        const duration = performance.now() - start;
                        // Emit structured event for effect completion
                        if (this.eventEmitter) {
                            this.eventEmitter.emitEffectCompleted(effects[idx].name, frameNumber, duration);
                        }
                    }).catch(err => {
                        const duration = performance.now() - start;
                        // Emit structured event for effect failure
                        if (this.eventEmitter) {
                            this.eventEmitter.emitEffectFailed(effects[idx].name, frameNumber, err);
                        }
                    }).finally(() => {
                        active--;
                        launchNext();
                    });
                }
            };

            launchNext();
        });
    }

    // This function creates a new image (layer) for each main effect
    async #getLayers(w, h) {
        const extraLayers = [];
        for (let i = 0; i < this.settings.effects.length; i++) { // effect is found in the outermost layer of this function
            extraLayers.push(await LayerFactory.getNewLayer(
                h,
                w,
                '#00000000',
                this.settings.fileConfig,
            ));
        }
        return extraLayers;
    }

    async createSingleFrame(frameNumber) {
        return new Promise(async (resolve) => {
            /// /////////////////////
            // get fresh files every loop
            /// /////////////////////
            const background = await LayerFactory.getNewLayer(this.context.finalImageSize.height, this.context.finalImageSize.width, this.settings.backgroundColor, this.settings.fileConfig);
            this.context.layers = await this.#getLayers(this.context.finalImageSize.width, this.context.finalImageSize.height, this.context);

            /// //////////////////////////
            // run all effects for frame
            /// /////////////////////////
            await this.#processFrame(frameNumber, this.context);

            /// /////////////////////
            // COMPOSE
            // Secondary Magic:  this composites the layers into one image, in order they are in the layers array.
            // Last is on top
            /// ////////////////////
            for (let i = 0; i < this.context.layers.length; i++) {
                await background.compositeLayerOver(this.context.layers[i]);
            }

            /// /////////////////////
            // apply final image effects one at a time
            /// /////////////////////
            for (let e = 0; e < this.settings.finalImageEffects.length; e++) {
                if (this.eventEmitter) {
                    this.eventEmitter.emitEffectStarted(this.settings.finalImageEffects[e].name, frameNumber);
                }
                const start = performance.now();

                try {
                    await this.settings.finalImageEffects[e].invoke(background, frameNumber, this.context.numberOfFrame);
                    const duration = performance.now() - start;
                    if (this.eventEmitter) {
                        this.eventEmitter.emitEffectCompleted(this.settings.finalImageEffects[e].name, frameNumber, duration);
                    }
                } catch (err) {
                    const duration = performance.now() - start;
                    if (this.eventEmitter) {
                        this.eventEmitter.emitEffectFailed(this.settings.finalImageEffects[e].name, frameNumber, err);
                    }
                    throw err;
                }
            }

            /// ///////////////////
            // write to disk
            // still can run multiple instances at once
            /// //////////////////
            const filename = `${this.context.workingDirectory + this.context.finalFileName}-frame-${frameNumber.toString()}.png`;
            await background.toFile(filename);


            this.context.layers = null;

            resolve();
        });
    }
}