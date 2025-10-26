import {promises as fs} from 'fs';
import Jimp from 'jimp';
import {LayerEffect} from 'my-nft-gen/src/core/layer/LayerEffect.js';
import {getRandomFromArray, getRandomIntInclusive, randomId, randomNumber} from 'my-nft-gen/src/core/math/random.js';
import {findValue, getAllFindValueAlgorithms} from 'my-nft-gen/src/core/math/findValue.js';
import {Settings} from 'my-nft-gen/src/core/Settings.js';
import {EdgeGlowConfig} from './EdgeGlowConfig.js';
import {Range} from 'my-nft-gen/src/core/layer/configType/Range.js';
import {DynamicRange} from 'my-nft-gen/src/core/layer/configType/DynamicRange.js';
import sharp from "sharp";

export class EdgeGlowEffect extends LayerEffect {
    static _name_ = 'edge-glow';
    static configClass = EdgeGlowConfig;

    static presets = [
        {
            name: 'subtle-edge-glow',
            effect: 'edge-glow',
            percentChance: 100,
            currentEffectConfig: {
                glowBottom: [200, 100, 200],
                glowTop: [100, 200, 200],
                glowTimes: new Range(1, 3),
                brightnessRange: new DynamicRange(new Range(1.2, 1.3), new Range(1.5, 1.6)),
                brightnessTimes: new Range(1, 4),
                blurRange: new DynamicRange(new Range(8, 10), new Range(12, 14)),
                blurTimes: new Range(1, 4),
                brightnessFindValueAlgorithm: getAllFindValueAlgorithms(),
                blurFindValueAlgorithm: getAllFindValueAlgorithms(),
            }
        },
        {
            name: 'classic-edge-glow',
            effect: 'edge-glow',
            percentChance: 100,
            currentEffectConfig: {
                glowBottom: [255, 0, 255],
                glowTop: [0, 255, 255],
                glowTimes: new Range(2, 6),
                brightnessRange: new DynamicRange(new Range(1.5, 1.5), new Range(2, 2)),
                brightnessTimes: new Range(2, 8),
                blurRange: new DynamicRange(new Range(12, 12), new Range(15, 15)),
                blurTimes: new Range(2, 8),
                brightnessFindValueAlgorithm: getAllFindValueAlgorithms(),
                blurFindValueAlgorithm: getAllFindValueAlgorithms(),
            }
        },
        {
            name: 'intense-edge-glow',
            effect: 'edge-glow',
            percentChance: 100,
            currentEffectConfig: {
                glowBottom: [255, 50, 255],
                glowTop: [50, 255, 255],
                glowTimes: new Range(4, 10),
                brightnessRange: new DynamicRange(new Range(2, 2.5), new Range(3, 3.5)),
                brightnessTimes: new Range(4, 12),
                blurRange: new DynamicRange(new Range(18, 20), new Range(25, 30)),
                blurTimes: new Range(4, 12),
                brightnessFindValueAlgorithm: getAllFindValueAlgorithms(),
                blurFindValueAlgorithm: getAllFindValueAlgorithms(),
            }
        }
    ];

    constructor({
                    name = EdgeGlowEffect._name_,
                    requiresLayer = false,
                    config = new EdgeGlowConfig({}),
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

    #generate(settings) {
        this.data = {
            glowBottom: this.config.glowBottom,
            glowTop: this.config.glowTop,
            glowTimes: getRandomIntInclusive(this.config.glowTimes.lower, this.config.glowTimes.upper),
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
            brightnessFindValueAlgorithm: getRandomFromArray(this.config.brightnessFindValueAlgorithm),
            blurFindValueAlgorithm: getRandomFromArray(this.config.blurFindValueAlgorithm),
        };
    }

    async invoke(layer, currentFrame, numberOfFrames) {

        const layerOut = `${this.workingDirectory}edge-glow${randomId()}.png`;

        const options = {
            brightness: findValue(this.data.brightnessRange.lower, this.data.brightnessRange.upper, this.data.brightnessTimes, numberOfFrames, currentFrame, this.data.brightnessFindValueAlgorithm),
            blur: findValue(this.data.blurRange.lower, this.data.blurRange.upper, this.data.blurTimes, numberOfFrames, currentFrame, this.data.blurFindValueAlgorithm),
        }

        /**
         * Convert RGB to HSL.
         */
        function rgbToHsl([r, g, b]) {
            r /= 255;
            g /= 255;
            b /= 255;
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;

            if (max === min) {
                h = s = 0; // achromatic
            } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r:
                        h = ((g - b) / d + (g < b ? 6 : 0));
                        break;
                    case g:
                        h = ((b - r) / d + 2);
                        break;
                    case b:
                        h = ((r - g) / d + 4);
                        break;
                }
                h /= 6;
            }
            return [h, s, l];
        }

        /**
         * Convert HSL to RGB.
         */
        function hslToRgb([h, s, l]) {
            let r, g, b;

            function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            if (s === 0) {
                r = g = b = l; // achromatic
            } else {
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }

            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }

        /**
         * Interpolate between two RGB colors by hue.
         */
        function interpolateHueRGB(startRGB, endRGB, t) {
            const hsl1 = rgbToHsl(startRGB);
            const hsl2 = rgbToHsl(endRGB);
            const interpH = (1 - t) * hsl1[0] + t * hsl2[0];
            const interpS = (1 - t) * hsl1[1] + t * hsl2[1];
            const interpL = (1 - t) * hsl1[2] + t * hsl2[2];
            return hslToRgb([interpH, interpS, interpL]);
        }

        /**
         * Same as before but hue shifts glow layer instead of tinting base.
         */

        const interp = (() => {
            const segment = numberOfFrames / this.data.glowTimes;
            const half = segment / 2;
            const frameSegment = currentFrame % segment;
            return frameSegment <= half
                ? frameSegment / half
                : 1 - ((frameSegment - half) / half);
        })();

        const hueGlow = interpolateHueRGB(this.data.glowBottom, this.data.glowTop, interp);

        await layer.toFile(layerOut);

        const jimpImage = await Jimp.read(layerOut);
        jimpImage
            .greyscale()
            .convolute([
                [-1, -1, -1],
                [-1, 8, -1],
                [-1, -1, -1],
            ])
            .brightness(options.brightness - 1);

        const edgeBuffer = await jimpImage.getBufferAsync(Jimp.MIME_PNG);

        const glowBuffer = await sharp(edgeBuffer)
            .ensureAlpha()
            .tint({r: hueGlow[0], g: hueGlow[1], b: hueGlow[2]})
            .blur(options.blur)
            .toBuffer();

        const base = sharp(layerOut).ensureAlpha();
        const final = await base
            .composite([{input: glowBuffer, blend: 'screen'}])
            .png()
            .toBuffer();

        layer.fromBuffer(final);

        await fs.unlink(layerOut);
    }

    getInfo() {
        return `${this.name}: ${this.data.times} times, ${this.data.lower} to ${this.data.upper}`;
    }
}
