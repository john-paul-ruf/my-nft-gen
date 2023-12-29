import {LayerEffect} from "../../LayerEffect.js";
import {GlobalSettings} from "../../../core/GlobalSettings.js";
import path from "path";
import {fileURLToPath} from "url";
import {LayerFactory} from "../../../core/factory/layer/LayerFactory.js";
import {Settings} from "../../../core/Settings.js";

export class PorousEffect extends LayerEffect {

    static _name_ = 'porous.png';

    static _config_ = {
        layerOpacity: 0.5,
    }

    constructor({
                    name = PorousEffect._name_,
                    requiresLayer = true,
                    config = PorousEffect._config_,
                    additionalEffects = [],
                    ignoreAdditionalEffects = false,
                    settings = new Settings({})
                }) {
        super({
            name: name,
            requiresLayer: requiresLayer,
            config: config,
            additionalEffects: additionalEffects,
            ignoreAdditionalEffects: ignoreAdditionalEffects,
            settings: settings
        });
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




