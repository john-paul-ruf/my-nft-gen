import {LayerEffect} from "../../LayerEffect.js";
import {GlobalSettings} from "../../../core/GlobalSettings.js";
import {getRandomIntInclusive, randomId} from "../../../core/math/random.js";
import fs from "fs";
import Jimp from "jimp";
import {LayerFactory} from "../../../core/factory/layer/LayerFactory.js";

export class SingleLayerGlitchFractalEffect extends LayerEffect {

    static _name_ = 'single-layer-glitch-fractal';

    static _config_  = {
        theRandom: {lower: 12, upper: 12},
        glitchChance: 100,
    }

    constructor({
                    name = SingleLayerGlitchFractalEffect._name_,
                    requiresLayer = false,
                    config = SingleLayerGlitchFractalEffect._config_,
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


    async #glitchFractal(layer) {

        const theGlitch = getRandomIntInclusive(0, 100);
        if (theGlitch <= this.data.glitchChance) {
            const filename = GlobalSettings.getWorkingDirectory() + 'fractal' + randomId() + '_underlay.png';

            await layer.toFile(filename);

            const underlay = await Jimp.read(filename);

            /////////////////////
            // https://github.com/JKirchartz/Glitchy3bitdither/blob/master/source/glitches/fractal.js
            /////////////////////
            for (let j = 0; j < underlay.bitmap.data.length; j++) {
                if (parseInt(underlay.bitmap.data[(j * this.data.theRandom) % underlay.bitmap.data.length], 10) < parseInt(underlay.bitmap.data[j], 10)) {
                    underlay.bitmap.data[j] = underlay.bitmap.data[(j * this.data.theRandom) % underlay.bitmap.data.length];
                }
            }

            await underlay.writeAsync(filename)

            const compositeLayer = await LayerFactory.getLayerFromFile(filename);

            await compositeLayer.adjustLayerOpacity(0.9);

            await layer.compositeLayerOver(compositeLayer);

            fs.unlinkSync(filename);
        }
    }

    #generate(settings) {
        this.data = {
            glitchChance: this.config.glitchChance,
            theRandom: getRandomIntInclusive(this.config.theRandom.lower, this.config.theRandom.upper),
        }
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#glitchFractal(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name} ${this.data.glitchChance} chance, random: ${this.data.theRandom}`
    }
}



