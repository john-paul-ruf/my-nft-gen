import {getRandomIntInclusive, randomId} from "../../logic/random.js";
import {getColorFromBucket, IMAGESIZE, WORKINGDIRETORY} from "../../logic/gobals.js";
import {createCanvas} from "canvas";
import {drawGradientLine2d} from "../../draw/drawGradientLine2d.js";
import fs from "fs";

const config = {
    size: IMAGESIZE,
    lines: {lower: 4, upper: 8},
    length: {lower: 5, upper: 75},
    color: getColorFromBucket()
}

const generate = () => {
    const data = {
        numberOfLines: getRandomIntInclusive(config.lines.lower, config.lines.upper),
        height: IMAGESIZE,
        width: IMAGESIZE,
        color: config.color,
        getInfo: () => {
            return `${verticalScanLinesEffect.name}: ${data.numberOfLines} total lines with a min length of ${config.length.lower} and a max length of ${config.length.upper}`
        }
    }

    const computeInitialLineInfo = (numberOfLines) => {
        const lineInfo = [];
        for (let i = 0; i <= numberOfLines; i++) {
            const mtl = getRandomIntInclusive(config.length.lower, config.length.upper)

            lineInfo.push({
                lineStart: getRandomIntInclusive(0, IMAGESIZE),
                maxTrailLength: mtl
            });
        }
        return lineInfo;
    }

    data.lineInfo = computeInitialLineInfo(data.numberOfLines);

    return data;
}

const verticalScanLines = async (data, layer, currentFrame, numberOfFrames) => {
    const imgName = WORKINGDIRETORY + 'scan-lines' + randomId() + '.png';
    const canvas = createCanvas(config.size, config.size)
    const context = canvas.getContext('2d');


    const drawLine = async (y, maxTrailLength) => {
        for (let x = 0; x < data.width; x++) {
            let rando = getRandomIntInclusive(y, y - maxTrailLength)
            drawGradientLine2d(context, {x: x, y: y}, {x: x, y: rando}, 1, data.color, 'transparent')
        }
    }

    for (let i = 0; i < data.lineInfo.length; i++) {
        const displacement = (data.height / numberOfFrames) * currentFrame;
        let y = data.lineInfo[i].lineStart + displacement;

        if (y > data.height) {
            y = y - data.height
        }

        await drawLine(y, data.lineInfo[i].maxTrailLength)
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
    effectChance: 40,
    requiresLayer: true,
}

