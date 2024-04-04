import { promises as fs } from 'fs';
import Jimp from 'jimp';
import { LayerEffect } from '../../../core/layer/LayerEffect.js';
import { getRandomIntInclusive, randomId } from '../../../core/math/random.js';
import { Settings } from '../../../core/Settings.js';
import { RandomizeConfig } from './RandomizeConfig.js';

export class RandomizeEffect extends LayerEffect {
    static _name_ = 'randomize';

    constructor({
        name = RandomizeEffect._name_,
        requiresLayer = false,
        config = new RandomizeConfig({}),
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

    async #randomize(layer) {
        const filename = `${this.workingDirectory}randomize${randomId()}.png`;

        await layer.toFile(filename);

        const jimpImage = await Jimp.read(filename);

        await jimpImage.color(this.data.randomize);

        await jimpImage.writeAsync(filename);

        await layer.fromFile(filename);

        await fs.unlink(filename);
    }

    #generate(settings) {
        const props = {
            hue: getRandomIntInclusive(this.config.spin.lower, this.config.spin.upper),
            red: getRandomIntInclusive(this.config.red.lower, this.config.red.upper),
            green: getRandomIntInclusive(this.config.green.lower, this.config.green.upper),
            blue: getRandomIntInclusive(this.config.blue.lower, this.config.blue.upper),
        };

        this.data = {
            props,
            randomize: [
                {
                    apply: 'hue',
                    params: [props.hue],
                },
                {
                    apply: 'red',
                    params: [props.red],
                },
                {
                    apply: 'green',
                    params: [props.green],
                },
                {
                    apply: 'blue',
                    params: [props.blue],
                },
            ],
        };
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#randomize(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: hue: ${this.data.props.hue}, red: ${this.data.props.red}, green: ${this.data.props.green}, blue: ${this.data.props.blue}`;
    }
}
