import {LayerEffect} from "../../LayerEffect.js";
import {GlobalSettings} from "../../../core/GlobalSettings.js";
import {getRandomIntInclusive, randomId} from "../../../core/math/random.js";
import fs from "fs";
import Jimp from "jimp";
import {findValue} from "../../../core/math/findValue.js";
import {Settings} from "../../../core/Settings.js";

export class PixelateEffect extends LayerEffect {

    static _name_ = 'pixelate';

    static _config_= {
        lowerRange: {lower: 0, upper: 0},
        upperRange: {lower: 3, upper: 6},
        times: {lower: 1, upper: 3},
        glitchChance: 80,
    };

    constructor({
                    name = PixelateEffect._name_,
                    requiresLayer = true,
                    config = PixelateEffect._config_,
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


    async #pixelate(layer, currentFrame, totalFrames) {
        const theGlitch = getRandomIntInclusive(0, 100);
        if (theGlitch <= this.data.glitchChance) {
            const filename = GlobalSettings.getWorkingDirectory() + 'pixelate' + randomId() + '.png';

            await layer.toFile(filename);

            const jimpImage = await Jimp.read(filename);

            const pixelateGaston = Math.floor(findValue(this.data.lower, this.data.upper, this.data.times, totalFrames, currentFrame));

            if (pixelateGaston > 0) {
                await jimpImage.pixelate(pixelateGaston);
            }

            await jimpImage.writeAsync(filename);

            await layer.fromFile(filename);

            fs.unlinkSync(filename);
        }
    }

    #generate(settings) {
        this.data =
            {
                glitchChance: this.config.glitchChance,
                lower: getRandomIntInclusive(this.config.lowerRange.lower, this.config.lowerRange.upper),
                upper: getRandomIntInclusive(this.config.upperRange.lower, this.config.upperRange.upper),
                times: getRandomIntInclusive(this.config.times.lower, this.config.times.upper),
                getInfo: () => {

                }
            }
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#pixelate(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.glitchChance} chance, ${this.data.times} times, ${this.data.lower} to ${this.data.upper}`
    }
}




