import { promises as fs } from 'fs';
import Jimp from 'jimp';
import { LayerEffect } from 'my-nft-gen';
import { getRandomIntInclusive, randomId } from 'my-nft-gen/src/core/math/random.js';
import { findValue } from 'my-nft-gen/src/core/math/findValue.js';
import { Settings } from 'my-nft-gen/src/core/Settings.js';
import { PixelateConfig } from './PixelateConfig.js';
import { Range } from 'my-nft-gen/src/core/layer/configType/Range.js';

/** *
 *
 * Pixelate Effect
 * Creates an animated glitch for the composite image
 * Can be glitched to appear on a percentage of the frames generated
 * Instantiated through the project via the LayerConfig
 *
 */

export class PixelateEffect extends LayerEffect {
    static _name_ = 'pixelate';
    static configClass = PixelateConfig;

    static presets = [
        {
            name: 'retro-pixelate',
            effect: 'pixelate',
            percentChance: 100,
            currentEffectConfig: {
                lowerRange: new Range(0, 0),
                upperRange: new Range(2, 4),
                times: new Range(1, 2),
                glitchChance: 100
            }
        },
        {
            name: 'glitch-pixelate',
            effect: 'pixelate',
            percentChance: 100,
            currentEffectConfig: {
                lowerRange: new Range(0, 0),
                upperRange: new Range(3, 6),
                times: new Range(1, 3),
                glitchChance: 80
            }
        },
        {
            name: 'heavy-pixelate',
            effect: 'pixelate',
            percentChance: 100,
            currentEffectConfig: {
                lowerRange: new Range(0, 2),
                upperRange: new Range(8, 12),
                times: new Range(2, 4),
                glitchChance: 100
            }
        }
    ];

    constructor({
        name = PixelateEffect._name_,
        requiresLayer = true,
        config = new PixelateConfig({}),
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

    async #pixelate(layer, currentFrame, totalFrames) {
        const theGlitch = getRandomIntInclusive(0, 100);
        if (theGlitch <= this.data.glitchChance) {
            const filename = `${this.workingDirectory}pixelate${randomId()}.png`;

            await layer.toFile(filename);

            const jimpImage = await Jimp.read(filename);

            const pixelateGaston = Math.floor(findValue(this.data.lower, this.data.upper, this.data.times, totalFrames, currentFrame));

            if (pixelateGaston > 0) {
                await jimpImage.pixelate(pixelateGaston);
            }

            await jimpImage.writeAsync(filename);

            await layer.fromFile(filename);

            await fs.unlink(filename);
        }
    }

    #generate(settings) {
        this.data = {
            glitchChance: this.config.glitchChance,
            lower: getRandomIntInclusive(this.config.lowerRange.lower, this.config.lowerRange.upper),
            upper: getRandomIntInclusive(this.config.upperRange.lower, this.config.upperRange.upper),
            times: getRandomIntInclusive(this.config.times.lower, this.config.times.upper),
            getInfo: () => {

            },
        };
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#pixelate(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.glitchChance} chance, ${this.data.times} times, ${this.data.lower} to ${this.data.upper}`;
    }
}
