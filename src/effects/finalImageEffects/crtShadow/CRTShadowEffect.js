import {LayerEffect} from 'my-nft-gen/src/core/layer/LayerEffect.js';
import {getRandomIntInclusive, randomId, randomNumber} from 'my-nft-gen/src/core/math/random.js';
import {Settings} from 'my-nft-gen/src/core/Settings.js';
import {CRTShadowConfig} from './CRTShadowConfig.js';
import {ColorPicker} from 'my-nft-gen/src/core/layer/configType/ColorPicker.js';
import {Range} from 'my-nft-gen/src/core/layer/configType/Range.js';
import sharp from "sharp";
import {promises as fs} from "fs";
import {findValue} from 'my-nft-gen/src/core/math/findValue.js';
import {LayerFactory} from 'my-nft-gen/src/core/factory/layer/LayerFactory.js';

/** *
 *
 * CRT Shadow Effect
 * Creates shadow mask effect like old CRT monitors
 * Instantiated through the project via the LayerConfig
 *
 */

export class CRTShadowEffect extends LayerEffect {
    static _name_ = 'crt-shadow';

    static presets = [
        {
            name: 'subtle-shadow',
            effect: 'crt-shadow',
            percentChance: 100,
            currentEffectConfig: {
                shadowOpacityRange: {bottom: {lower: 0.3, upper: 0.4}, top: {lower: 0.5, upper: 0.6}},
                linesOpacityRange: {bottom: {lower: 0.15, upper: 0.2}, top: {lower: 0.25, upper: 0.3}},
                opacityTimes: {lower: 2, upper: 4},
                lineColorPicker: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                lineHeight: new Range(0.5, 2),
                edgePercentage: {lower: 0.1, upper: 0.1},
                maxLineHeight: {lower: 1.5, upper: 2},
                numberOfEdgeSections: {lower: 3, upper: 5}
            }
        },
        {
            name: 'classic-shadow',
            effect: 'crt-shadow',
            percentChance: 100,
            currentEffectConfig: {
                shadowOpacityRange: {bottom: {lower: 0.6, upper: 0.6}, top: {lower: 0.8, upper: 0.8}},
                linesOpacityRange: {bottom: {lower: 0.3, upper: 0.3}, top: {lower: 0.5, upper: 0.5}},
                opacityTimes: {lower: 4, upper: 4},
                lineColorPicker: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                lineHeight: new Range(0.5, 4),
                edgePercentage: {lower: 0.15, upper: 0.15},
                maxLineHeight: {lower: 2.5, upper: 2.5},
                numberOfEdgeSections: {lower: 5, upper: 5}
            }
        },
        {
            name: 'heavy-shadow',
            effect: 'crt-shadow',
            percentChance: 100,
            currentEffectConfig: {
                shadowOpacityRange: {bottom: {lower: 0.8, upper: 0.85}, top: {lower: 0.9, upper: 0.95}},
                linesOpacityRange: {bottom: {lower: 0.5, upper: 0.6}, top: {lower: 0.7, upper: 0.8}},
                opacityTimes: {lower: 6, upper: 10},
                lineColorPicker: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                lineHeight: new Range(1, 6),
                edgePercentage: {lower: 0.2, upper: 0.25},
                maxLineHeight: {lower: 3, upper: 4},
                numberOfEdgeSections: {lower: 7, upper: 10}
            }
        }
    ];

