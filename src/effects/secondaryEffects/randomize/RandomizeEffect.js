import {LayerEffect} from "../../LayerEffect.js";
import {GlobalSettings} from "../../../core/GlobalSettings.js";
import {getRandomIntInclusive, randomId} from "../../../core/math/random.js";
import fs from "fs";
import Jimp from "jimp";

export class RandomizeEffect extends LayerEffect {
    constructor({
                    name = 'randomize',
                    requiresLayer = false,
                    config = {
                        spin: {lower: -8, upper: 8},
                        red: {lower: -8, upper: 8},
                        blue: {lower: -8, upper: 8},
                        green: {lower: -8, upper: 8}
                    }
                },
                additionalEffects = [],
                ignoreAdditionalEffects = false) {
        super({name: name, requiresLayer: requiresLayer, config: config}, additionalEffects, ignoreAdditionalEffects);
    }

    async #randomize(layer) {
        const filename = GlobalSettings.getWorkingDirectory() + 'randomize' + randomId() + '.png';

        await layer.toFile(filename);

        const jimpImage = await Jimp.read(filename);

        await jimpImage.color(this.data.randomize);

        await jimpImage.writeAsync(filename);

        await layer.fromFile(filename);

        fs.unlinkSync(filename)
    }

    async generate(settings) {

        super.generate(settings);

        const props = {
            hue: getRandomIntInclusive(this.config.spin.lower, this.config.spin.upper),
            red: getRandomIntInclusive(this.config.red.lower, this.config.red.upper),
            green: getRandomIntInclusive(this.config.green.lower, this.config.green.upper),
            blue: getRandomIntInclusive(this.config.blue.lower, this.config.blue.upper),
        }

        return {

            randomize: [
                {
                    apply: 'hue',
                    params: [props.hue]
                },
                {
                    apply: 'red',
                    params: [props.red]
                },
                {
                    apply: 'green',
                    params: [props.green]
                },
                {
                    apply: 'blue',
                    params: [props.blue]
                }
            ],
        }
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#randomize(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: hue: ${this.props.hue}, red: ${this.props.red}, green: ${this.props.green}, blue: ${this.props.blue}`
    }
}