import {LayerEffect} from 'my-nft-gen/src/core/layer/LayerEffect.js';
import {getRandomFromArray, getRandomIntInclusive, randomId, randomNumber} from 'my-nft-gen/src/core/math/random.js';
import {Settings} from 'my-nft-gen/src/core/Settings.js';
import {CRTDegaussConfig} from './CRTDegaussConfig.js';
import sharp from "sharp";
import {promises as fs} from "fs";
import {findValue} from "my-nft-gen/src/core/math/findValue.js";
import {globalBufferPool} from 'my-nft-gen/src/core/pool/BufferPool.js';
import {Range} from 'my-nft-gen/src/core/layer/configType/Range.js';

/** *
 *
 * Pixelate Effect
 * Creates an animated glitch for the composite image
 * Can be glitched to appear on a percentage of the frames generated
 * Instantiated through the project via the LayerConfig
 *
 */

export class CRTDegaussEffect extends LayerEffect {
    static _name_ = 'crt-degauss-event';

    static presets = [
        {
            name: 'light-degauss-event',
            effect: 'crt-degauss-event',
            percentChance: 100,
            currentEffectConfig: {
                keyFrames: [0, 240, 720],
                glitchFrameCount: [10, 20],
                sectionHeight: [10, 30, 50],
                offset: new Range(3, 8),
                direction: [-1, 1],
                glitchTimes: new Range(1, 1),
                backgroundRed: new Range(0, 0),
                backgroundGreen: new Range(0, 0),
                backgroundBlue: new Range(0, 0),
                backgroundAlpha: new Range(1, 1),
                amount: new Range(0.2, 0.4),
            }
        },
        {
            name: 'medium-degauss-event',
            effect: 'crt-degauss-event',
            percentChance: 100,
            currentEffectConfig: {
                keyFrames: [0, 120, 360, 900],
                glitchFrameCount: [15, 30],
                sectionHeight: [5, 20, 30, 40, 50, 75],
                offset: new Range(5, 15),
                direction: [-1, 1],
                glitchTimes: new Range(1, 2),
                backgroundRed: new Range(0, 0),
                backgroundGreen: new Range(0, 0),
                backgroundBlue: new Range(0, 0),
                backgroundAlpha: new Range(1, 1),
                amount: new Range(0.4, 0.7),
            }
        },
        {
            name: 'heavy-degauss-event',
            effect: 'crt-degauss-event',
            percentChance: 100,
            currentEffectConfig: {
                keyFrames: [0, 60, 180, 360, 720],
                glitchFrameCount: [20, 45],
                sectionHeight: [5, 10, 15, 20, 30, 40, 50, 75, 100],
                offset: new Range(10, 30),
                direction: [-1, 1],
                glitchTimes: new Range(2, 4),
                backgroundRed: new Range(0, 0),
                backgroundGreen: new Range(0, 0),
                backgroundBlue: new Range(0, 0),
                backgroundAlpha: new Range(1, 1),
                amount: new Range(0.7, 1.2),
            }
        }
    ];

