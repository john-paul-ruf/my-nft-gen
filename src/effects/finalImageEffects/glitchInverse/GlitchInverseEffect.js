import {LayerEffect} from "../../LayerEffect.js";
import {GlobalSettings} from "../../../core/GlobalSettings.js";
import {getRandomIntInclusive, randomId} from "../../../core/math/random.js";
import fs from "fs";
import Jimp from "jimp";

export class GlitchInverseEffect extends LayerEffect {
    constructor({
                    name = 'glitch-inverse',
                    requiresLayer = true,
                    config = {
                        glitchChance: 100,
                    }
                },
                additionalEffects = [],
                ignoreAdditionalEffects = false) {
        super({name: name, requiresLayer: requiresLayer, config: config}, additionalEffects, ignoreAdditionalEffects);
    }

    async #glitchInverse(layer) {

        const theGlitch = getRandomIntInclusive(0, 100);
        if (theGlitch <= this.data.glitchChance) {
            const filename = GlobalSettings.getWorkingDirectory() + 'glitch-inverse' + randomId() + '.png';

            await layer.toFile(filename);

            const jimpImage = await Jimp.read(filename);

            await jimpImage.invert();

            await jimpImage.writeAsync(filename);

            await layer.fromFile(filename);

            fs.unlinkSync(filename);
        }
    }

    async generate(settings) {

        super.generate(settings);

        return {
            glitchChance: this.config.glitchChance,
        };
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#glitchInverse(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name} ${this.config.glitchChance} chance`;
    }
}




