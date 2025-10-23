import { LayerEffect } from 'my-nft-gen';
import { getRandomIntInclusive, randomId, randomNumber } from 'my-nft-gen/src/core/math/random.js';
import { Settings } from 'my-nft-gen/src/core/Settings.js';
import { CRTScanLinesConfig } from './CRTScanLinesConfig.js';
import { ColorPicker } from 'my-nft-gen/src/core/layer/configType/ColorPicker.js';
import { Range } from 'my-nft-gen/src/core/layer/configType/Range.js';
import { DynamicRange } from 'my-nft-gen/src/core/layer/configType/DynamicRange.js';
import sharp from "sharp";
import { promises as fs } from "fs";
import { findValue } from 'my-nft-gen/src/core/math/findValue.js';

export class CRTScanLinesEffect extends LayerEffect {
    static _name_ = 'crt-scan-lines';

    static presets = [
        {
            name: 'subtle-crt',
            effect: 'crt-scan-lines',
            percentChance: 100,
            currentEffectConfig: {
                lines: new Range(3, 5),
                loopTimes: new Range(1, 1),
                brightnessRange: new DynamicRange(new Range(2, 5), new Range(8, 12)),
                brightnessTimes: new Range(1, 2),
                thicknessRange: new DynamicRange(new Range(1, 2), new Range(3, 4)),
                thicknessTimes: new Range(1, 2),
                lineBlurRange: new DynamicRange(new Range(15, 20), new Range(25, 30)),
                lineBlurTimes: new Range(1, 2),
                colorTintRange: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                opacityRange: new DynamicRange(new Range(0.15, 0.2), new Range(0.25, 0.3)),
                opacityTimes: new Range(1, 2),
                direction: 'down'
            }
        },
        {
            name: 'classic-crt',
            effect: 'crt-scan-lines',
            percentChance: 100,
            currentEffectConfig: {
                lines: new Range(8, 12),
                loopTimes: new Range(1, 2),
                brightnessRange: new DynamicRange(new Range(5, 10), new Range(15, 30)),
                brightnessTimes: new Range(2, 8),
                thicknessRange: new DynamicRange(new Range(2, 4), new Range(6, 8)),
                thicknessTimes: new Range(2, 8),
                lineBlurRange: new DynamicRange(new Range(10, 20), new Range(30, 40)),
                lineBlurTimes: new Range(2, 8),
                colorTintRange: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                opacityRange: new DynamicRange(new Range(0.35, 0.4), new Range(0.5, 0.55)),
                opacityTimes: new Range(2, 8),
                direction: 'down'
            }
        },
        {
            name: 'glitch-crt',
            effect: 'crt-scan-lines',
            percentChance: 100,
            currentEffectConfig: {
                lines: new Range(15, 25),
                loopTimes: new Range(3, 5),
                brightnessRange: new DynamicRange(new Range(20, 40), new Range(60, 100)),
                brightnessTimes: new Range(5, 12),
                thicknessRange: new DynamicRange(new Range(4, 8), new Range(10, 16)),
                thicknessTimes: new Range(5, 12),
                lineBlurRange: new DynamicRange(new Range(5, 10), new Range(40, 60)),
                lineBlurTimes: new Range(5, 12),
                colorTintRange: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                opacityRange: new DynamicRange(new Range(0.5, 0.6), new Range(0.7, 0.85)),
                opacityTimes: new Range(5, 12),
                direction: 'down'
            }
        }
    ];

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
            baseColor,
            opacityRange, opacityTimes
        } = lineInfo[i];

        const opacity = findValue(opacityRange.lower, opacityRange.upper, opacityTimes, context.numberOfFrames, context.currentFrame);
        const thickness = findValue(thicknessRange.lower, thicknessRange.upper, thicknessTimes, context.numberOfFrames, context.currentFrame);
        const lineBlur = findValue(lineBlurRange.lower, lineBlurRange.upper, lineBlurTimes, context.numberOfFrames, context.currentFrame);
        const brightness = findValue(brightnessRange.lower, brightnessRange.upper, brightnessTimes, context.numberOfFrames, context.currentFrame);

        // Use the full color from ColorPicker
        const colorTint = baseColor;
        
        // Normalize color tint to 0-1 range for proper blending
        const tintR = colorTint.r / 255;
        const tintG = colorTint.g / 255;
        const tintB = colorTint.b / 255;

        // Create scanline overlay with brightness and color tint
        const scanlineOverlay = new Float32Array(imageData.length);
        for (let j = 0; j < imageData.length; j++) {
            scanlineOverlay[j] = 0;
        }

        for (let y = startY; y < startY + thickness && y < height; y++) {
            const distanceFromCenter = Math.abs(y - startY - thickness / 2);
            const safeThickness = Math.max(thickness, 1);
            const blendFactor = Math.pow(Math.max(0, 1 - distanceFromCenter / (safeThickness / 2)), 2);
            const brightnessAdjustment = brightness * blendFactor;
            const alpha = Math.min(Math.max(opacity ?? 1, 0), 1) * blendFactor;

            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                const [r, g, b] = [highPrecisionData[index], highPrecisionData[index + 1], highPrecisionData[index + 2]];

                // Apply brightness and color tint to create scanline effect
                const brightR = Math.min(255, r + brightnessAdjustment);
                const brightG = Math.min(255, g + brightnessAdjustment);
                const brightB = Math.min(255, b + brightnessAdjustment);
                
                const tintedR = brightR * tintR;
                const tintedG = brightG * tintG;
                const tintedB = brightB * tintB;
                
                // Store the scanline effect in overlay
                scanlineOverlay[index]     = tintedR * alpha;
                scanlineOverlay[index + 1] = tintedG * alpha;
                scanlineOverlay[index + 2] = tintedB * alpha;
                scanlineOverlay[index + 3] = alpha * 255;
            }
        }

        // Apply Gaussian blur to the scanline overlay
        const blurredOverlay = await this.#applyGaussianBlur(scanlineOverlay, width, height, lineBlur);

        // Blend the blurred scanline with the original image
        for (let j = 0; j < imageData.length; j += 4) {
            const overlayAlpha = blurredOverlay[j + 3] / 255;
            highPrecisionData[j]     = highPrecisionData[j] * (1 - overlayAlpha) + blurredOverlay[j];
            highPrecisionData[j + 1] = highPrecisionData[j + 1] * (1 - overlayAlpha) + blurredOverlay[j + 1];
            highPrecisionData[j + 2] = highPrecisionData[j + 2] * (1 - overlayAlpha) + blurredOverlay[j + 2];
        }

        const resultData = new Uint8Array(imageData.length);
        for (let j = 0; j < imageData.length; j++) {
            resultData[j] = Math.round(highPrecisionData[j]);
        }

        return resultData;
    }

    async #applyGaussianBlur(imageData, width, height, sigma) {
        // Clamp sigma to reasonable values (Sharp accepts 0.3 to 1000)
        const clampedSigma = Math.max(0.3, Math.min(sigma, 1000));
        
        // Convert Float32Array to Buffer
        const buffer = Buffer.alloc(imageData.length);
        for (let i = 0; i < imageData.length; i++) {
            buffer[i] = Math.round(imageData[i]);
        }

        // Apply Gaussian blur using Sharp
        const blurred = await sharp(buffer, {
            raw: {
                width: width,
                height: height,
                channels: 4
            }
        })
        .blur(clampedSigma)
        .raw()
        .toBuffer();

        // Convert back to Float32Array
        const result = new Float32Array(blurred.length);
        for (let i = 0; i < blurred.length; i++) {
            result[i] = blurred[i];
        }

        return result;
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

    /**
     * Parse hex color to RGB object
     * @param {string} hex - Hex color string (e.g., '#ff0000')
     * @returns {{r: number, g: number, b: number}} RGB values (0-255)
     */
    #parseHexColor(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 255, g: 255, b: 255 };
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

                // Get color from ColorPicker and parse to RGB
                // Handle case where colorTintRange might be a plain object (deserialized)
                let colorTintRange = this.config.colorTintRange;
                if (colorTintRange && typeof colorTintRange.getColor !== 'function') {
                    // Reconstruct ColorPicker if it was deserialized
                    colorTintRange = new ColorPicker(colorTintRange.selectionType, colorTintRange.colorValue);
                }
                
                const hexColor = colorTintRange?.getColor(settings) ?? settings.getColorFromBucket();
                const baseColor = this.#parseHexColor(hexColor);

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

                    // Store base color from ColorPicker
                    baseColor: baseColor,

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
