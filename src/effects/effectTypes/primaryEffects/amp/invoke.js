import {getWorkingDirectory} from "../../../../core/GlobalSettings.js";
import {randomId} from "../../../../core/math/random.js";
import {Canvas2dFactory} from "../../../../core/factory/canvas/Canvas2dFactory.js";
import fs from "fs";
import {processDrawFunction} from "../../../supporting/processDrawFunction.js";
import {findValue} from "../../../../core/math/findValue.js";
import {compositeImage} from "../../../supporting/compositeImage.js";

const draw = async (context, filenname) => {
    for (let i = 0; i < 360; i = i + context.data.sparsityFactor) {
        await context.canvas.drawRay2d(context.data.center, context.data.stroke, context.data.color, context.data.innerColor, i, context.data.lineStart, context.data.length)
    }
    await context.canvas.toFile(filenname);
}

export const amp = async (layer, data, currentFrame, numberOfFrames) => {
    const context = {
        drawing: getWorkingDirectory() + 'amp' + randomId() + '.png',
        underlayName: getWorkingDirectory() + 'amp-underlay' + randomId() + '.png',
        theAccentGaston: findValue(data.accentRange.lower, data.accentRange.upper, data.accentTimes, numberOfFrames, currentFrame),
        canvas: await Canvas2dFactory.getNewCanvas(data.width, data.height),
        data: data,
    }

    await processDrawFunction(draw, context);
    await compositeImage(context, layer);

    fs.unlinkSync(context.drawing);
    fs.unlinkSync(context.underlayName);
}
