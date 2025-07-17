import {LayerEffect} from '../../../core/layer/LayerEffect.js';
import {getRandomIntInclusive, randomId, randomNumber} from '../../../core/math/random.js';
import {Settings} from '../../../core/Settings.js';
import {CRTScanLinesConfig} from './CRTScanLinesConfig.js';
import sharp from "sharp";
import {promises as fs} from "fs";
import {findValue} from "../../../core/math/findValue.js";

/** *
 *
 * Pixelate Effect
 * Creates an animated glitch for the composite image
 * Can be glitched to appear on a percentage of the frames generated
 * Instantiated through the project via the LayerConfig
 *
 */

export class CRTScanLinesEffect extends LayerEffect {
    static _name_ = 'crt-scan-lines';

    constructor({
                    name = CRTScanLinesEffect._name_,
                    requiresLayer = true,
                    config = new CRTScanLinesConfig({}),
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

    async #applyScanline(imageData, context, startY, i) {

        // Create a high-precision buffer for intermediate calculations
        const highPrecisionData = new Float32Array(imageData.length);
        for (let j = 0; j < imageData.length; j++) {
            highPrecisionData[j] = imageData[j]; // Copy original data into Float32Array
        }

        const {width, height, lineInfo} = context.data;
        const {thicknessRange, thicknessTimes, lineBlurRange, lineBlurTimes, brightnessRange, brightnessTimes, colorTintRange, colorTintTimes, opacityRange, opacityTimes} = lineInfo[i];

        const opacityGaston = findValue(opacityRange.lower, opacityRange.upper, opacityTimes, context.numberOfFrames, context.currentFrame);
        const thicknessGaston = findValue(thicknessRange.lower, thicknessRange.upper, thicknessTimes, context.numberOfFrames, context.currentFrame);
        const lineBlurGaston = findValue(lineBlurRange.lower, lineBlurRange.upper, lineBlurTimes, context.numberOfFrames, context.currentFrame);
        const brightnessGaston = findValue(brightnessRange.lower, brightnessRange.upper, brightnessTimes, context.numberOfFrames, context.currentFrame);

        const colorTint = {
            r: findValue(colorTintRange.redRange.lower, colorTintRange.redRange.upper, colorTintTimes, context.numberOfFrames, context.currentFrame),
            g: findValue(colorTintRange.greenRange.lower, colorTintRange.greenRange.upper, colorTintTimes, context.numberOfFrames, context.currentFrame),
            b: findValue(colorTintRange.blueRange.lower, colorTintRange.blueRange.upper, colorTintTimes, context.numberOfFrames, context.currentFrame),
        }


        for (let y = startY; y < startY + thicknessGaston && y < height; y++) {
            const distanceFromCenter = Math.abs(y - startY - thicknessGaston / 2);
            const blendFactor = Math.pow(Math.max(0, 1 - distanceFromCenter / lineBlurGaston), 2); // Exponential blend
            const brightnessAdjustment = brightnessGaston * blendFactor;

            const alpha = Math.min(Math.max(opacityGaston ?? 1, 0), 1); // Clamp opacity between 0 and 1

            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4; // RGBA index

                // Original RGB values from the high-precision buffer
                const originalRed = highPrecisionData[index];
                const originalGreen = highPrecisionData[index + 1];
                const originalBlue = highPrecisionData[index + 2];

                // Adjusted RGB values
                const newRed = Math.min(
                    255,
                    originalRed + brightnessAdjustment * colorTint.r
                );
                const newGreen = Math.min(
                    255,
                    originalGreen + brightnessAdjustment * colorTint.g
                );
                const newBlue = Math.min(
                    255,
                    originalBlue + brightnessAdjustment * colorTint.b
                );

                // Blend with alpha
                highPrecisionData[index] =
                    originalRed * (1 - alpha) + newRed * alpha; // Red
                highPrecisionData[index + 1] =
                    originalGreen * (1 - alpha) + newGreen * alpha; // Green
                highPrecisionData[index + 2] =
                    originalBlue * (1 - alpha) + newBlue * alpha; // Blue
            }
        }

        // Convert back to Uint8Array for the final result
        const resultData = new Uint8Array(imageData.length);
        for (let j = 0; j < imageData.length; j++) {
            resultData[j] = Math.round(highPrecisionData[j]); // Round and store in Uint8Array
        }

        return resultData;
    }


    async #computeY(context, numberOfFrames, currentFrame, i) {
        const displacement = (context.data.height / numberOfFrames) * ((currentFrame + 1) * context.data.lineInfo[i].loopTimes);
        let y = Math.round(context.data.lineInfo[i].lineStart + displacement);

