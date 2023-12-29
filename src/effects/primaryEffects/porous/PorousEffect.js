import {LayerEffect} from "../../LayerEffect.js";
import {GlobalSettings} from "../../../core/GlobalSettings.js";
import path from "path";
import {fileURLToPath} from "url";
import {LayerFactory} from "../../../core/factory/layer/LayerFactory.js";
import {Settings} from "../../../core/Settings.js";

export class PorousEffect extends LayerEffect {

    static name = 'porous.png';

    constructor({
                    name = PorousEffect._name_,
                    requiresLayer = true,
                    config = {
                        layerOpacity: 0.5,
                    }
                },
                additionalEffects = [],
                ignoreAdditionalEffects = false,
                settings = new Settings({})) {
        super({name: name, requiresLayer: requiresLayer, config: config}, additionalEffects, ignoreAdditionalEffects, settings);
        this.#generate(settings)
    }


    async #porousOverlay(layer) {
        let tempLayer = await LayerFactory.getLayerFromFile(this.data.filename);
        const finalSize = GlobalSettings.getFinalImageSize();
        await tempLayer.adjustLayerOpacity(this.data.layerOpacity);
        await tempLayer.resize(finalSize.height, finalSize.width);
        await layer.compositeLayerOver(tempLayer)
    }

    #generate(settings) {
        this.data = {
            filename: path.join(fileURLToPath(import.meta.url).replace('PorousEffect.js', '') + 'porous.png'),
            layerOpacity: this.config.layerOpacity,
        }
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#porousOverlay(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}`
    }
}




