import Jimp from "jimp";
import {getRandomIntInclusive} from "../../logic/random.js";
import {getColorFromBucket, IMAGESIZE} from "../../logic/gobals.js";

const config = {
    lines: {lower: 4, upper: 8},
    length: {lower: 5, upper: 25},
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

const verticalScanLines = async (data, img, currentFrame, numberOfFrames) => {

    const overlay = new Jimp(IMAGESIZE, IMAGESIZE)

    const drawLine = async (y, maxTrailLength) => {
        const hex = Jimp.cssColorToHex(data.color)
        for (let x = 0; x < data.width; x++) {
            let rando = getRandomIntInclusive(y, y - maxTrailLength)
            for (let curY = y; curY >= rando; curY--) {
                await overlay.setPixelColor(hex, x, curY)
            }
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

    await overlay.opacity(0.75);

    await img.composite(overlay, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
    });
}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames) => verticalScanLines(data, img, currentFrame, totalFrames)
}

export const verticalScanLinesEffect = {
    name: 'scan lines',
    generateData: generate,
    effect: effect,
    effectChance: 40,
    requiresLayer: true,
    rotatesImg: false,
    allowsRotation: false,
    rotationTotalAngle: 0,
}

