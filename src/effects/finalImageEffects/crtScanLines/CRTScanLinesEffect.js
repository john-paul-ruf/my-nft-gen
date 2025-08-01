import { LayerEffect } from '../../../core/layer/LayerEffect.js';
import { getRandomIntInclusive, randomId, randomNumber } from '../../../core/math/random.js';
import { Settings } from '../../../core/Settings.js';
import { CRTScanLinesConfig } from './CRTScanLinesConfig.js';
import sharp from "sharp";
import { promises as fs } from "fs";
import { findValue } from "../../../core/math/findValue.js";

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
        super({ name, requiresLayer, config, additionalEffects, ignoreAdditionalEffects, settings });
        this.#generate(settings);
    }

    async #applyScanline(imageData, context, startY, i) {
        const highPrecisionData = new Float32Array(imageData.length);
        for (let j = 0; j < imageData.length; j++) {
            highPrecisionData[j] = imageData[j];
        }

        const { width, height, lineInfo } = context.data;
        const {
            thicknessRange, thicknessTimes,
            lineBlurRange, lineBlurTimes,
            brightnessRange, brightnessTimes,
            colorTintRange, colorTintTimes,
            opacityRange, opacityTimes
        } = lineInfo[i];

        const opacity = findValue(opacityRange.lower, opacityRange.upper, opacityTimes, context.numberOfFrames, context.currentFrame);
        const thickness = findValue(thicknessRange.lower, thicknessRange.upper, thicknessTimes, context.numberOfFrames, context.currentFrame);
        const lineBlur = findValue(lineBlurRange.lower, lineBlurRange.upper, lineBlurTimes, context.numberOfFrames, context.currentFrame);
        const brightness = findValue(brightnessRange.lower, brightnessRange.upper, brightnessTimes, context.numberOfFrames, context.currentFrame);

        const colorTint = {
            r: findValue(colorTintRange.redRange.lower, colorTintRange.redRange.upper, colorTintTimes, context.numberOfFrames, context.currentFrame),
            g: findValue(colorTintRange.greenRange.lower, colorTintRange.greenRange.upper, colorTintTimes, context.numberOfFrames, context.currentFrame),
            b: findValue(colorTintRange.blueRange.lower, colorTintRange.blueRange.upper, colorTintTimes, context.numberOfFrames, context.currentFrame),
        };

        for (let y = startY; y < startY + thickness && y < height; y++) {
            const distanceFromCenter = Math.abs(y - startY - thickness / 2);
            const blendFactor = Math.pow(Math.max(0, 1 - distanceFromCenter / lineBlur), 2);
            const brightnessAdjustment = brightness * blendFactor;
            const alpha = Math.min(Math.max(opacity ?? 1, 0), 1);

            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                const [r, g, b] = [highPrecisionData[index], highPrecisionData[index + 1], highPrecisionData[index + 2]];

                highPrecisionData[index]     = r * (1 - alpha) + Math.min(255, r + brightnessAdjustment * colorTint.r) * alpha;
                highPrecisionData[index + 1] = g * (1 - alpha) + Math.min(255, g + brightnessAdjustment * colorTint.g) * alpha;
                highPrecisionData[index + 2] = b * (1 - alpha) + Math.min(255, b + brightnessAdjustment * colorTint.b) * alpha;
            }
        }

        const resultData = new Uint8Array(imageData.length);
        for (let j = 0; j < imageData.length; j++) {
            resultData[j] = Math.round(highPrecisionData[j]);
        }

        return resultData;
    }

    async #computeY(context, numberOfFrames, currentFrame, i) {
        const { height, lineInfo } = context.data;
        const { loopTimes, lineStart, direction } = lineInfo[i];

        const progress = (currentFrame + 1) * loopTimes / numberOfFrames;
        const displacement = progress * height;

        let y;
        if (direction === 'down') {
            y = lineStart + displacement;
        } else {
            y = lineStart - displacement;
        }

        if (y < 0) y = (height + (y % height)) % height;
        if (y > height) y %= height;

        return Math.round(y);
    }

    async #crtScanLines(layer, currentFrame, numberOfFrames) {
        const context = {
            data: this.data,
            numberOfFrames,
            currentFrame
        };

        const filename = `${this.workingDirectory}crt-scan-lines${randomId()}.png`;
        const filenameOut = `${this.workingDirectory}crt-scan-lines-out${randomId()}.png`;
        await layer.toFile(filename);

        const image = sharp(filename);
        const { data } = await image.raw().toBuffer({ resolveWithObject: true });

        let modifiedData = Buffer.from(data);

        for (let i = 0; i < this.data.lineInfo.length; i++) {
            const y = await this.#computeY(context, numberOfFrames, currentFrame, i);
            modifiedData = await this.#applyScanline(modifiedData, context, y, i);
        }

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
        const height = this.finalSize?.height || settings?.height || 1080;
        const width = this.finalSize?.width || settings?.width || 1920;

        const numberOfLines = getRandomIntInclusive(this.config.lines.lower, this.config.lines.upper);

        const computeInitialLineInfo = () => {
            const lineInfo = [];

            for (let i = 0; i < numberOfLines; i++) {
                const pick = () => Math.random() < 0.5 ? 'down' : 'up';

                lineInfo.push({
                    lineStart: getRandomIntInclusive(0, height),
                    loopTimes: getRandomIntInclusive(this.config.loopTimes.lower, this.config.loopTimes.upper),
                    direction: this.config.direction, // 👈 NEW: up/down direction

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
                        redRange: {
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

        this.data = {
            numberOfLines,
            height,
            width,
            lineInfo: computeInitialLineInfo()
        };
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#crtScanLines(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.numberOfLines} lines`;
    }
}
