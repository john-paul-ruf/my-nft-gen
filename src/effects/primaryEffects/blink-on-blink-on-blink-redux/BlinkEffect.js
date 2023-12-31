import {LayerEffect} from "../../LayerEffect.js";
import {findOneWayValue} from "../../../core/math/findOneWayValue.js";
import {LayerFactory} from "../../../core/factory/layer/LayerFactory.js";
import {getRandomIntInclusive, randomId} from "../../../core/math/random.js";
import {findValue} from "../../../core/math/findValue.js";
import fs from "fs";
import Jimp from "jimp";
import path from "path";
import {fileURLToPath} from "url";
import {Settings} from "../../../core/Settings.js";
import {BlinkConfig} from "./BlinkConfig.js";

export class BlinkOnEffect extends LayerEffect {

    static _name_ = 'blink-on-blink-on-blink-redux'

    constructor({
                    name = BlinkOnEffect._name_,
                    requiresLayer = true,
                    config = new BlinkConfig({}),
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


    async #randomize(layer, data, index) {
        const filename = this.workingDirectory + 'randomize-blink' + randomId() + '.png';

        await layer.toFile(filename);

        const jimpImage = await Jimp.read(filename);

        await jimpImage.color(data.blinkArray[index].randomize);

        await jimpImage.writeAsync(filename);

        await layer.fromFile(filename);

        fs.unlinkSync(filename)
    }

    async #glowAnimated(layer, data, currentFrame, totalFrames, index) {
        const filename =this.workingDirectory + 'glow-blink' + randomId() + '.png';

        await layer.toFile(filename);

        const jimpImage = await Jimp.read(filename);

        const hue = findValue(data.blinkArray[index].glowLowerRange, data.blinkArray[index].glowUpperRange, data.blinkArray[index].glowTimes, totalFrames, currentFrame)
        await jimpImage.color([{apply: 'hue', params: [hue]}]);

        await jimpImage.writeAsync(filename);

        await layer.fromFile(filename);

        fs.unlinkSync(filename)
    }

    async #blinkinate(data, currentFrame, totalFrames, index) {
        const scale = 1.1;
        const finalImageSize = this.finalSize;
        const blink = data.blinkArray[index];
        const fileName = this.workingDirectory + 'blink-in-action' + randomId() + '.png';
        const tempLayer = await LayerFactory.getLayerFromFile(data.blinkFile, this.fileConfig);
        await tempLayer.resize(blink.diameter, blink.diameter);

        const fullSizedLayer = await LayerFactory.getNewLayer(finalImageSize.longestSide * scale, finalImageSize.longestSide * scale, '#00000000', this.fileConfig);
        await fullSizedLayer.compositeLayerOver(tempLayer, false);

        await fullSizedLayer.toFile(fileName);

        const jimpImage = await Jimp.read(fileName);

        const rotateGaston = findOneWayValue(0, 360 * blink.rotationSpeedRange, totalFrames, currentFrame, blink.counterClockwise === 1);

        await jimpImage.rotate(data.blinkArray[index].initialRotation, false);
        await jimpImage.rotate(rotateGaston, false);

        await jimpImage.writeAsync(fileName);

        await fullSizedLayer.fromFile(fileName);

        await this.#randomize(fullSizedLayer, data, index);
        await this.#glowAnimated(fullSizedLayer, data, currentFrame, totalFrames, index);

        const top = Math.ceil(((finalImageSize.longestSide * scale) - finalImageSize.height) / 2);
        const left = Math.ceil(((finalImageSize.longestSide * scale) - finalImageSize.width) / 2);
        await fullSizedLayer.crop(left, top, finalImageSize.width, finalImageSize.height);

        await fullSizedLayer.toFile(fileName);

        return fileName;
    }

    async #blinkOnOverlay(layer, currentFrame, totalFrames) {

        const filenames = [];

        for (let i = 0; i < this.data.blinkArray.length; i++) {
            filenames.push(await this.#blinkinate(this.data, currentFrame, totalFrames, i));
        }

        for (let file of filenames) {
            await layer.compositeLayerOver(await LayerFactory.getLayerFromFile(file, this.fileConfig));
        }

        await layer.adjustLayerOpacity(this.data.layerOpacity);

        for (let file of filenames) {
            fs.unlinkSync(file)
        }
    }

    #generate(settings) {
        const data = {
            blinkFile: path.join(fileURLToPath(import.meta.url).replace('BlinkEffect.js', '') + 'blink.png'),
            layerOpacity: this.config.layerOpacity,
            numberOfBlinks: getRandomIntInclusive(this.config.numberOfBlinks.lower, this.config.numberOfBlinks.upper),
        }

        const computeInitialInfo = (num) => {
            const info = [];
            for (let i = 0; i <= num; i++) {
                const props = {
                    hue: getRandomIntInclusive(this.config.randomizeSpin.lower, this.config.randomizeSpin.upper),
                    red: getRandomIntInclusive(this.config.randomizeRed.lower, this.config.randomizeRed.upper),
                    green: getRandomIntInclusive(this.config.randomizeGreen.lower, this.config.randomizeGreen.upper),
                    blue: getRandomIntInclusive(this.config.randomizeBlue.lower, this.config.randomizeBlue.upper),
                }

                info.push({
                    initialRotation: getRandomIntInclusive(this.config.initialRotation.lower, this.config.initialRotation.upper),
                    rotationSpeedRange: getRandomIntInclusive(this.config.rotationSpeedRange.lower, this.config.rotationSpeedRange.upper),
                    counterClockwise: getRandomIntInclusive(this.config.counterClockwise.lower, this.config.counterClockwise.upper),
                    diameter: getRandomIntInclusive(this.config.diameterRange.lower(this.finalSize), this.config.diameterRange.upper(this.finalSize)),
                    glowLowerRange: getRandomIntInclusive(this.config.glowLowerRange.lower, this.config.glowLowerRange.upper),
                    glowUpperRange: getRandomIntInclusive(this.config.glowUpperRange.lower, this.config.glowUpperRange.upper),
                    glowTimes: getRandomIntInclusive(this.config.glowTimes.lower, this.config.glowTimes.upper),
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
                    ]
                });
            }
            return info;
        }

        data.blinkArray = computeInitialInfo(data.numberOfBlinks);

        this.data = data;
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#blinkOnOverlay(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.numberOfBlinks} blinks`
    }
}