    constructor({
                    name = CRTDegaussEffect._name_,
                    requiresLayer = true,
                    config = new CRTDegaussConfig({}),
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

    async #applyDegaussEffect(image, amount) {
        return image
            .modulate({brightness: 1 + amount * 0.5, saturation: 1 + amount * 0.5})
            .gamma(1 + amount * 0.2); // Adjust the gamma value for effect
    };

    async #applyWobbleEffect(image, frame, index) {
        let {data, info} = await image.raw().toBuffer({resolveWithObject: true});

        // Create an empty buffer for the output image
        let outputBuffer = globalBufferPool.getBuffer(info.width, info.height, info.channels);

        let currentLine = 0;

        for (let rowIndex = 0; rowIndex < this.data.rows.length; rowIndex++) {
            for (let y = currentLine; y < currentLine + this.data.rows[rowIndex].sectionHeight && currentLine + this.data.rows[rowIndex].sectionHeight < this.data.height; y++) {

                let shiftX = Math.floor(findValue(0, this.data.rows[rowIndex].offset, this.data.rows[rowIndex].glitchTimes, this.data.keyFrameValues[index].glitchFrameCount, frame))

                shiftX *= this.data.rows[rowIndex].direction

                for (let x = 0; x < this.data.width; x++) {
                    // Calculate current pixel index (R, G, B, A channels)
                    const pixelIndex = (y * this.data.width + x) * 4;

                    // Calculate the shifted x position without wrapping
                    const shiftedX = x + shiftX;

                    if (shiftedX >= 0 && shiftedX < this.data.width) {
                        const shiftedPixelIndex = (y * this.data.width + shiftedX) * 4;

                        // Copy the RGBA values from the original image to the new position
                        outputBuffer[pixelIndex] = data[shiftedPixelIndex];       // Red
                        outputBuffer[pixelIndex + 1] = data[shiftedPixelIndex + 1]; // Green
                        outputBuffer[pixelIndex + 2] = data[shiftedPixelIndex + 2]; // Blue
                        outputBuffer[pixelIndex + 3] = data[shiftedPixelIndex + 3]; // Alpha
                    } else {
                        // Optionally, fill pixels that are shifted out of bounds with a background color or transparent
                        outputBuffer[pixelIndex] = this.data.backgroundRed;
                        outputBuffer[pixelIndex + 1] = this.data.backgroundGreen;
                        outputBuffer[pixelIndex + 2] = this.data.backgroundBlue;
                        outputBuffer[pixelIndex + 3] = Math.floor(this.data.backgroundAlpha * 255); // Alpha
                    }
                }
            }

            currentLine += this.data.rows[rowIndex].sectionHeight;
        }

        // Convert the buffer back into a PNG image
        let buffer = await sharp(outputBuffer, {
            raw: {
                width: this.data.width,
                height: this.data.height,
                channels: 4
            }
        }).png().toBuffer();

        // Return buffer to pool
        globalBufferPool.returnBuffer(outputBuffer, this.data.width, this.data.height, 4);

        const wobbled = sharp(buffer);

        return wobbled;
    };

    async #effect(layer, currentFrame, numberOfFrames) {
        for (let index = 0; index < this.data.keyFrames.length; index++) {

            if (currentFrame >= this.data.keyFrames[index] && currentFrame < this.data.keyFrames[index] + this.data.keyFrameValues[index].glitchFrameCount) {

                const filename = `${this.workingDirectory}crt-degauss${randomId()}.png`;
                const filenameOut = `${this.workingDirectory}crt-degauss-out${randomId()}.png`;
                await layer.toFile(filename);

                const image = sharp(filename);


                const degaussFrame = currentFrame - this.data.keyFrames[index];

                const amount = this.data.amount * Math.sin(((degaussFrame + 1) / this.data.keyFrameValues[index].glitchFrameCount) * Math.PI);

                let frameImage = await this.#applyDegaussEffect(image.clone(), amount);
                frameImage = await this.#applyWobbleEffect(frameImage, degaussFrame, index);

                await frameImage.toFile(filenameOut);

                await layer.fromFile(filenameOut);
                await fs.unlink(filenameOut);
                await fs.unlink(filename);
            }
        }
    }


    #generate(settings) {

        const data = {
            height: this.finalSize.height,
            width: this.finalSize.width,
            keyFrames: this.config.keyFrames,
            backgroundRed: getRandomIntInclusive(this.config.backgroundRed.lower, this.config.backgroundRed.upper),
            backgroundGreen: getRandomIntInclusive(this.config.backgroundGreen.lower, this.config.backgroundGreen.upper),
            backgroundBlue: getRandomIntInclusive(this.config.backgroundBlue.lower, this.config.backgroundBlue.upper),
            backgroundAlpha: randomNumber(this.config.backgroundAlpha.lower, this.config.backgroundAlpha.upper),
            amount: randomNumber(this.config.amount.lower, this.config.amount.upper),
        };

        const createRows = (data) => {
            const rows = [];
            let currentY = 0;

            while (currentY < data.height) {
                const row = {
                    sectionHeight: getRandomFromArray(this.config.sectionHeight),
                    offset: getRandomIntInclusive(this.config.offset.lower, this.config.offset.upper),
                    direction: getRandomFromArray(this.config.direction),
                    glitchTimes: getRandomIntInclusive(this.config.glitchTimes.lower, this.config.glitchTimes.upper),
                }

                currentY += row.sectionHeight;

                rows.push(row);
            }

            return rows
        }

        const createKeyFrameValues = (data) => {

            const keyFrameValues = [];

            for (let index = 0; index < data.keyFrames.length; index++) {
                const keyFrameValue = {
                    glitchFrameCount: getRandomFromArray(this.config.glitchFrameCount),
                }

                keyFrameValues.push(keyFrameValue);
            }

            return keyFrameValues;
        }

        data.rows = createRows(data);
        data.keyFrameValues = createKeyFrameValues(data);

        this.data = data;
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#effect(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.keyFrames.join(', ')} keyframe(s)`;
    }
}
