import path from 'path';
import { fileURLToPath } from 'url';
import { LayerEffect } from '../../../core/layer/LayerEffect.js';
import { LayerFactory } from '../../../core/factory/layer/LayerFactory.js';
import { Settings } from '../../../core/Settings.js';
import { PorousConfig } from './PorousConfig.js';

export class PorousEffect extends LayerEffect {
    static _name_ = 'porous.png';

    constructor({
        name = PorousEffect._name_,
        requiresLayer = true,
        config = new PorousConfig({}),
        additionalEffects = [],
        ignoreAdditionalEffects = false,
        settings = new Settings({}),
    }) {
        super({
            name,
            requiresLayer,
            config,
            additionalEffects,
            ignoreAdditionalEffects,
            settings,
        });
        this.#generate(settings);
    }

    async #porousOverlay(layer) {
        const tempLayer = await LayerFactory.getLayerFromFile(this.data.filename, this.fileConfig);
        const { finalSize } = this;
        await tempLayer.adjustLayerOpacity(this.data.layerOpacity);
        await tempLayer.resize(finalSize.height, finalSize.width, 'fill');
        await layer.compositeLayerOver(tempLayer);
    }

    #generate(settings) {
        this.data = {
            filename: path.join(`${fileURLToPath(import.meta.url).replace('PorousEffect.js', '')}porous.png`),
            layerOpacity: this.config.layerOpacity,
        };
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#porousOverlay(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}`;
    }
}
