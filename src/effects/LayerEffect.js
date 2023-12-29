import {Settings} from "../core/Settings.js";

export class LayerEffect {
    constructor({
                    name = 'base-effect',
                    requiresLayer = false,
                    config = {},

                },
                additionalEffects = [],
                ignoreAdditionalEffects = false
    ) {
        this.name = name;
        this.requiresLayer = requiresLayer;
        this.config = config;
        this.data = {};
        this.additionalEffects = additionalEffects;
        this.ignoreAdditionalEffects = ignoreAdditionalEffects;
    }

    generate(settings) {
        for (let i = 0; i < this.additionalEffects.length; i++) {
            this.additionalEffects[i].generate(settings);
        }
    }

    async invoke(layer, currentFrame, totalFrames) {
        for (let i = 0; i < this.additionalEffects.length; i++) {
            //if any additional effects? call them as well.
            if (!this.ignoreAdditionalEffects) {
                await this.additionalEffects[i].invoke(layer, currentFrame, totalFrames);
            }
        }
    }

    getInfo() {
        return `${this.name}`
    }
}




