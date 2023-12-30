import {LayerEffect} from "../../LayerEffect.js";
import {getRandomIntInclusive, randomId} from "../../../core/math/random.js";
import fs from "fs";
import Jimp from "jimp";
import {findValue} from "../../../core/math/findValue.js";
import {Settings} from "../../../core/Settings.js";

export class GlowEffect extends LayerEffect {

    static _name_ = 'glow';

    static _config_ =  {
        lowerRange: {lower: -18, upper: -0},
        upperRange: {lower: 0, upper: 18},
        times: {lower: 2, upper: 6},
    }

    constructor({
                    name = GlowEffect._name_,
                    requiresLayer = false,
                    config = GlowEffect._config_,
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


    async #glowAnimated(layer, currentFrame, totalFrames) {
        const filename = this.workingDirectory + 'glow' + randomId() + '.png';

        await layer.toFile(filename);

        const jimpImage = await Jimp.read(filename);

        const hue = findValue(this.data.lower, this.data.upper, this.data.times, totalFrames, currentFrame)
        await jimpImage.color([{apply: 'hue', params: [hue]}]);

        await jimpImage.writeAsync(filename);

        await layer.fromFile(filename);

        fs.unlinkSync(filename)
    }

    #generate(settings) {
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




