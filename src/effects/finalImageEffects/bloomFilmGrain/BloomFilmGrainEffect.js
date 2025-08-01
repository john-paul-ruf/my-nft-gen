import {LayerEffect} from '../../../core/layer/LayerEffect.js';
import {getRandomFromArray, getRandomIntInclusive, randomId, randomNumber} from '../../../core/math/random.js';
import {findValue} from '../../../core/math/findValue.js';
import {Settings} from '../../../core/Settings.js';
import {BloomFilmGrainConfig} from './BloomFilmGrainConfig.js';
import sharp from "sharp";
import {createCanvas} from "canvas";
import {promises as fs} from "fs";

export class BloomFilmGrainEffect extends LayerEffect {
    static _name_ = 'bloom-film-grain';

    constructor({
                    name = BloomFilmGrainEffect._name_,
                    requiresLayer = true,
                    config = new BloomFilmGrainConfig({}),
                    additionalEffects = [],
                    ignoreAdditionalEffects = false,
                    settings = new Settings({}),
                }) {
        super({
            name, requiresLayer, config, additionalEffects, ignoreAdditionalEffects, settings,
        });

        this.finalSize = settings.finalSize;
        this.#generate(settings);

    }

    async #effect(layer, currentFrame, totalFrames) {


        const layerOut = `${this.workingDirectory}bloom-film-grain${randomId()}.png`;
        const bloomOut = `${this.workingDirectory}bloom-film-grain${randomId()}.png`;
        const finalOut = `${this.workingDirectory}bloom-film-grain${randomId()}.png`;

        const options = {
            brightness: findValue(this.data.brightnessRange.lower, this.data.brightnessRange.upper, this.data.brightnessTimes, totalFrames, currentFrame, this.data.brightnessFindValueAlgorithm),
            blur: findValue(this.data.blurRange.lower, this.data.blurRange.upper, this.data.blurTimes, totalFrames, currentFrame, this.data.blurFindValueAlgorithm),
            grain: findValue(this.data.grainRange.lower, this.data.grainRange.upper, this.data.grainTimes, totalFrames, currentFrame, this.data.grainFindValueAlgorithm),
            grainIntensity: findValue(this.data.grainIntensityRange.lower, this.data.grainIntensityRange.upper, this.data.grainIntensityTimes, totalFrames, currentFrame, this.data.grainIntensityFindValueAlgorithm),
        }

        await layer.toFile(layerOut);

        const original = sharp(layerOut);
        const glowLayer = original.clone()
            .blur(options.blur) // simulate glow by blurring
            .modulate({brightness: options.brightness}) // intensify glow

        await original
            .composite([{input: await glowLayer.toBuffer(), blend: 'screen'}])
            .toFile(bloomOut);

        // Create a noise buffer
        const createGrain = (width, height, intensity = 0.08) => {
            const canvas = createCanvas(width, height);
            const ctx = canvas.getContext('2d');
            const imageData = ctx.createImageData(width, height);

            for (let i = 0; i < imageData.data.length; i += 4) {
                const value = Math.floor(255 * (options.grain * intensity));
                imageData.data[i] = value;
                imageData.data[i + 1] = value;
                imageData.data[i + 2] = value;
                imageData.data[i + 3] = 255;
            }

            ctx.putImageData(imageData, 0, 0);
            return canvas.toBuffer('image/png');
        };

        const grainBuffer = createGrain(this.finalSize.width, this.finalSize.height, options.grainIntensity); // Match your image size

        await sharp(bloomOut)
            .composite([{input: grainBuffer, blend: 'overlay', opacity: 0.12}])
            .toFile(finalOut);

        layer.fromFile(finalOut);

        await fs.unlink(layerOut);
        await fs.unlink(bloomOut);
        await fs.unlink(finalOut);

    }

    #generate(settings) {
        this.data = {
            brightnessRange: {
                lower: randomNumber(this.config.brightnessRange.bottom.lower, this.config.brightnessRange.bottom.upper),
                upper: randomNumber(this.config.brightnessRange.top.lower, this.config.brightnessRange.top.upper),
            },
            brightnessTimes: getRandomIntInclusive(this.config.brightnessTimes.lower, this.config.brightnessTimes.upper),
            blurRange: {
                lower: randomNumber(this.config.blurRange.bottom.lower, this.config.blurRange.bottom.upper),
                upper: randomNumber(this.config.blurRange.top.lower, this.config.blurRange.top.upper),
            },
            blurTimes: getRandomIntInclusive(this.config.blurTimes.lower, this.config.blurTimes.upper),
            grainRange: {
                lower: randomNumber(this.config.grainRange.bottom.lower, this.config.grainRange.bottom.upper),
                upper: randomNumber(this.config.grainRange.top.lower, this.config.grainRange.top.upper),
            },
            grainTimes: getRandomIntInclusive(this.config.grainTimes.lower, this.config.grainTimes.upper),
            grainIntensityRange: {
                lower: randomNumber(this.config.grainIntensityRange.bottom.lower, this.config.grainIntensityRange.bottom.upper),
                upper: randomNumber(this.config.grainIntensityRange.top.lower, this.config.grainIntensityRange.top.upper),
            },
            grainIntensityTimes: getRandomIntInclusive(this.config.grainIntensityTimes.lower, this.config.grainIntensityTimes.upper),
            brightnessFindValueAlgorithm: getRandomFromArray(this.config.brightnessFindValueAlgorithm),
            blurFindValueAlgorithm: getRandomFromArray(this.config.blurFindValueAlgorithm),
            grainFindValueAlgorithm: getRandomFromArray(this.config.grainFindValueAlgorithm),
            grainIntensityFindValueAlgorithm: getRandomFromArray(this.config.grainIntensityFindValueAlgorithm),
        };
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#effect(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: 
            brightness ${this.data.brightnessRange.lower} to ${this.data.brightnessRange.upper} ${this.data.brightnessTimes} times
            blur ${this.data.blurRange.lower} to ${this.data.blurRange.upper} ${this.data.blurTimes} times
            grain ${this.data.grainRange.lower} to ${this.data.grainRange.upper} ${this.data.grainTimes} times
            grain intensity ${this.data.grainIntensityRange.lower} to ${this.data.grainIntensityRange.upper} ${this.data.grainIntensityTimes} times`;
    }
}
