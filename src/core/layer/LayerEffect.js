import {Settings} from '../Settings.js';

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

        try {
            for (const effect of this.additionalEffects) {
                await effect.invoke(layer, currentFrame, totalFrames);
            }
        } catch (err) {
            console.error(`[Worker Log]: Secondary Effect failed:`, err);
        }

    }

    getInfo() {
        return `${this.name}`;
    }
}
