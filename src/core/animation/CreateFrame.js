import {LayerFactory} from "../factory/layer/LayerFactory.js";

export class CreateFrame {
    constructor(settings) {
        this.settings = settings;
        this.finalFileName = settings.config.finalFileName;
        this.config = settings.config;

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

        console.log(`[Worker Log]: Starting frame ${frameNumber} with ${total} layers`);

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

                    console.log(`[Worker Log]: Invoking effect ${effects[idx].name} on layer ${idx}`);
                    const start = performance.now();

                    effects[idx].invoke(
                        layers[idx],
                        frameNumber,
                        this.context.numberOfFrame
                    ).then(() => {
                        const duration = performance.now() - start;
                        console.log(`[Worker Log]: ✔️ Effect ${effects[idx].name} completed in ${formatDuration(duration)}`);
                    }).catch(err => {
                        const duration = performance.now() - start;
                        console.error(`[Worker Log]: ❌ Effect ${effects[idx].name} error after ${formatDuration(duration)}:`, err);
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
                await this.settings.finalImageEffects[e].invoke(background, frameNumber, this.context.numberOfFrame);
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