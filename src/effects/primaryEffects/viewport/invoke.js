import {findValue} from "../../../logic/math/findValue.js";
import {getWorkingDirectory} from "../../../logic/core/gobals.js";
import {randomId} from "../../../logic/math/random.js";
import {Canvas2dFactory} from "../../../draw/Canvas2dFactory.js";
import {compositeImage} from "../../supporting/compositeImage.js";
import fs from "fs";

const draw = async (imgName, accentBoost, context) => {
    const theAmpGaston = findValue(context.data.ampRadius, context.data.ampRadius + context.data.ampLength + context.data.amplitude, context.data.times, context.numberOfFrames, context.currentFrame);
    await context.canvas.drawRays2d(context.data.center, context.data.ampRadius, theAmpGaston, context.data.sparsityFactor, context.data.ampThickness, context.data.ampInnerColor, context.data.ampStroke + accentBoost, context.data.ampOuterColor)

    const thePolyGaston = findValue(context.data.radius, context.data.radius + context.data.amplitude, context.data.times, context.numberOfFrames, context.currentFrame);
    await context.canvas.drawPolygon2d(thePolyGaston, context.data.center, 3, 210, context.data.thickness, context.data.innerColor, context.data.stroke + accentBoost, context.data.color)

    await context.canvas.toFile(imgName);
}

export const viewport = async (data, layer, currentFrame, numberOfFrames) => {

    const context = {
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        theAccentGaston: findValue(0, 20, 1, numberOfFrames, currentFrame),
        drawing: getWorkingDirectory() + 'viewport' + randomId() + '.png',
        underlayName: getWorkingDirectory() + 'viewport-underlay' + randomId() + '.png',
        canvas: await Canvas2dFactory.getNewCanvas(data.width, data.height),
        data: data,
    }

    await compositeImage(draw, context, layer);

    fs.unlinkSync(context.drawing);
}