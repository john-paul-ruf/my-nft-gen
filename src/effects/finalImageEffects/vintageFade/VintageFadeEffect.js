import {LayerEffect} from '../../../core/layer/LayerEffect.js';
import {getRandomFromArray, getRandomIntInclusive, randomId, randomNumber} from '../../../core/math/random.js';
import {findValue} from '../../../core/math/findValue.js';
import {Settings} from '../../../core/Settings.js';
import {VintageFadeConfig} from './VintageFadeConfig.js';
import sharp from 'sharp';
import {promises as fs} from 'fs';
import {globalBufferPool} from '../../../core/pool/BufferPool.js';

export class VintageFadeEffect extends LayerEffect {
    static _name_ = 'vintage-fade';

    constructor({
                    name = VintageFadeEffect._name_,
                    requiresLayer = true,
                    config = new VintageFadeConfig({}),
                    additionalEffects = [],
                    ignoreAdditionalEffects = false,
                    settings = new Settings({}),
                } = {}) {
        super({name, requiresLayer, config, additionalEffects, ignoreAdditionalEffects, settings});
        this.finalSize = settings.finalSize;
        this.#generate(settings);
    }

    #createGrainBuffer(width, height, intensity) {
        const buf = globalBufferPool.getBuffer(width, height, 4);
        for (let i = 0; i < buf.length; i += 4) {
            const noise = (Math.random() - 0.5) * 2; // -1 to 1
            const value = Math.floor(128 + noise * 127 * intensity);
            const clamped = Math.max(0, Math.min(255, value));
            buf[i] = clamped;
            buf[i + 1] = clamped;
            buf[i + 2] = clamped;
            buf[i + 3] = 255;
        }
        return buf;
    }

    async #effect(layer, currentFrame, totalFrames) {
        const layerOut = `${this.workingDirectory}vintage-fade${randomId()}.png`;
        const finalOut = `${this.workingDirectory}vintage-fade${randomId()}.png`;

        await layer.toFile(layerOut);

        const warmBuffer = await sharp({
            create: {
                width: this.finalSize.width,
                height: this.finalSize.height,
                channels: 4,
                background: { r: 255, g: 200, b: 150, alpha: Math.round(this.data.warmth * 255) }
            }
        }).png().toBuffer();

        const grainBuffer = this.#createGrainBuffer(this.finalSize.width, this.finalSize.height, this.data.grainIntensity);
        const grainOpacity = findValue(0, 1, this.data.flickerSpeed, totalFrames, currentFrame, this.data.flickerFindValueAlgorithm);

        await sharp(layerOut)
            .composite([
                { input: warmBuffer, blend: 'overlay' },
                {
                    input: grainBuffer,
                    raw: { width: this.finalSize.width, height: this.finalSize.height, channels: 4 },
                    blend: 'overlay',
                    opacity: grainOpacity
                }
            ])
            .toFile(finalOut);

        layer.fromFile(finalOut);

        globalBufferPool.returnBuffer(grainBuffer, this.finalSize.width, this.finalSize.height, 4);

        await fs.unlink(layerOut);
        await fs.unlink(finalOut);
    }

    #generate(settings) {
        this.data = {
            warmth: randomNumber(this.config.warmth.lower, this.config.warmth.upper),
            grainIntensity: randomNumber(this.config.grainIntensity.lower, this.config.grainIntensity.upper),
            flickerSpeed: getRandomIntInclusive(this.config.flickerSpeed.lower, this.config.flickerSpeed.upper),
            flickerFindValueAlgorithm: getRandomFromArray(this.config.flickerFindValueAlgorithm),
        };
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#effect(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: warmth ${this.data.warmth.toFixed(2)}, grain ${this.data.grainIntensity.toFixed(2)}, flicker ${this.data.flickerSpeed} times`;
    }
}
