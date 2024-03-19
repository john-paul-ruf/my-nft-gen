import {LayerEffect} from "../../../core/layer/LayerEffect.js";
import {getRandomIntInclusive, randomId} from "../../../core/math/random.js";
import { promises as fs } from 'fs'
import Jimp from "jimp";
import {Settings} from "../../../core/Settings.js";
import {GlitchInverseConfig} from "./GlitchInverseConfig.js";

export class GlitchInverseEffect extends LayerEffect {

    static _name_ = 'glitch-inverse';

    constructor({
                    name = GlitchInverseEffect._name_,
                    requiresLayer = true,
                    config = new GlitchInverseConfig({}),
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

            await fs.unlink(filename);
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




