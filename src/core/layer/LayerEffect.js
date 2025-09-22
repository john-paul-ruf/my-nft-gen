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
            // Emit error through eventBus if available, otherwise use eventEmitter
            if (this.eventBus && this.eventBus.emitWorkerEvent) {
                this.eventBus.emitWorkerEvent('EFFECT_FAILED', {
                    effectName: 'secondary_effect',
                    error: err.message,
                    stack: err.stack
                });
            } else if (this.eventEmitter) {
                this.eventEmitter.emitEffectFailed('secondary_effect', 0, err);
            }
        }

    }

    getInfo() {
        return `${this.name}`;
    }
}
