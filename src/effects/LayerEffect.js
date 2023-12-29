import {Settings} from "../core/Settings.js";

export class LayerEffect {
    constructor({
                    name = 'base-effect',
                    requiresLayer = false,
                    config = {},
                    additionalEffects = [],
                    ignoreAdditionalEffects = false,
                    settings = new Settings({})
                }) {
        this.name = name;
        this.requiresLayer = requiresLayer;
        this.config = config;

        if(!ignoreAdditionalEffects) {
            this.additionalEffects = additionalEffects;
        }
        else{
            this.additionalEffects = [];
        }

        this.ignoreAdditionalEffects = ignoreAdditionalEffects;
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




