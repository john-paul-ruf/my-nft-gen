import {randomId} from "../../../logic/math/random.js";
import {getWorkingDirectory,} from "../../../logic/core/gobals.js";
import fs from "fs";
import {findValue} from "../../../logic/math/findValue.js";
import {Canvas2dFactory} from "../../../draw/Canvas2dFactory.js";
import {compositeImage} from "../../supporting/compositeImage.js";


async function drawRayRingInstance(withAccentGaston, i, context) {
    const theAccentGaston = withAccentGaston ? findValue(context.data.circles[i].accentRange.lower, context.data.circles[i].accentRange.upper, context.data.circles[i].accentTimes, context.numberOfFrames, context.currentFrame) : 0;
    await context.canvas.drawRing2d(context.data.center, context.data.circles[i].radius, context.data.thickness, context.data.innerColor, (context.data.stroke + theAccentGaston), context.data.circles[i].color)

    let rayIndex = 0;
    for (let a = 0; a < 360; a = a + context.data.circles[i].sparsityFactor) {
        const theLengthGaston = findValue(context.data.circles[i].rays[rayIndex].length.lower, context.data.circles[i].rays[rayIndex].length.upper, context.data.circles[i].rays[rayIndex].lengthTimes, context.numberOfFrames, context.currentFrame);
        await context.canvas.drawRay2d(context.data.center, context.data.stroke, context.data.circles[i].color, context.data.circles[i].color, a, context.data.circles[i].radius, theLengthGaston);
        rayIndex++;
    }
}

const draw = async (filename, withAccentGaston, context) => {
    for (let i = 0; i < context.data.numberOfCircles; i++) {
        await drawRayRingInstance(withAccentGaston, i, context);
    }
    await context.canvas.toFile(filename);
}

export const rayRing = async (data, layer, currentFrame, numberOfFrames) => {

    const context = {
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        drawing: getWorkingDirectory() + 'ray-ring' + randomId() + '.png',
        underlayName: getWorkingDirectory() + 'ray-ring-underlay' + randomId() + '.png',
        canvas: await Canvas2dFactory.getNewCanvas(data.width, data.height),
        data: data
    }

    await draw(context.drawing, false, context);
    await draw(context.underlayName, true, context);
    await compositeImage(draw, context, layer);

    fs.unlinkSync(context.drawing);
    fs.unlinkSync(context.underlayName);

}