    constructor({
                    name = CRTShadowEffect._name_,
                    requiresLayer = true,
                    config = new CRTShadowConfig({}),
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

        this.finalSize = settings.finalSize;
        this.#generate(settings);
    }

    async #effect(currentFrame, numberOfFrames) {

        const filenameOut = `${this.workingDirectory}crt-shadow-out${randomId()}.png`;

        const image = sharp({
            create: {
                width: this.finalSize.width,
                height: this.finalSize.height,
                channels: 4,
                background: '#00000000',
            },
        });

        const shadowGaston = findValue(this.data.shadowOpacityRange.lower, this.data.shadowOpacityRange.upper, this.data.opacityTimes, numberOfFrames, currentFrame);
        const linesGaston = findValue(this.data.linesOpacityRange.lower, this.data.linesOpacityRange.upper, this.data.opacityTimes, numberOfFrames, currentFrame);

        let scanLinesGradients = ''
        let lineStep = this.data.maxLineHeight / this.data.numberOfEdgeSections

        for (let i = 0; i < this.data.numberOfEdgeSections; i++) {
            scanLinesGradients += `
                    <pattern id="scanlines${i}" width="4" height="4" patternUnits="userSpaceOnUse">
                        <rect width="100%" height="${this.data.lineHeight + (lineStep * i)}"
                            fill="rgba( ${this.data.lineRed},  ${this.data.lineGreen},  ${this.data.lineBlue}, ${shadowGaston} )"/>
                    </pattern>
                `
        }

        const sectionHeight = (this.data.edgePercentage / this.data.numberOfEdgeSections) * this.data.height;
        let scanLinesRect = `<rect x="0" y="${(this.data.height - (this.data.height * (1 - (this.data.edgePercentage * 2)))) / 2}" width="${this.data.width}" height="${this.data.height * (1 - (this.data.edgePercentage * 2))}" fill="url(#scanlines)"/>`


        for (let i = 0; i < this.data.numberOfEdgeSections; i++) {

            const index = (this.data.numberOfEdgeSections) - i;

            scanLinesRect += `<rect x="0" y="${sectionHeight * (index - 1)}"  width="${this.data.width}" height="${sectionHeight}" fill="url(#scanlines${i})"/>`
            scanLinesRect += `<rect x="0" y="${this.data.height - (sectionHeight * index)}" width="${this.data.width}" height="${sectionHeight}" fill="url(#scanlines${i})"/>`
        }


        const gradientSVG = `
     <svg  width="${this.data.width}" height="${this.data.height}" xmlns="http://www.w3.org/2000/svg">
          <!-- CRT Shadow Effect -->
          <defs>
            <!-- Horizontal shadow gradient at the top -->
            <linearGradient id="crt-shadow-top" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style="stop-color: rgba(${this.data.lineRed},  ${this.data.lineGreen},  ${this.data.lineBlue}, ${shadowGaston});" />
              <stop offset="5%" style="stop-color: rgba(0, 0, 0, 0);" />
            </linearGradient>
            
            <!-- Horizontal shadow gradient at the bottom -->
            <linearGradient id="crt-shadow-bottom" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" style="stop-color: rgba(${this.data.lineRed},  ${this.data.lineGreen},  ${this.data.lineBlue},${shadowGaston});" />
              <stop offset="5%" style="stop-color: rgba(0, 0, 0, 0);" />
            </linearGradient>
            
            <!-- Vertical shadow gradient at the left -->
            <linearGradient id="crt-shadow-left" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" style="stop-color: rgba(${this.data.lineRed},  ${this.data.lineGreen},  ${this.data.lineBlue}, ${shadowGaston});" />
              <stop offset="10%" style="stop-color: rgba(0, 0, 0, 0);" />
            </linearGradient>
            
            <!-- Vertical shadow gradient at the right -->
            <linearGradient id="crt-shadow-right" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" style="stop-color: rgba(${this.data.lineRed},  ${this.data.lineGreen},  ${this.data.lineBlue}, ${shadowGaston});" />
              <stop offset="10%" style="stop-color: rgba(0, 0, 0, 0);" />
            </linearGradient>
            
            <!-- Scanlines -->
            <pattern id="scanlines" width="4" height="4" patternUnits="userSpaceOnUse">
              <rect width="100%" height="${this.data.lineHeight}" fill="rgba( ${this.data.lineRed},  ${this.data.lineGreen},  ${this.data.lineBlue}, ${shadowGaston} )" />
            </pattern>
            
            ${scanLinesGradients}
            
          </defs>
        
          <!-- Apply the CRT Shadows -->
          <rect width="100%" height="50%" fill="url(#crt-shadow-top)" />
          <rect y="50%" width="100%" height="50%" fill="url(#crt-shadow-bottom)" />
          <rect width="50%" height="100%" fill="url(#crt-shadow-left)" />
          <rect x="50%" width="50%" height="100%" fill="url(#crt-shadow-right)" />
          
          <!-- Apply the Scanlines -->
          ${scanLinesRect}
        </svg>
    `;


        await image
            .resize({width: Math.floor(this.data.width), height: Math.floor(this.data.height)})
            .composite([{
                input: Buffer.from(gradientSVG),
            }])

        await image.toFile(filenameOut);

        const layer = await LayerFactory.getLayerFromFile(filenameOut)

        await fs.unlink(filenameOut);

        return layer;
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

    #generate(settings) {
        // Handle case where lineColorPicker might be a plain object (deserialized)
        let lineColorPicker = this.config.lineColorPicker;
        if (lineColorPicker && typeof lineColorPicker.getColor !== 'function') {
            // Reconstruct ColorPicker if it was deserialized
            lineColorPicker = new ColorPicker(lineColorPicker.selectionType, lineColorPicker.colorValue);
        }
        
        // Get color from ColorPicker and parse to RGB
        const hexColor = lineColorPicker?.getColor(settings) ?? settings.getColorFromBucket();
        const lineColor = this.#parseHexColor(hexColor);

        const data = {
            height: this.finalSize.height,
            width: this.finalSize.width,
            shadowOpacityRange: {
                lower: randomNumber(this.config.shadowOpacityRange.bottom.lower, this.config.shadowOpacityRange.bottom.upper),
                upper: randomNumber(this.config.shadowOpacityRange.top.lower, this.config.shadowOpacityRange.top.upper),
            },
            linesOpacityRange: {
                lower: randomNumber(this.config.linesOpacityRange.bottom.lower, this.config.linesOpacityRange.bottom.upper),
                upper: randomNumber(this.config.linesOpacityRange.top.lower, this.config.linesOpacityRange.top.upper),
            },
            opacityTimes: getRandomIntInclusive(this.config.opacityTimes.lower, this.config.opacityTimes.upper),
            lineRed: lineColor.r,
            lineGreen: lineColor.g,
            lineBlue: lineColor.b,
            lineHeight: randomNumber(this.config.lineHeight.lower, this.config.lineHeight.upper),
            edgePercentage: randomNumber(this.config.edgePercentage.lower, this.config.edgePercentage.upper),
            maxLineHeight: randomNumber(this.config.maxLineHeight.lower, this.config.maxLineHeight.upper),
            numberOfEdgeSections: randomNumber(this.config.numberOfEdgeSections.lower, this.config.numberOfEdgeSections.upper),
        };

        this.data = data;
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        const crtShadow = await this.#effect(currentFrame, numberOfFrames);
        await super.invoke(crtShadow, currentFrame, numberOfFrames);
        await layer.compositeLayerOver(crtShadow);
    }

    getInfo() {
        return `${this.name}`;
    }
}
