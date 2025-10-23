import { promises as fs } from 'fs';
import Jimp from 'jimp';
import { LayerEffect } from 'my-nft-gen';
import { getRandomIntInclusive, randomId } from 'my-nft-gen/src/core/math/random.js';
import { findValue } from 'my-nft-gen/src/core/math/findValue.js';
import { Settings } from 'my-nft-gen/src/core/Settings.js';
import { GlitchDrumrollHorizontalWaveConfig } from './GlitchDrumrollHorizontalWaveConfig.js';
import { Range } from 'my-nft-gen/src/core/layer/configType/Range.js';

/** *
 *
 * Glitch Drumroll Horizontal Wave Effect
 * Creates an animated glitch for the composite image
 * Can be glitched to appear on a percentage of the frames generated
 * Instantiated through the project via the LayerConfig
 *
 */
export class GlitchDrumrollHorizontalWaveEffect extends LayerEffect {
    static _name_ = 'glitch-drumroll-horizontal-wave';

    static presets = [
        {
            name: 'subtle-wave',
            effect: 'glitch-drumroll-horizontal-wave',
            percentChance: 100,
            currentEffectConfig: {
                glitchChance: 30,
                glitchOffset: new Range(20, 40),
                glitchOffsetTimes: new Range(1, 2),
                cosineFactor: new Range(1, 3),
            }
        },
        {
            name: 'medium-wave',
            effect: 'glitch-drumroll-horizontal-wave',
            percentChance: 100,
            currentEffectConfig: {
                glitchChance: 100,
                glitchOffset: new Range(40, 80),
                glitchOffsetTimes: new Range(1, 3),
                cosineFactor: new Range(2, 6),
            }
        },
        {
            name: 'intense-wave',
            effect: 'glitch-drumroll-horizontal-wave',
            percentChance: 100,
            currentEffectConfig: {
                glitchChance: 100,
                glitchOffset: new Range(80, 150),
                glitchOffsetTimes: new Range(3, 6),
                cosineFactor: new Range(4, 10),
            }
        }
    ];

    constructor({
        name = GlitchDrumrollHorizontalWaveEffect._name_,
        requiresLayer = true,
        config = new GlitchDrumrollHorizontalWaveConfig({}),
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

    async #glitchDrumrollHorizontalWave(layer, currentFrame, totalFrames) {
    /// //////////////////
    // https://github.com/JKirchartz/Glitchy3bitdither/blob/master/source/glitches/drumrollHorizontalWave.js
    /// //////////////////
    // borrowed from https://github.com/ninoseki/glitched-canvas & modified with cosine

        const offsetGaston = Math.floor(findValue(0, this.data.glitchOffset, this.data.glitchOffsetTimes, totalFrames, currentFrame)) * 4;

        const finalImageSize = this.finalSize;
        const filename = `${this.workingDirectory}glitch-drumroll${randomId()}.png`;

        await layer.toFile(filename);

        const jimpImage = await Jimp.read(filename);

        const imgData = jimpImage.bitmap.data;

        let roll = 0;

        const theGlitch = getRandomIntInclusive(0, 100);
        if (theGlitch <= this.data.glitchChance) {
            for (let x = 0; x < finalImageSize.width; x++) {
                const rollIndex = x;
                if (this.data.roll[rollIndex] > 0.96) roll = Math.floor(Math.cos(x) * (finalImageSize.width * this.data.cosineFactor));
                if (this.data.roll[rollIndex] > 0.98) roll = 0;

                for (let y = 0; y < finalImageSize.height; y++) {
                    let idx = (x + y * finalImageSize.width) * 4;

                    let x2 = x + roll;
                    if (x2 > finalImageSize.width - 1) x2 -= finalImageSize.width;
                    const idx2 = (x2 + y * finalImageSize.width) * 4;

                    idx += offsetGaston;

                    for (let c = 0; c < 4; c++) {
                        imgData[idx2 + c] = imgData[idx + c];
                    }
                }
            }
        }

        jimpImage.bitmap.data = Buffer.from(imgData);
        await jimpImage.writeAsync(filename);

        await layer.fromFile(filename);

        await fs.unlink(filename);
    }

    #generate(settings) {
        const getRoll = () => {
            const results = [];

            for (let x = 0; x < this.finalSize.width; x++) {
                results.push(Math.random());
            }
            return results;
        };

        this.data = {
            glitchChance: this.config.glitchChance,
            glitchOffset: getRandomIntInclusive(this.config.glitchOffset.lower, this.config.glitchOffset.upper),
            glitchOffsetTimes: getRandomIntInclusive(this.config.glitchOffsetTimes.lower, this.config.glitchOffsetTimes.upper),
            cosineFactor: getRandomIntInclusive(this.config.cosineFactor.lower, this.config.cosineFactor.upper),
            roll: getRoll(),
        };
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#glitchDrumrollHorizontalWave(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name} ${this.data.glitchChance} chance, ${this.data.glitchOffset} offset ${this.data.glitchOffsetTimes} times, cosine factor ${this.data.cosineFactor}`;
    }
}
