import { promises as fs } from 'fs';
import Jimp from 'jimp';
import { getRandomIntInclusive, randomId } from '../../../core/math/random.js';
import { LayerFactory } from '../../../core/factory/layer/LayerFactory.js';
import { Settings } from '../../../core/Settings.js';
import { LayerEffect } from '../../../core/layer/LayerEffect.js';
import { GlitchFractalConfig } from './GlitchFractalConfig.js';

/** *
 *
 * Glitch Fractal Effect
 * Creates a static glitch for the composite image
 * Can be glitched to appear on a percentage of the frames generated
 * Instantiated through the project via the LayerConfig
 *
 */
export class GlitchFractalEffect extends LayerEffect {
    static _name_ = 'glitch-fractal';

    constructor({
        name = GlitchFractalEffect._name_,
        requiresLayer = true,
        config = new GlitchFractalConfig({}),
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

    async #glitchFractal(layer) {
        const theGlitch = getRandomIntInclusive(0, 100);
        if (theGlitch <= this.data.glitchChance) {
            const filename = `${this.workingDirectory}fractal${randomId()}_underlay.png`;

            await layer.toFile(filename);

            const underlay = await Jimp.read(filename);

            /// //////////////////
            // https://github.com/JKirchartz/Glitchy3bitdither/blob/master/source/glitches/fractal.js
            /// //////////////////
            for (let j = 0; j < underlay.bitmap.data.length; j++) {
                if (parseInt(underlay.bitmap.data[(j * this.data.theRandom) % underlay.bitmap.data.length], 10) < parseInt(underlay.bitmap.data[j], 10)) {
                    underlay.bitmap.data[j] = underlay.bitmap.data[(j * this.data.theRandom) % underlay.bitmap.data.length];
                }
            }

            await underlay.writeAsync(filename);

            const compositeLayer = await LayerFactory.getLayerFromFile(filename, this.fileConfig);

            await compositeLayer.adjustLayerOpacity(0.9);

            await layer.compositeLayerOver(compositeLayer);

            await fs.unlink(filename);
        }
    }

    #generate(settings) {
        this.data = {
            glitchChance: this.config.glitchChance,
            theRandom: getRandomIntInclusive(this.config.theRandom.lower, this.config.theRandom.upper),
        };
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#glitchFractal(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name} ${this.data.glitchChance} chance, random: ${this.data.theRandom}`;
    }
}
