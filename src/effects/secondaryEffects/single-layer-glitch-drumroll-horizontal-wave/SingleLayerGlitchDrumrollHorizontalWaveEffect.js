import {LayerEffect} from "../../LayerEffect.js";
import {GlobalSettings} from "../../../core/GlobalSettings.js";
import {getRandomIntInclusive, randomId} from "../../../core/math/random.js";
import {findValue} from "../../../core/math/findValue.js";
import Jimp from "jimp";
import fs from "fs";
import {Settings} from "../../../core/Settings.js";

export class SingleLayerGlitchDrumrollHorizontalWaveEffect extends LayerEffect {

    static _name_ = 'single-layer-glitch-drumroll-horizontal-wave';

    constructor({
                    name = SingleLayerGlitchDrumrollHorizontalWaveEffect._name_,
                    requiresLayer = false,
                    config = {
                        glitchChance: 100,
                        glitchOffset: {lower: 40, upper: 80},
                        glitchOffsetTimes: {lower: 1, upper: 3},
                        cosineFactor: {lower: 2, upper: 6}
                    }
                },
                additionalEffects = [],
                ignoreAdditionalEffects = false,
                settings = new Settings({})) {
        super({name: name, requiresLayer: requiresLayer, config: config}, additionalEffects, ignoreAdditionalEffects, settings);
        this.#generate(settings)
    }


    async #glitchDrumrollHorizontalWave(layer, currentFrame, totalFrames) {
        /////////////////////
        // https://github.com/JKirchartz/Glitchy3bitdither/blob/master/source/glitches/drumrollHorizontalWave.js
        /////////////////////
        // borrowed from https://github.com/ninoseki/glitched-canvas & modified with cosine

        const offsetGaston = Math.floor(findValue(0, this.data.glitchOffset, this.data.glitchOffsetTimes, totalFrames, currentFrame)) * 4;

        const finalImageSize = GlobalSettings.getFinalImageSize();
        const filename = GlobalSettings.getWorkingDirectory() + 'glitch-drumroll' + randomId() + '.png';

        await layer.toFile(filename)

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
                    let idx2 = (x2 + y * finalImageSize.width) * 4;

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

        fs.unlinkSync(filename);
    }


    #generate(settings) {

        const finalImageSize = GlobalSettings.getFinalImageSize();

        const getRoll = () => {

            const results = [];

            for (let x = 0; x < finalImageSize.width; x++) {
                results.push(Math.random());
            }
            return results;
        }

        this.data = {
            glitchChance: this.config.glitchChance,
            glitchOffset: getRandomIntInclusive(this.config.glitchOffset.lower, this.config.glitchOffset.upper),
            glitchOffsetTimes: getRandomIntInclusive(this.config.glitchOffsetTimes.lower, this.config.glitchOffsetTimes.upper),
            cosineFactor: getRandomIntInclusive(this.config.cosineFactor.lower, this.config.cosineFactor.upper),
            roll: getRoll(),
        }
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#glitchDrumrollHorizontalWave(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name} ${this.data.glitchChance} chance, ${this.data.glitchOffset} offset ${this.data.glitchOffsetTimes} times, cosine factor ${this.data.cosineFactor}`
    }
}




