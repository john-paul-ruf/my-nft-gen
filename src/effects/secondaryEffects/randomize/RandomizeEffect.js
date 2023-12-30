import {LayerEffect} from "../../LayerEffect.js";
import {getRandomIntInclusive, randomId} from "../../../core/math/random.js";
import fs from "fs";
import Jimp from "jimp";
import {Settings} from "../../../core/Settings.js";

export class RandomizeEffect extends LayerEffect {

    static _name_ = 'randomize';

    static _config_ = {
        spin: {lower: -8, upper: 8},
        red: {lower: -8, upper: 8},
        blue: {lower: -8, upper: 8},
        green: {lower: -8, upper: 8}
    }

    constructor({
                    name = RandomizeEffect._name_,
                    requiresLayer = false,
                    config = RandomizeEffect._config_,
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


    async #randomize(layer) {
        const filename = this.workingDirectory + 'randomize' + randomId() + '.png';

        await layer.toFile(filename);

        const jimpImage = await Jimp.read(filename);

        await jimpImage.color(this.data.randomize);

        await jimpImage.writeAsync(filename);

        await layer.fromFile(filename);

        fs.unlinkSync(filename)
    }

    #generate(settings) {
        const props = {
            hue: getRandomIntInclusive(this.config.spin.lower, this.config.spin.upper),
            red: getRandomIntInclusive(this.config.red.lower, this.config.red.upper),
            green: getRandomIntInclusive(this.config.green.lower, this.config.green.upper),
            blue: getRandomIntInclusive(this.config.blue.lower, this.config.blue.upper),
        }

        this.data = {
            props: props,
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
        return `${this.name}: hue: ${this.data.props.hue}, red: ${this.data.props.red}, green: ${this.data.props.green}, blue: ${this.data.props.blue}`
    }
}