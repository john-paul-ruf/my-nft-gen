import {promises as fs} from 'fs';
import Jimp from 'jimp';
import path from 'path';
import {fileURLToPath} from 'url';
import {LayerEffect} from '../../../core/layer/LayerEffect.js';
import {findOneWayValue} from '../../../core/math/findOneWayValue.js';
import {LayerFactory} from '../../../core/factory/layer/LayerFactory.js';
import {getRandomIntInclusive, randomId} from '../../../core/math/random.js';
import {findValue} from '../../../core/math/findValue.js';
import {Settings} from '../../../core/Settings.js';
import {BlinkOnConfig} from './BlinkOnConfig.js';

/** *
 *
 * BlinkOn Effect
 * Creates layers of blink.png.  Each blink can have the colors randomized and a glow effect applied
 *
 */


export class BlinkOnEffect extends LayerEffect {
    static _name_ = 'blink-on-blink-on-blink-redux';

    constructor({
                    name = BlinkOnEffect._name_,
                    requiresLayer = true,
                    config = new BlinkOnConfig({}),
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

    async #randomize(layer, data, index) {
        const filename = `${this.workingDirectory}randomize-blink${randomId()}.png`;

        await layer.toFile(filename);

        const jimpImage = await Jimp.read(filename);

        await jimpImage.color(data.blinkArray[index].randomize);

        await jimpImage.writeAsync(filename);

        await layer.fromFile(filename);

        await fs.unlink(filename);
    }

    async #glowAnimated(layer, data, currentFrame, totalFrames, index) {
        const filename = `${this.workingDirectory}glow-blink${randomId()}.png`;

        await layer.toFile(filename);

        const jimpImage = await Jimp.read(filename);

        const hue = findValue(data.blinkArray[index].glowLowerRange, data.blinkArray[index].glowUpperRange, data.blinkArray[index].glowTimes, totalFrames, currentFrame);
        await jimpImage.color([{apply: 'hue', params: [hue]}]);

        await jimpImage.writeAsync(filename);

        await layer.fromFile(filename);

        await fs.unlink(filename);
    }

    async #blinkinate(data, currentFrame, totalFrames, index) {


        const blink = data.blinkArray[index];
        const fileName = `${this.workingDirectory}blink-in-action${randomId()}.png`;

        const jimpImage = await Jimp.read(data.blinkFile);

        const rotateGaston = findOneWayValue(0, 360 * blink.rotationSpeedRange, 1, totalFrames, currentFrame, blink.counterClockwise);

        await jimpImage.rotate(blink.initialRotation + rotateGaston, false);

        await jimpImage.writeAsync(fileName);
        const blinkLayer = await LayerFactory.getLayerFromFile(fileName, this.fileConfig);

        await blinkLayer.resize(blink.diameter, blink.diameter, 'contain');

        if (blink.diameter > this.finalSize.width && blink.diameter > this.finalSize.height) {
            await blinkLayer.crop(Math.floor((blink.diameter - this.finalSize.width) / 2), Math.floor((blink.diameter - this.finalSize.height) / 2), this.finalSize.width, this.finalSize.height);
        } else if (blink.diameter > this.finalSize.width) {
            if (blink.diameter < this.finalSize.height) {
                await blinkLayer.crop(Math.floor((blink.diameter - this.finalSize.width) / 2), 0, this.finalSize.width, blink.diameter);
            } else {
                await blinkLayer.crop(Math.floor((blink.diameter - this.finalSize.width) / 2), 0, this.finalSize.width, this.finalSize.height);
            }
        } else if (blink.diameter > this.finalSize.height) {
            if (blink.diameter < this.finalSize.width) {
                await blinkLayer.crop(Math.floor((blink.diameter - this.finalSize.width) / 2), 0, blink.diameter, this.finalSize.height);
            } else {
                await blinkLayer.crop(0, Math.floor((blink.diameter - this.finalSize.height) / 2), this.finalSize.width, this.finalSize.height);
            }
        }

        const tempLayer = await LayerFactory.getNewLayer(
            this.finalSize.height,
            this.finalSize.width,
            '#00000000',
            this.fileConfig
        );

        await tempLayer.compositeLayerOver(blinkLayer, true);

        await this.#randomize(tempLayer, data, index);
        await this.#glowAnimated(tempLayer, data, currentFrame, totalFrames, index);

        await fs.unlink(fileName);

        return tempLayer;
    }

    async #blinkOnOverlay(layer, currentFrame, totalFrames) {
        const layers = [];

        for (let i = 0; i < this.data.blinkArray.length; i++) {
            layers.push(await this.#blinkinate(this.data, currentFrame, totalFrames, i));
        }

        for (const tempLayer of layers) {
            await tempLayer.adjustLayerOpacity(this.data.layerOpacity);
            await layer.compositeLayerOver(tempLayer);
        }
    }

    #generate(settings) {
        const data = {
            blinkFile: path.join(`${fileURLToPath(import.meta.url).replace('BlinkOnEffect.js', '')}blink.png`),
            layerOpacity: this.config.layerOpacity,
            numberOfBlinks: getRandomIntInclusive(this.config.numberOfBlinks.lower, this.config.numberOfBlinks.upper),
        };

        const computeInitialInfo = (num) => {
            const info = [];
            for (let i = 0; i < num; i++) {
                const props = {
                    hue: getRandomIntInclusive(this.config.randomizeSpin.lower, this.config.randomizeSpin.upper),
                    red: getRandomIntInclusive(this.config.randomizeRed.lower, this.config.randomizeRed.upper),
                    green: getRandomIntInclusive(this.config.randomizeGreen.lower, this.config.randomizeGreen.upper),
                    blue: getRandomIntInclusive(this.config.randomizeBlue.lower, this.config.randomizeBlue.upper),
                };

                info.push({
                    initialRotation: getRandomIntInclusive(this.config.initialRotation.lower, this.config.initialRotation.upper),
                    rotationSpeedRange: getRandomIntInclusive(this.config.rotationSpeedRange.lower, this.config.rotationSpeedRange.upper),
                    counterClockwise: i % 2 > 0,
                    diameter: getRandomIntInclusive(this.config.diameterRange.lower(this.finalSize), this.config.diameterRange.upper(this.finalSize)),
                    glowLowerRange: getRandomIntInclusive(this.config.glowLowerRange.lower, this.config.glowLowerRange.upper),
                    glowUpperRange: getRandomIntInclusive(this.config.glowUpperRange.lower, this.config.glowUpperRange.upper),
                    glowTimes: getRandomIntInclusive(this.config.glowTimes.lower, this.config.glowTimes.upper),
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
                });
            }
            return info;
        };

        data.blinkArray = computeInitialInfo(data.numberOfBlinks);

        this.data = data;
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#blinkOnOverlay(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.numberOfBlinks} blinks`;
    }
}
