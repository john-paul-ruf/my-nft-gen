import {LayerEffect} from "../../LayerEffect.js";

import {getRandomIntInclusive, randomId} from "../../../core/math/random.js";
import fs from "fs";
import Jimp from "jimp";
import {Settings} from "../../../core/Settings.js";
import {AnimateBackgroundConfig} from "./AnimateBackgroundConfig.js";

export class AnimateBackgroundEffect extends LayerEffect {

    static _name_ = 'animated-background'

    constructor({
                    name = AnimateBackgroundEffect._name_,
                    requiresLayer = true,
                    config = new AnimateBackgroundConfig({}),
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


    async #animateBackground(layer) {
        const filename = this.workingDirectory + 'static' + randomId() + '.png';

        const jimpImage = new Jimp(this.data.width, this.data.height);

        for (let x = 0; x < this.data.width; x++) {
            for (let y = 0; y < this.data.height; y++) {
                const rando = getRandomIntInclusive(0, 20)
                if (rando < 15) {
                    await jimpImage.setPixelColor(Jimp.cssColorToHex(this.data.color1), x, y)
                } else if (rando < 19) {
                    await jimpImage.setPixelColor(Jimp.cssColorToHex(this.data.color2), x, y)
                } else {
                    await jimpImage.setPixelColor(Jimp.cssColorToHex(this.data.color3), x, y)
                }
            }
        }

        await jimpImage.writeAsync(filename)

        await layer.fromFile(filename);

        await layer.blur(1)

        fs.unlinkSync(filename);
    }

    #generate(settings) {
        const finalImageSize = this.finalSize;
        this.data = {
            width: finalImageSize.width,
            height: finalImageSize.height,
            color1: settings.getNeutralFromBucket(),
            color2: settings.getNeutralFromBucket(),
            color3: settings.getColorFromBucket(),
        };
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#animateBackground(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return 'animated-background'
    }
}




