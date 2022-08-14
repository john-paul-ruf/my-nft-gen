import {getWorkingDirectory} from "../../../logic/core/gobals.js";
import {Canvas2dFactory} from "../../../draw/Canvas2dFactory.js";
import {findValue} from "../../../logic/math/findValue.js";
import {randomId} from "../../../logic/math/random.js";
import fs from "fs";

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

export const verticalScanLines = async (data, layer, currentFrame, numberOfFrames) => {

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
