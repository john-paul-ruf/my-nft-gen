import {LayerEffect} from 'my-nft-gen/src/core/layer/LayerEffect.js';
import {getRandomFromArray, getRandomIntInclusive, randomId, randomNumber} from 'my-nft-gen/src/core/math/random.js';
import {findValue} from 'my-nft-gen/src/core/math/findValue.js';
import {Settings} from 'my-nft-gen/src/core/Settings.js';
import {BloomFilmGrainConfig} from './BloomFilmGrainConfig.js';
import {Range} from 'my-nft-gen/src/core/layer/configType/Range.js';
import {DynamicRange} from 'my-nft-gen/src/core/layer/configType/DynamicRange.js';
import sharp from "sharp";
import {promises as fs} from "fs";
import {globalBufferPool} from 'my-nft-gen/src/core/pool/BufferPool.js';
import {getAllFindValueAlgorithms} from "my-nft-gen/src/core/math/findValue.js";

export class BloomFilmGrainEffect extends LayerEffect {
    static _name_ = 'bloom-film-grain';
    static configClass = BloomFilmGrainConfig;

    static presets = [
        {
            name: 'subtle-bloom',
            effect: 'bloom-film-grain',
            percentChance: 100,
            currentEffectConfig: {
                brightnessRange: new DynamicRange(new Range(1.2, 1.3), new Range(1.4, 1.5)),
                brightnessTimes: new Range(1, 2),
                blurRange: new DynamicRange(new Range(5, 8), new Range(10, 12)),
                blurTimes: new Range(1, 2),
                grainRange: new DynamicRange(new Range(0.1, 0.2), new Range(0.3, 0.4)),
                grainTimes: new Range(1, 2),
                grainIntensityRange: new DynamicRange(new Range(0.04, 0.05), new Range(0.06, 0.08)),
                grainIntensityTimes: new Range(1, 2),
                brightnessFindValueAlgorithm: getAllFindValueAlgorithms(),
                blurFindValueAlgorithm: getAllFindValueAlgorithms(),
                grainFindValueAlgorithm: getAllFindValueAlgorithms(),
                grainIntensityFindValueAlgorithm: getAllFindValueAlgorithms(),
            }
        },
        {
            name: 'classic-bloom',
            effect: 'bloom-film-grain',
            percentChance: 100,
            currentEffectConfig: {
                brightnessRange: new DynamicRange(new Range(1.5, 1.5), new Range(2, 2)),
                brightnessTimes: new Range(2, 8),
                blurRange: new DynamicRange(new Range(12, 12), new Range(15, 15)),
                blurTimes: new Range(2, 8),
                grainRange: new DynamicRange(new Range(0.2, 0.4), new Range(0.5, 0.8)),
                grainTimes: new Range(2, 8),
                grainIntensityRange: new DynamicRange(new Range(0.08, 0.08), new Range(0.1, 0.1)),
                grainIntensityTimes: new Range(2, 8),
                brightnessFindValueAlgorithm: getAllFindValueAlgorithms(),
                blurFindValueAlgorithm: getAllFindValueAlgorithms(),
                grainFindValueAlgorithm: getAllFindValueAlgorithms(),
                grainIntensityFindValueAlgorithm: getAllFindValueAlgorithms(),
            }
        },
        {
            name: 'intense-bloom',
            effect: 'bloom-film-grain',
            percentChance: 100,
            currentEffectConfig: {
                brightnessRange: new DynamicRange(new Range(2, 2.5), new Range(3, 3.5)),
                brightnessTimes: new Range(3, 12),
                blurRange: new DynamicRange(new Range(18, 22), new Range(25, 30)),
                blurTimes: new Range(3, 12),
                grainRange: new DynamicRange(new Range(0.6, 0.8), new Range(1, 1.2)),
                grainTimes: new Range(3, 12),
                grainIntensityRange: new DynamicRange(new Range(0.12, 0.15), new Range(0.18, 0.2)),
                grainIntensityTimes: new Range(3, 12),
                brightnessFindValueAlgorithm: getAllFindValueAlgorithms(),
                blurFindValueAlgorithm: getAllFindValueAlgorithms(),
                grainFindValueAlgorithm: getAllFindValueAlgorithms(),
                grainIntensityFindValueAlgorithm: getAllFindValueAlgorithms(),
            }
        }
    ];

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

        // Create grain buffer using Sharp instead of Canvas
        const createGrainBuffer = (width, height, intensity = 0.08) => {
            const grainBuffer = globalBufferPool.getBuffer(width, height, 4);
            
            for (let i = 0; i < grainBuffer.length; i += 4) {
                const noise = (Math.random() - 0.5) * 2; // -1 to 1
                const value = Math.floor(128 + noise * 127 * options.grain * intensity);
                const clampedValue = Math.max(0, Math.min(255, value));
                
                grainBuffer[i] = clampedValue;     // R
                grainBuffer[i + 1] = clampedValue; // G  
                grainBuffer[i + 2] = clampedValue; // B
                grainBuffer[i + 3] = 255;          // A
            }
            
            return grainBuffer;
        };

        const grainBuffer = createGrainBuffer(this.finalSize.width, this.finalSize.height, options.grainIntensity);

        await sharp(bloomOut)
            .composite([{
                input: grainBuffer, 
                raw: { width: this.finalSize.width, height: this.finalSize.height, channels: 4 },
                blend: 'overlay', 
                opacity: 0.12
            }])
            .toFile(finalOut);

        layer.fromFile(finalOut);

        // Return buffer to pool
        globalBufferPool.returnBuffer(grainBuffer, this.finalSize.width, this.finalSize.height, 4);

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
