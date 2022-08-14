//n2, nextTerm, -twistCount
import {findPointByAngleAndCircle} from "../../../logic/math/drawingMath.js";
import {findValue} from "../../../logic/math/findValue.js";
import {getWorkingDirectory} from "../../../logic/core/gobals.js";
import {randomId} from "../../../logic/math/random.js";
import {Canvas2dFactory} from "../../../draw/Canvas2dFactory.js";
import {compositeImage} from "../../supporting/compositeImage.js";
import fs from "fs";

const drawRay = async (stroke, angle, loopControl, context) => {
    angle = angle + (((context.data.sparsityFactor * context.data.speed) / context.numberOfFrames) * context.currentFrame) * context.direction;

    const start = findPointByAngleAndCircle(context.data.center, angle, loopControl.n2 + context.data.radiusConstant)
    const end = findPointByAngleAndCircle(context.data.center, angle + (loopControl.twistCount * context.data.sparsityFactor), loopControl.nextTerm + context.data.radiusConstant);

    await context.canvas.drawGradientLine2d(start, end, stroke, context.data.color1, context.data.color2);
}

const draw = async (filename, accentBoost, context) => {
    const loopControl = {
        twistCount: 2,
        n1: context.data.unitLength,
        n2: context.data.unitLength,
        nextTerm: context.data.unitLength + context.data.unitLength
    }

    while (loopControl.nextTerm <= context.data.width) {

        for (let i = 0; i < 360; i = i + context.data.sparsityFactor) {
            await drawRay(context.data.stroke + accentBoost, i, loopControl, context)
            await drawRay(context.data.stroke + accentBoost, i, loopControl, context)
        }

        //assignment for next loop
        loopControl.twistCount++;
        loopControl.n1 = loopControl.n2;
        loopControl.n2 = loopControl.nextTerm;
        loopControl.nextTerm = loopControl.n1 + loopControl.n2;
    }

    await context.canvas.toFile(filename)
}

export const wireframeSpiral = async (data, layer, currentFrame, numberOfFrames) => {

    const context = {
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        theAccentGaston: findValue(0, 20, 1, numberOfFrames, currentFrame),
        drawing: getWorkingDirectory() + 'wireframe-spiral' + randomId() + '.png',
        underlayName: getWorkingDirectory() + 'wireframe-spiral-underlay' + randomId() + '.png',
        canvas: await Canvas2dFactory.getNewCanvas(data.width, data.height),
        data: data,
    }

    await compositeImage(draw, context, layer);

    fs.unlinkSync(context.underlayName);
    fs.unlinkSync(context.drawing);
}