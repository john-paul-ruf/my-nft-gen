import {LayerEffect} from "../../LayerEffect.js";
import {getRandomIntInclusive, randomId} from "../../../core/math/random.js";
import fs from "fs";
import Jimp from "jimp";
import {Settings} from "../../../core/Settings.js";

export class GlitchInverseEffect extends LayerEffect {

    static _name_ = 'glitch-inverse';

    static _config_= {
        glitchChance: 100,
    }

    constructor({
                    name = GlitchInverseEffect._name_,
                    requiresLayer = true,
                    config = GlitchInverseEffect._config_,
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


    async #glitchInverse(layer) {

        const theGlitch = getRandomIntInclusive(0, 100);
        if (theGlitch <= this.data.glitchChance) {
            const filename = this.workingDirectory + 'glitch-inverse' + randomId() + '.png';

            await layer.toFile(filename);

            const jimpImage = await Jimp.read(filename);

            await jimpImage.invert();

            await jimpImage.writeAsync(filename);

            await layer.fromFile(filename);

            fs.unlinkSync(filename);
        }
    }

    #generate(settings) {
        this.data = {
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




