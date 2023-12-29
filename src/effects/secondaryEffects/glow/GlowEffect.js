import {LayerEffect} from "../../LayerEffect.js";
import {GlobalSettings} from "../../../core/GlobalSettings.js";
import {getRandomIntInclusive, randomId} from "../../../core/math/random.js";
import fs from "fs";
import Jimp from "jimp";
import {findValue} from "../../../core/math/findValue.js";

export class GlowEffect extends LayerEffect {
    constructor({
                    name = 'glow',
                    requiresLayer = false,
                    config = {
                        lowerRange: {lower: -18, upper: -0},
                        upperRange: {lower: 0, upper: 18},
                        times: {lower: 2, upper: 6},
                    }
                },
                additionalEffects = [],
                ignoreAdditionalEffects = false) {
        super({name: name, requiresLayer: requiresLayer, config: config}, additionalEffects, ignoreAdditionalEffects);
    }

    async #glowAnimated(layer, currentFrame, totalFrames) {
        const filename = GlobalSettings.getWorkingDirectory() + 'glow' + randomId() + '.png';

        await layer.toFile(filename);

        const jimpImage = await Jimp.read(filename);

        const hue = findValue(this.data.lower, this.data.upper, this.data.times, totalFrames, currentFrame)
        await jimpImage.color([{apply: 'hue', params: [hue]}]);

        await jimpImage.writeAsync(filename);

        await layer.fromFile(filename);

        fs.unlinkSync(filename)
    }

    async generate(settings) {

        super.generate(settings);

        this.data = {
            lower: getRandomIntInclusive(this.config.lowerRange.lower, this.config.lowerRange.upper),
            upper: getRandomIntInclusive(this.config.upperRange.lower, this.config.upperRange.upper),
            times: getRandomIntInclusive(this.config.times.lower, this.config.times.upper),
        }
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#glowAnimated(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.times} times, ${this.data.lower} to ${this.data.upper}`
    }
}




