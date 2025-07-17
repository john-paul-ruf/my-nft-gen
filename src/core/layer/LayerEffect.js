import { Settings } from '../Settings.js';

export class LayerEffect {
    constructor({
        name = 'base-effect',
        requiresLayer = false,
        config = {},
        additionalEffects = [],
        ignoreAdditionalEffects = false,
        settings = new Settings({}),
    }) {
        this.name = name;
        this.requiresLayer = requiresLayer;
        this.config = config;

        this.layerStrategy = settings.layerStrategy;
        this.finalSize = settings.finalSize;
        this.workingDirectory = settings.workingDirectory;
        this.fileConfig = settings.fileConfig;

        if (!ignoreAdditionalEffects) {
            this.additionalEffects = additionalEffects;
        } else {
            this.additionalEffects = [];
        }

        this.ignoreAdditionalEffects = ignoreAdditionalEffects;
    }

    async invoke(layer, currentFrame, totalFrames) {
        if (this.ignoreAdditionalEffects) return;

        const effects = this.additionalEffects;
        const total = effects.length;

        for (let i = 0; i < total; i++) {
            //console.time(`[Worker Log]: Secondary Effect ${i}`);
            try {
                // Optional: timeout guard
                await Promise.race([
                    effects[i].invoke(layer, currentFrame, totalFrames),
                ]);
            } catch (err) {
                console.error(`[Worker Log]: Secondary Effect ${i} failed:`, err);
            }
            //console.timeEnd(`[Worker Log]: Secondary Effect ${i}`);

            // Yield after every single effect to avoid total blockage
            await new Promise(res => setTimeout(res,0));
        }
    }

    getInfo() {
        return `${this.name}`;
    }
}