        if (y > context.data.height) {
            y %= context.data.height;
        }
        return Math.round(y);
    }

    async #crtScanLines(layer, currentFrame, numberOfFrames) {

        const context = {
            data: this.data,
            numberOfFrames,
            currentFrame
        }

        const filename = `${this.workingDirectory}crt-scan-lines${randomId()}.png`;
        const filenameOut = `${this.workingDirectory}crt-scan-lines-out${randomId()}.png`;
        await layer.toFile(filename);

        const image = sharp(filename);
        const {data} = await image.raw().toBuffer({resolveWithObject: true});

        let modifiedData = Buffer.from(data);

        // Apply scanline effects
        for (let i = 0; i < this.data.lineInfo.length; i++) {
            const y = await this.#computeY(context, numberOfFrames, currentFrame, i);
            modifiedData = await this.#applyScanline(modifiedData, context, y, i);
        }

        // Save the modified image with scanlines
        await sharp(modifiedData, {
            raw: {
                width: context.data.width,
                height: context.data.height,
                channels: 4
            }
        }).toFile(filenameOut);


        await layer.fromFile(filenameOut);

        await fs.unlink(filename);
        await fs.unlink(filenameOut);
    }


    #generate(settings) {

        const data = {
            numberOfLines: getRandomIntInclusive(this.config.lines.lower, this.config.lines.upper),
            height: this.finalSize.height,
            width: this.finalSize.width,
        };

        const computeInitialLineInfo = (numberOfLines, height) => {
            const lineInfo = [];

            for (let i = 0; i <= numberOfLines; i++) {
                lineInfo.push({
                    lineStart: getRandomIntInclusive(0, height),
                    loopTimes: getRandomIntInclusive(this.config.loopTimes.lower, this.config.loopTimes.upper),
                    thicknessRange: {
                        lower: randomNumber(this.config.thicknessRange.bottom.lower, this.config.thicknessRange.bottom.upper),
                        upper: randomNumber(this.config.thicknessRange.top.lower, this.config.thicknessRange.top.upper),
                    },
                    thicknessTimes: getRandomIntInclusive(this.config.thicknessTimes.lower, this.config.thicknessTimes.upper),
                    brightnessRange: {
                        lower: randomNumber(this.config.brightnessRange.bottom.lower, this.config.brightnessRange.bottom.upper),
                        upper: randomNumber(this.config.brightnessRange.top.lower, this.config.brightnessRange.top.upper),
                    },
                    brightnessTimes: getRandomIntInclusive(this.config.brightnessTimes.lower, this.config.brightnessTimes.upper),
                    lineBlurRange: {
                        lower: randomNumber(this.config.lineBlurRange.bottom.lower, this.config.lineBlurRange.bottom.upper),
                        upper: randomNumber(this.config.lineBlurRange.top.lower, this.config.lineBlurRange.top.upper),
                    },
                    lineBlurTimes: getRandomIntInclusive(this.config.lineBlurTimes.lower, this.config.lineBlurTimes.upper),
                    colorTintRange: {
                        redRange:{
                            lower: randomNumber(this.config.colorTintRange.redRange.bottom.lower, this.config.colorTintRange.redRange.bottom.upper),
                            upper: randomNumber(this.config.colorTintRange.redRange.top.lower, this.config.colorTintRange.redRange.top.upper),
                        },
                        greenRange: {
                            lower: randomNumber(this.config.colorTintRange.greenRange.bottom.lower, this.config.colorTintRange.greenRange.bottom.upper),
                            upper: randomNumber(this.config.colorTintRange.greenRange.top.lower, this.config.colorTintRange.greenRange.top.upper),
                        },
                        blueRange: {
                            lower: randomNumber(this.config.colorTintRange.blueRange.bottom.lower, this.config.colorTintRange.blueRange.bottom.upper),
                            upper: randomNumber(this.config.colorTintRange.blueRange.top.lower, this.config.colorTintRange.blueRange.top.upper),
                        },
                    },
                    colorTintTimes: getRandomIntInclusive(this.config.colorTintTimes.lower, this.config.colorTintTimes.upper),
                    opacityRange: {
                        lower: randomNumber(this.config.opacityRange.bottom.lower, this.config.opacityRange.bottom.upper),
                        upper: randomNumber(this.config.opacityRange.top.lower, this.config.opacityRange.top.upper),
                    },
                    opacityTimes: getRandomIntInclusive(this.config.opacityTimes.lower, this.config.opacityTimes.upper),
                });
            }

            return lineInfo;
        };

        data.lineInfo = computeInitialLineInfo(data.numberOfLines, data.height, data.width);

        this.data = data;
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#crtScanLines(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.numberOfLines} lines`;
    }
}
