import { promises as fs } from 'fs';
import Jimp from 'jimp';
import { LayerEffect } from '../../../core/layer/LayerEffect.js';
import { getRandomIntInclusive, randomId } from '../../../core/math/random.js';
import { Settings } from '../../../core/Settings.js';
import { GlitchInverseConfig } from './GlitchInverseConfig.js';

/** *
 *
 * Glitch Inverse Effect
 * Inverts all colors for the composite image
 * Can be glitched to appear on a percentage of the frames generated
 * Instantiated through the project via the LayerConfig
 *
 */
export class GlitchInverseEffect extends LayerEffect {
    static _name_ = 'glitch-inverse';

    constructor({
        name = GlitchInverseEffect._name_,
        requiresLayer = true,
        config = new GlitchInverseConfig({}),
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

    async #glitchInverse(layer) {
        const theGlitch = getRandomIntInclusive(0, 100);
        if (theGlitch <= this.data.glitchChance) {
            const filename = `${this.workingDirectory}glitch-inverse${randomId()}.png`;

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
