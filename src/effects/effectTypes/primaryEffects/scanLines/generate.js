import {getRandomIntInclusive, randomNumber} from "../../../../core/math/random.js";
import {getColorFromBucket, getFinalImageSize,} from "../../../../core/GlobalSettings.js";
import {verticalScanLinesEffect} from "./effect.js";

const config = {
    lines: {lower: 8, upper: 12},
    minlength: {lower: 10, upper: 75},
    maxlength: {lower: 75, upper: 550},
    times: {lower: 8, upper: 16},
    alphaRange: {bottom: {lower: 0.3, upper: 0.4}, top: {lower: 0.5, upper: 0.6}},
    alphaTimes: {lower: 1, upper: 8},
    loopTimes: {lower: 1, upper: 2},
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

export const generate = () => {

    const finalImageSize = getFinalImageSize();

    const data = {
        numberOfLines: getRandomIntInclusive(config.lines.lower, config.lines.upper),
        height: finalImageSize.height + (config.maxlength.upper),
        width: finalImageSize.width,
        color: getColorFromBucket(),
        getInfo: () => {
            return `${verticalScanLinesEffect.name}: ${data.numberOfLines} lines`
        }
    }

    data.lineInfo = computeInitialLineInfo(data.numberOfLines, data.height, data.width);

    return data;
}
