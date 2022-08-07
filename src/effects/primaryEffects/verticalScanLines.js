import {getRandomIntInclusive, randomId} from "../../logic/math/random.js";
import {getColorFromBucket, IMAGEHEIGHT, IMAGEWIDTH, WORKINGDIRETORY} from "../../logic/core/gobals.js";
import {createCanvas} from "canvas";
import {drawGradientLine2d} from "../../draw/drawGradientLine2d.js";
import fs from "fs";
import {findValue} from "../../logic/math/findValue.js";

const config = {
    lines: {lower: 4, upper: 8},
    minlength: {lower: 5, upper: 30},
    maxlength: {lower: 40, upper: 100},
    times: {lower: 1, upper: 10},
    color: getColorFromBucket()
}

const generate = () => {
    const data = {
        numberOfLines: getRandomIntInclusive(config.lines.lower, config.lines.upper),
        height: IMAGEHEIGHT,
        width: IMAGEWIDTH,
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
                max: getRandomIntInclusive(config.maxlength.lower, config.maxlength.upper)
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
                times: getRandomIntInclusive(config.times.lower, config.times.upper),
            });
        }
        return lineInfo;
    }

    data.lineInfo = computeInitialLineInfo(data.numberOfLines);

    return data;
}

const verticalScanLines = async (data, layer, currentFrame, numberOfFrames) => {
    const imgName = WORKINGDIRETORY + 'scan-lines' + randomId() + '.png';
    const canvas = createCanvas(data.width, data.height)
    const context = canvas.getContext('2d');


    const drawLine = async (y, pixelLine, times) => {
        for (let x = 0; x < data.width; x++) {
            const theTrailGaston = findValue(y - pixelLine[x].min, y - pixelLine[x].max, times, numberOfFrames, currentFrame);
            drawGradientLine2d(context, {x: x, y: y}, {x: x, y: theTrailGaston}, 1, data.color, 'transparent')
        }
    }

    for (let i = 0; i < data.lineInfo.length; i++) {
        const displacement = (data.height / numberOfFrames) * currentFrame;
        let y = data.lineInfo[i].lineStart + displacement;

        if (y > data.height) {
            y = y - data.height
        }

        await drawLine(y, data.lineInfo[i].pixelLine, data.lineInfo[i].times)
    }

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(imgName, buffer);

    await layer.fromFile(imgName)

    fs.unlinkSync(imgName);
}

export const effect = {
    invoke: (data, layer, currentFrame, totalFrames) => verticalScanLines(data, layer, currentFrame, totalFrames)
}

export const verticalScanLinesEffect = {
    name: 'scan lines',
    generateData: generate,
    effect: effect,
    effectChance: 50,
    requiresLayer: true,
}

