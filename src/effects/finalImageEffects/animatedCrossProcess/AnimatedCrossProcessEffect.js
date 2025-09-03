import {promises as fs} from 'fs';
import Jimp from 'jimp';
import {LayerEffect} from '../../../core/layer/LayerEffect.js';
import {findValue} from '../../../core/math/findValue.js';
import {Settings} from '../../../core/Settings.js';
import {getRandomIntInclusive, randomNumber, randomId} from '../../../core/math/random.js';
import {AnimatedCrossProcessConfig} from './AnimatedCrossProcessConfig.js';

export class AnimatedCrossProcessEffect extends LayerEffect {
    static _name_ = 'animated-cross-process';

    constructor({
        name = AnimatedCrossProcessEffect._name_,
        requiresLayer = true,
        config = new AnimatedCrossProcessConfig({}),
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

    async #crossProcess(layer, currentFrame, totalFrames) {
        const filename = `${this.workingDirectory}cross${randomId()}.png`;
        await layer.toFile(filename);
        const jimpImage = await Jimp.read(filename);

        // Nonlinear channel mapping to simulate cross-processing
        jimpImage.scan(0, 0, jimpImage.bitmap.width, jimpImage.bitmap.height, function (x, y, idx) {
            const map = (val) => {
                if (val < 128) {
                    return Math.round((val * val) / 128);
                }
                const v = 255 - val;
                return Math.round(255 - (v * v) / 128);
            };
            this.bitmap.data[idx] = map(this.bitmap.data[idx]);
            this.bitmap.data[idx + 1] = map(this.bitmap.data[idx + 1]);
            this.bitmap.data[idx + 2] = map(this.bitmap.data[idx + 2]);
        });

        // Animate hue shift over time
        const hue = findValue(
            this.data.hueShiftRange.lower,
            this.data.hueShiftRange.upper,
            this.data.cycleSpeed,
            totalFrames,
            currentFrame
        );
        await jimpImage.color([{ apply: 'hue', params: [hue] }]);

        // Apply contrast adjustment
        if (this.data.contrast !== 0) {
            await jimpImage.contrast(this.data.contrast);
        }

        await jimpImage.writeAsync(filename);
        await layer.fromFile(filename);
        await fs.unlink(filename);
    }

    #generate(settings) {
        this.data = {
            hueShiftRange: {
                lower: this.config.hueShiftRange.lower,
                upper: this.config.hueShiftRange.upper,
            },
            contrast: randomNumber(this.config.contrast.lower, this.config.contrast.upper),
            cycleSpeed: getRandomIntInclusive(this.config.cycleSpeed.lower, this.config.cycleSpeed.upper),
        };
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#crossProcess(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: hue ${this.data.hueShiftRange.lower} to ${this.data.hueShiftRange.upper} ${this.data.cycleSpeed}x, contrast ${this.data.contrast.toFixed(2)}`;
    }
}
