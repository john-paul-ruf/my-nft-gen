import {getRandomIntInclusive, randomNumber} from "../../../core/math/random.js";
import {verticalScanLinesEffect} from "./effect.js";
import {GlobalSettings} from "../../../core/GlobalSettings.js";



export const generate = async (settings) => {

    const finalImageSize = GlobalSettings.getFinalImageSize();

    const config = {
        lines: {lower: 2, upper: 4},
        minlength: {lower: 30, upper: 40},
        maxlength: {lower: 80, upper: 100},
        times: {lower: 4, upper: 8},
        alphaRange: {bottom: {lower: 0.3, upper: 0.4}, top: {lower: 0.5, upper: 0.6}},
        alphaTimes: {lower: 4, upper: 8},
        loopTimes: {lower: 1, upper: 2},
    }


    const data = {
        numberOfLines: getRandomIntInclusive(config.lines.lower, config.lines.upper),
        height: (finalImageSize.height * 1.5),
        width: (finalImageSize.width * 1.5),
        color: await settings.getColorFromBucket(),
        getInfo: () => {
            return `${verticalScanLinesEffect.name}: ${data.numberOfLines} lines`
        }
    }

    const getPixelTrailLength = () => {
        return {
            min: getRandomIntInclusive(config.minlength.lower, config.minlength.upper),
            max: getRandomIntInclusive(config.maxlength.lower, config.maxlength.upper),
            times: getRandomIntInclusive(config.times.lower, config.times.upper),
            alphaRange: {
                lower: randomNumber(config.alphaRange.bottom.lower, config.alphaRange.bottom.upper),
                upper: randomNumber(config.alphaRange.top.lower, config.alphaRange.top.upper)
            },
            alphaTimes: getRandomIntInclusive(config.alphaTimes.lower, config.alphaTimes.upper)
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
                loopTimes: getRandomIntInclusive(config.loopTimes.lower, config.loopTimes.upper),
            });
        }

        return lineInfo;
    }


    data.lineInfo = computeInitialLineInfo(data.numberOfLines, data.height, data.width);

    return data;
}
