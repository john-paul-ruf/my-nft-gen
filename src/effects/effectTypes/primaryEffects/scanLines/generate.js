import {getRandomIntInclusive} from "../../../../core/math/random.js";
import {getColorFromBucket, getFinalImageSize,} from "../../../../core/GlobalSettings.js";
import {verticalScanLinesEffect} from "./effect.js";

const config = {
    lines: {lower: 2, upper: 5},
    minlength: {lower: 5, upper: 30},
    maxlength: {lower: 150, upper: 300},
    times: {lower: 3, upper: 6},
    color: getColorFromBucket()
}

const getPixelTrailLength = () => {
    return {
        min: getRandomIntInclusive(config.minlength.lower, config.minlength.upper),
        max: getRandomIntInclusive(config.maxlength.lower, config.maxlength.upper),
        times: getRandomIntInclusive(config.times.lower, config.times.upper)
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
            lineStart: getRandomIntInclusive(0, height), pixelLine: fillLineDetail(width),
        });
    }

    return lineInfo;
}

export const generate = () => {

    const finalImageSize = getFinalImageSize();

    const data = {
        numberOfLines: getRandomIntInclusive(config.lines.lower, config.lines.upper),
        height: finalImageSize.height * 1.5,
        width: finalImageSize.width,
        color: config.color,
        getInfo: () => {
            return `${verticalScanLinesEffect.name}: ${data.numberOfLines} lines`
        }
    }

    data.lineInfo = computeInitialLineInfo(data.numberOfLines, data.height, data.width);

    return data;
}
