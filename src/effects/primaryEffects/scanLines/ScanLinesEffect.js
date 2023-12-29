import {LayerEffect} from "../../LayerEffect.js";
import {GlobalSettings} from "../../../core/GlobalSettings.js";
import {getRandomIntInclusive, randomId, randomNumber} from "../../../core/math/random.js";
import fs from "fs";
import {findValue} from "../../../core/math/findValue.js";
import {hexToRgba} from "../../../core/utils/hexToRgba.js";
import {Canvas2dFactory} from "../../../core/factory/canvas/Canvas2dFactory.js";
import {Settings} from "../../../core/Settings.js";

export class ScanLinesEffect extends LayerEffect {

    static _name_ = 'scan lines';

    static _config_  = {
        lines: {lower: 2, upper: 4},
        minlength: {lower: 30, upper: 40},
        maxlength: {lower: 80, upper: 100},
        times: {lower: 4, upper: 8},
        alphaRange: {bottom: {lower: 0.3, upper: 0.4}, top: {lower: 0.5, upper: 0.6}},
        alphaTimes: {lower: 4, upper: 8},
        loopTimes: {lower: 1, upper: 2},
    }

    constructor({
                    name = ScanLinesEffect._name_,
                    requiresLayer = true,
                    config = ScanLinesEffect._config_,
                    additionalEffects = [],
                    ignoreAdditionalEffects = false,
                    settings = new Settings({})
                }) {
        super({
            name: name,
            requiresLayer: requiresLayer,
            config: config,
            additionalEffects: additionalEffects,
            ignoreAdditionalEffects: ignoreAdditionalEffects,
            settings: settings
        });
        this.#generate(settings)
    }


    async #drawLine(y, pixelLine, context) {
        for (let x = 0; x < context.data.width; x++) {
            const theTrailGaston = findValue(y - pixelLine[x].min, y - pixelLine[x].max, pixelLine[x].times, context.numberOfFrames, context.currentFrame);
            const theAlphaGaston = findValue(pixelLine[x].alphaRange.lower, pixelLine[x].alphaRange.upper, pixelLine[x].alphaTimes, context.numberOfFrames, context.currentFrame);
            await context.canvas.drawGradientLine2d({x: x, y: y}, {
                x: x, y: theTrailGaston
            }, 1, hexToRgba(context.data.color, theAlphaGaston), hexToRgba(context.data.color, 0))
        }
    }

    async #computeY(context, numberOfFrames, currentFrame, i, loopTimes) {
        const displacement = (context.data.height / numberOfFrames) * ((currentFrame + 1) * loopTimes);
        let y = context.data.lineInfo[i].lineStart + displacement;

        if (y > context.data.height) {
            y = y % context.data.height
        }
        return y;
    }

    async #verticalScanLines(layer, currentFrame, numberOfFrames) {

        const context = {
            currentFrame: currentFrame,
            numberOfFrames: numberOfFrames,
            drawing: GlobalSettings.getWorkingDirectory() + 'scan-lines' + randomId() + '.png',
            canvas: await Canvas2dFactory.getNewCanvas(this.data.width, this.data.height),
            data: this.data,
        }

        for (let i = 0; i < this.data.lineInfo.length; i++) {
            let y = this.#computeY(context, numberOfFrames, currentFrame, i, this.data.lineInfo[i].loopTimes);
            await this.#drawLine(y, this.data.lineInfo[i].pixelLine, context)
        }

        await context.canvas.toFile(context.drawing);
        await layer.fromFile(context.drawing)

        fs.unlinkSync(context.drawing);
    }

    #generate(settings) {
        const data = {
            numberOfLines: getRandomIntInclusive(this.config.lines.lower, this.config.lines.upper),
            height: (GlobalSettings.getFinalImageSize().height * 1.5),
            width: (GlobalSettings.getFinalImageSize().width * 1.5),
            color: settings.getColorFromBucket(),
        }

        const getPixelTrailLength = () => {
            return {
                min: getRandomIntInclusive(this.config.minlength.lower, this.config.minlength.upper),
                max: getRandomIntInclusive(this.config.maxlength.lower, this.config.maxlength.upper),
                times: getRandomIntInclusive(this.config.times.lower, this.config.times.upper),
                alphaRange: {
                    lower: randomNumber(this.config.alphaRange.bottom.lower, this.config.alphaRange.bottom.upper),
                    upper: randomNumber(this.config.alphaRange.top.lower, this.config.alphaRange.top.upper)
                },
                alphaTimes: getRandomIntInclusive(this.config.alphaTimes.lower, this.config.alphaTimes.upper)
            }
        }

        const fillLineDetail = (width) => {
            const pixelLine = [];
            for (let i = 0; i < width; i++) {
                pixelLine.push(getPixelTrailLength());
            }
            return pixelLine;
        }


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
        }


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



