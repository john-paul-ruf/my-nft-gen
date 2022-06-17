import Jimp from "jimp";
import {getRandomInt} from "../logic/random.js";

const config = {
    lines: {lower: 4, upper: 8},
    length: {lower: 5, upper: 25},
    size: 3000,
    color: '#bdf379'
}

const generate = () => {
    const data = {
        numberOfLines: getRandomInt(config.lines.lower, config.lines.upper),
        height: config.size,
        width: config.size,
        color: config.color
    }

    const computeInitialLineInfo = (numberOfLines) => {
        const lineInfo = [];
        for (let i = 0; i <= numberOfLines; i++) {
            const mtl = getRandomInt(config.length.lower, config.length.upper)

            lineInfo.push({
                lineStart: getRandomInt(0, config.size),
                maxTrailLength: mtl,
                pixelsPerGradient: mtl / 16,
            });
        }
        return lineInfo;
    }

    data.lineInfo = computeInitialLineInfo(data.numberOfLines);

    return data;
}

const verticalScanLines = async (data, img, currentFrame, numberOfFrames) => {
    const drawLine = async (y, maxTrailLength, pixelsPerGradient) => {
        for (let x = 0; x < 3000; x++) {
            let rando = getRandomInt(y, y - maxTrailLength)
            for (let curY = y; curY >= rando; curY--) {

                let hex = data.color;
                let upperRange = 3;
                let gradientGroup = (curY-rando) / pixelsPerGradient;
                hex = hex + getRandomInt(gradientGroup < 16 ? gradientGroup : 16, gradientGroup + upperRange < 16 ? gradientGroup + upperRange : 16).toString(16)
                    + getRandomInt(gradientGroup < 16 ? gradientGroup : 16, gradientGroup + upperRange < 16 ? gradientGroup + upperRange : 16).toString(16)

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
    invoke: (data, img, currentFrame, totalFrames) => verticalScanLines(data, img, currentFrame, totalFrames)
}

export const verticalScanLinesEffect = {
    name: 'verticalScanLines',
    generateData: generate,
    effect: effect,
    effectChance: 50,
    requiresLayer: true,
    baseLayer:false,
}

