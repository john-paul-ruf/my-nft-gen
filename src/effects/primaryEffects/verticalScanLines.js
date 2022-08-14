import {getRandomIntInclusive, randomId} from "../../logic/math/random.js";
import {getColorFromBucket, getFinalImageSize, getWorkingDirectory,} from "../../logic/core/gobals.js";
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

    data.lineInfo = computeInitialLineInfo(data.numberOfLines, data.height, data.width);

    return data;
}

const drawLine = async (y, pixelLine, context) => {
    for (let x = 0; x < context.data.width; x++) {
        const theTrailGaston = findValue(y - pixelLine[x].min, y - pixelLine[x].max, pixelLine[x].times, context.numberOfFrames, context.currentFrame);
        await context.canvas.drawGradientLine2d({x: x, y: y}, {
            x: x, y: theTrailGaston
        }, 1, context.data.color, 'transparent')
    }
}

function computeY(context, numberOfFrames, currentFrame, i) {
    const displacement = (context.data.height / numberOfFrames) * currentFrame;
    let y = context.data.lineInfo[i].lineStart + displacement;

    if (y > context.data.height) {
        y = y - context.data.height
    }
    return y;
}

const verticalScanLines = async (data, layer, currentFrame, numberOfFrames) => {

    const context = {
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        drawing: getWorkingDirectory() + 'scan-lines' + randomId() + '.png',
        canvas: await Canvas2dFactory.getNewCanvas(data.width, data.height),
        data: data,
    }

    for (let i = 0; i < data.lineInfo.length; i++) {
        let y = computeY(context, numberOfFrames, currentFrame, i);
        await drawLine(y, data.lineInfo[i].pixelLine, context)
    }

    await context.canvas.toFile(context.drawing);
    await layer.fromFile(context.drawing)

    fs.unlinkSync(context.drawing);
}

export const effect = {
    invoke: (data, layer, currentFrame, totalFrames) => verticalScanLines(data, layer, currentFrame, totalFrames)
}

export const verticalScanLinesEffect = {
    name: 'scan lines', generateData: generate, effect: effect, effectChance: 50, requiresLayer: true,
}

