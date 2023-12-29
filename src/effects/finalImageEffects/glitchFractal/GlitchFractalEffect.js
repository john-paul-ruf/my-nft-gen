import {LayerEffect} from "../../LayerEffect.js";
import {GlobalSettings} from "../../../core/GlobalSettings.js";
import {getRandomIntInclusive, randomId} from "../../../core/math/random.js";
import fs from "fs";
import Jimp from "jimp";
import {LayerFactory} from "../../../core/factory/layer/LayerFactory.js";

export class GlitchFractalEffect extends LayerEffect {
    constructor({
                    name = 'glitch-fractal',
                    requiresLayer = true,
                    config = {
                        theRandom: {lower: 5, upper: 10},
                        glitchChance: 100,
                    }
                },
                additionalEffects = [],
                ignoreAdditionalEffects = false) {
        super({name: name, requiresLayer: requiresLayer, config: config}, additionalEffects, ignoreAdditionalEffects);
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

    async generate(settings) {

        super.generate(settings);

        this.data = {
            glitchChance: this.config.glitchChance,
            theRandom: getRandomIntInclusive(this.config.theRandom.lower, this.config.theRandom.upper),
        }
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#glitchFractal(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name} ${this.data.glitchChance} chance, random: ${this.data.theRandom}`
    }
}




