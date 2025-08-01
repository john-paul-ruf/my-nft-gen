import {LayerEffect} from '../../../core/layer/LayerEffect.js';
import {getRandomIntInclusive, randomId, randomNumber} from '../../../core/math/random.js';
import {Settings} from '../../../core/Settings.js';
import {CRTShadowConfig} from './CRTShadowConfig.js';
import sharp from "sharp";
import {promises as fs} from "fs";
import {findValue} from "../../../core/math/findValue.js";
import {LayerFactory} from "../../../core/factory/layer/LayerFactory.js";

/** *
 *
 * Pixelate Effect
 * Creates an animated glitch for the composite image
 * Can be glitched to appear on a percentage of the frames generated
 * Instantiated through the project via the LayerConfig
 *
 */

export class CRTShadowEffect extends LayerEffect {
    static _name_ = 'crt-shadow';

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


    #generate(settings) {

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
            lineRed: getRandomIntInclusive(this.config.lineRed.lower, this.config.lineRed.upper),
            lineGreen: getRandomIntInclusive(this.config.lineGreen.lower, this.config.lineGreen.upper),
            lineBlue: getRandomIntInclusive(this.config.lineBlue.lower, this.config.lineBlue.upper),
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
