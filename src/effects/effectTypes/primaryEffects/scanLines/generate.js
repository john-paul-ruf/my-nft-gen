import {getRandomIntInclusive, randomNumber} from "../../../../core/math/random.js";
import {getColorFromBucket, getFinalImageSize,} from "../../../../core/GlobalSettings.js";
import {verticalScanLinesEffect} from "./effect.js";

const config = {
    lines: {lower: 3, upper: 6},
    minlength: {lower: 5, upper: 25},
    maxlength: {lower: 40, upper: 75},
    times: {lower: 4, upper: 8},
    alphaRange: {bottom: {lower: 0.3, upper: 0.4}, top: {lower: 0.5, upper: 0.6}},
    alphaTimes: {lower: 4, upper: 8},
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
        height: (finalImageSize.height * 1.5),
        width: (finalImageSize.width * 1.5),
        color: getColorFromBucket(),
        getInfo: () => {
            return `${verticalScanLinesEffect.name}: ${data.numberOfLines} lines`
        }
    }

    data.lineInfo = computeInitialLineInfo(data.numberOfLines, data.height, data.width);

    return data;
}
