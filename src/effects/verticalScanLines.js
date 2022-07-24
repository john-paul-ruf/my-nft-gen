import Jimp from "jimp";
import {getRandomIntInclusive} from "../logic/random.js";

const config = {
    lines: {lower: 4, upper: 8},
    length: {lower: 5, upper: 25},
    size: 2000,
    color: '#bdf379'
}

const generate = () => {
    const data = {
        numberOfLines: getRandomIntInclusive(config.lines.lower, config.lines.upper),
        height: config.size,
        width: config.size,
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
                lineStart: getRandomIntInclusive(0, config.size),
                maxTrailLength: mtl,
                pixelsPerGradient: mtl / 16,
            });
        }
        return lineInfo;
    }

    data.lineInfo = computeInitialLineInfo(data.numberOfLines);

    return data;
}

const verticalScanLines = async (data, img, currentFrame, numberOfFrames, card) => {
    const drawLine = async (y, maxTrailLength, pixelsPerGradient) => {
        for (let x = 0; x < data.width; x++) {
            let rando = getRandomIntInclusive(y, y - maxTrailLength)
            for (let curY = y; curY >= rando; curY--) {

                let hex = data.color;
                let upperRange = 3;
                let gradientGroup = (curY-rando) / pixelsPerGradient;
                hex = hex + getRandomIntInclusive(gradientGroup < 16 ? gradientGroup : 16, gradientGroup + upperRange < 16 ? gradientGroup + upperRange : 16).toString(16)
                    + getRandomIntInclusive(gradientGroup < 16 ? gradientGroup : 16, gradientGroup + upperRange < 16 ? gradientGroup + upperRange : 16).toString(16)

                let color = Jimp.cssColorToHex(hex)
                await img.setPixelColor(color, x, curY)
            }
        }
    }

    for (let i = 0; i < data.lineInfo.length; i++) {
        const displacement = (data.height / numberOfFrames) * currentFrame;
        let y = data.lineInfo[i].lineStart + displacement;

        if (y > data.height) {
            y = y - data.height
        }

        await drawLine(y, data.lineInfo[i].maxTrailLength, data.lineInfo[i].pixelsPerGradient)
    }
}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames, card) => verticalScanLines(data, img, currentFrame, totalFrames, card)
}

export const verticalScanLinesEffect = {
    name: 'scan lines',
    generateData: generate,
    effect: effect,
    effectChance: 20,
    requiresLayer: true,
    rotatesImg:false,
    allowsRotation: false,
    rotationTotalAngle: 0,
}

