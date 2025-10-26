import { promises as fs } from 'fs';
import { LayerEffect } from 'my-nft-gen';
import { getRandomIntInclusive, randomId, randomNumber } from 'my-nft-gen/src/core/math/random.js';
import { findValue } from 'my-nft-gen/src/core/math/findValue.js';
import { hexToRgba } from 'my-nft-gen/src/core/utils/hexToRgba.js';
import { Canvas2dFactory } from 'my-nft-gen/src/core/factory/canvas/Canvas2dFactory.js';
import { Settings } from 'my-nft-gen/src/core/Settings.js';
import { ScanLinesConfig } from './ScanLinesConfig.js';
import { Range } from 'my-nft-gen/src/core/layer/configType/Range.js';
import { DynamicRange } from 'my-nft-gen/src/core/layer/configType/DynamicRange.js';

export class ScanLinesEffect extends LayerEffect {
    static _name_ = 'scan lines';
    static configClass = ScanLinesConfig;

    static presets = [
        {
            name: 'subtle-scan-lines',
            effect: 'scan lines',
            percentChance: 100,
            currentEffectConfig: {
                lines: new Range(1, 2),
                minlength: new Range(20, 30),
                maxlength: new Range(60, 80),
                times: new Range(3, 6),
                alphaRange: new DynamicRange(new Range(0.2, 0.3), new Range(0.4, 0.5)),
                alphaTimes: new Range(3, 6),
                loopTimes: new Range(1, 1),
            }
        },
        {
            name: 'classic-scan-lines',
            effect: 'scan lines',
            percentChance: 100,
            currentEffectConfig: {
                lines: new Range(2, 4),
                minlength: new Range(30, 40),
                maxlength: new Range(80, 100),
                times: new Range(4, 8),
                alphaRange: new DynamicRange(new Range(0.3, 0.4), new Range(0.5, 0.6)),
                alphaTimes: new Range(4, 8),
                loopTimes: new Range(1, 2),
            }
        },
        {
            name: 'intense-scan-lines',
            effect: 'scan lines',
            percentChance: 100,
            currentEffectConfig: {
                lines: new Range(3, 6),
                minlength: new Range(40, 50),
                maxlength: new Range(100, 120),
                times: new Range(6, 12),
                alphaRange: new DynamicRange(new Range(0.4, 0.5), new Range(0.6, 0.8)),
                alphaTimes: new Range(6, 12),
                loopTimes: new Range(2, 3),
            }
        }
    ];

    constructor({
        name = ScanLinesEffect._name_,
        requiresLayer = true,
        config = new ScanLinesConfig({}),
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

    async #drawLine(y, pixelLine, context) {
        for (let x = 0; x < context.data.width; x++) {
            const theTrailGaston = findValue(y - pixelLine[x].min, y - pixelLine[x].max, pixelLine[x].times, context.numberOfFrames, context.currentFrame);
            const theAlphaGaston = findValue(pixelLine[x].alphaRange.lower, pixelLine[x].alphaRange.upper, pixelLine[x].alphaTimes, context.numberOfFrames, context.currentFrame);
            await context.canvas.drawGradientLine2d({ x, y }, {
                x, y: theTrailGaston,
            }, 1, hexToRgba(context.data.color, theAlphaGaston), hexToRgba(context.data.color, 0));
        }
    }

    async #computeY(context, numberOfFrames, currentFrame, i, loopTimes) {
        const displacement = (context.data.height / numberOfFrames) * ((currentFrame + 1) * loopTimes);
        let y = context.data.lineInfo[i].lineStart + displacement;

        if (y > context.data.height) {
            y %= context.data.height;
        }
        return y;
    }

    async #verticalScanLines(layer, currentFrame, numberOfFrames) {
        const context = {
            currentFrame,
            numberOfFrames,
            drawing: `${this.workingDirectory}scan-lines${randomId()}.png`,
            canvas: await Canvas2dFactory.getNewCanvas(this.data.width, this.data.height),
            data: this.data,
        };

        for (let i = 0; i < this.data.lineInfo.length; i++) {
            const y = await this.#computeY(context, numberOfFrames, currentFrame, i, this.data.lineInfo[i].loopTimes);
            await this.#drawLine(y, this.data.lineInfo[i].pixelLine, context);
        }

        const newLayer = await context.canvas.convertToLayer();

        await layer.compositeLayerOver(newLayer);
    }

    #generate(settings) {
        const data = {
            numberOfLines: getRandomIntInclusive(this.config.lines.lower, this.config.lines.upper),
            height: (this.finalSize.height * 1.5),
            width: (this.finalSize.width * 1.5),
            color: settings.getColorFromBucket(),
        };

        const getPixelTrailLength = () => ({
            min: getRandomIntInclusive(this.config.minlength.lower, this.config.minlength.upper),
            max: getRandomIntInclusive(this.config.maxlength.lower, this.config.maxlength.upper),
            times: getRandomIntInclusive(this.config.times.lower, this.config.times.upper),
            alphaRange: {
                lower: randomNumber(this.config.alphaRange.bottom.lower, this.config.alphaRange.bottom.upper),
                upper: randomNumber(this.config.alphaRange.top.lower, this.config.alphaRange.top.upper),
            },
            alphaTimes: getRandomIntInclusive(this.config.alphaTimes.lower, this.config.alphaTimes.upper),
        });

        const fillLineDetail = (width) => {
            const pixelLine = [];
            for (let i = 0; i < width; i++) {
                pixelLine.push(getPixelTrailLength());
            }
            return pixelLine;
        };

        const computeInitialLineInfo = (numberOfLines, height, width) => {
            const lineInfo = [];

            for (let i = 0; i <= numberOfLines; i++) {
                lineInfo.push({
                    lineStart: getRandomIntInclusive(0, height),
                    pixelLine: fillLineDetail(width),
                    loopTimes: getRandomIntInclusive(this.config.loopTimes.lower, this.config.loopTimes.upper),
                });
            }

            return lineInfo;
        };

        data.lineInfo = computeInitialLineInfo(data.numberOfLines, data.height, data.width);

        this.data = data;
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#verticalScanLines(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.numberOfLines} lines`;
    }
}
