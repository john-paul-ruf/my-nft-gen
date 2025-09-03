import { promises as fs } from 'fs';
import Jimp from 'jimp';
import { LayerEffect } from '../../../core/layer/LayerEffect.js';
import { getRandomIntInclusive, randomId } from '../../../core/math/random.js';
import { findValue } from '../../../core/math/findValue.js';
import { Settings } from '../../../core/Settings.js';
import { ChromaticAberrationConfig } from './ChromaticAberrationConfig.js';

/**
 * Chromatic Aberration Effect
 * Renders red, green and blue channel copies offset from each other.
 * Can be glitched to appear on a percentage of the frames generated.
 * Instantiated through the project via the LayerConfig.
 */
export class ChromaticAberrationEffect extends LayerEffect {
    static _name_ = 'chromatic-aberration';

    constructor({
        name = ChromaticAberrationEffect._name_,
        requiresLayer = true,
        config = new ChromaticAberrationConfig({}),
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

    async #chromaticAberration(layer, currentFrame, totalFrames) {
        const theGlitch = getRandomIntInclusive(0, 100);
        if (theGlitch > this.data.glitchChance) {
            return;
        }

        const filename = `${this.workingDirectory}chromatic-aberration${randomId()}.png`;

        await layer.toFile(filename);

        const base = await Jimp.read(filename);
        const width = base.bitmap.width;
        const height = base.bitmap.height;

        const offset = Math.floor(findValue(0, this.data.offset, 1, totalFrames, currentFrame));

        const red = base.clone();
        red.scan(0, 0, width, height, function (x, y, idx) {
            this.bitmap.data[idx + 1] = 0;
            this.bitmap.data[idx + 2] = 0;
        });

        const green = base.clone();
        green.scan(0, 0, width, height, function (x, y, idx) {
            this.bitmap.data[idx + 0] = 0;
            this.bitmap.data[idx + 2] = 0;
        });

        const blue = base.clone();
        blue.scan(0, 0, width, height, function (x, y, idx) {
            this.bitmap.data[idx + 0] = 0;
            this.bitmap.data[idx + 1] = 0;
        });

        const output = new Jimp(width, height, 0x00000000);
        output.composite(red, offset, 0);
        output.composite(green, -offset, 0);
        output.composite(blue, 0, 0);

        await output.writeAsync(filename);
        await layer.fromFile(filename);
        await fs.unlink(filename);
    }

    #generate(settings) {
        this.data = {
            glitchChance: this.config.glitchChance,
            offset: getRandomIntInclusive(
                this.config.offsetRange.lower,
                this.config.offsetRange.upper,
            ),
            getInfo: () => {},
        };
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#chromaticAberration(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.glitchChance} chance, offset up to ${this.data.offset}`;
    }
}
