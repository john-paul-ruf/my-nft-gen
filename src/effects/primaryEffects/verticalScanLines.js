import {getRandomIntInclusive, randomId} from "../../logic/math/random.js";
import {
    getCanvasStrategy,
    getColorFromBucket,
    getFinalImageSize,
    getWorkingDirectory,
} from "../../logic/core/gobals.js";
import fs from "fs";
import {findValue} from "../../logic/math/findValue.js";
import {Canvas2dFactory} from "../../draw/Canvas2dFactory.js";

const config = {
    lines: {lower: 2, upper: 5},
    minlength: {lower: 5, upper: 30},
    maxlength: {lower: 150, upper: 300},
    times: {lower: 3, upper: 6},
    color: getColorFromBucket()
}

const generate = () => {

    const finalImageSize = getFinalImageSize();

    const data = {
        numberOfLines: getRandomIntInclusive(config.lines.lower, config.lines.upper),
        height: finalImageSize.height,
        width: finalImageSize.width,
        color: config.color,
        getInfo: () => {
            return `${verticalScanLinesEffect.name}: ${data.numberOfLines} lines`
        }
    }

    const computeInitialLineInfo = (numberOfLines) => {
        const lineInfo = [];

        const getPixelTrailLength = () => {
            return {
                min: getRandomIntInclusive(config.minlength.lower, config.minlength.upper),
                max: getRandomIntInclusive(config.maxlength.lower, config.maxlength.upper),
                times: getRandomIntInclusive(config.times.lower, config.times.upper)
            }
        }

        const fillLineDetail = () => {
            const pixelLine = [];
            for (let i = 0; i < data.width; i++) {
                pixelLine.push(getPixelTrailLength());
            }
            return pixelLine;
        }

        for (let i = 0; i <= numberOfLines; i++) {
            lineInfo.push({
                lineStart: getRandomIntInclusive(0, data.height),
                pixelLine: fillLineDetail(),
            });
        }
        return lineInfo;
    }

    data.lineInfo = computeInitialLineInfo(data.numberOfLines);

    return data;
}

const verticalScanLines = async (data, layer, currentFrame, numberOfFrames) => {
    const imgName = getWorkingDirectory() + 'scan-lines' + randomId() + '.png';

    const canvas = await Canvas2dFactory.getNewCanvas(getCanvasStrategy(), data.width, data.height);

    const drawLine = async (y, pixelLine) => {
        for (let x = 0; x < data.width; x++) {
            const theTrailGaston = findValue(y - pixelLine[x].min, y - pixelLine[x].max, pixelLine[x].times, numberOfFrames, currentFrame);
            await canvas.drawGradientLine2d({x: x, y: y}, {x: x, y: theTrailGaston}, 1, data.color, 'transparent')
        }
    }

    for (let i = 0; i < data.lineInfo.length; i++) {
        const displacement = (data.height / numberOfFrames) * currentFrame;
        let y = data.lineInfo[i].lineStart + displacement;

        if (y > data.height) {
            y = y - data.height
        }

        await drawLine(y, data.lineInfo[i].pixelLine)
    }

    await canvas.toFile(imgName);

    await layer.fromFile(imgName)

    fs.unlinkSync(imgName);
}

export const effect = {
    invoke: (data, layer, currentFrame, totalFrames) => verticalScanLines(data, layer, currentFrame, totalFrames)
}

export const verticalScanLinesEffect = {
    name: 'scan lines', generateData: generate, effect: effect, effectChance: 50, requiresLayer: true,
}

