import {findValue} from "../../../logic/math/findValue.js";
import {getWorkingDirectory} from "../../../logic/core/gobals.js";
import {randomId} from "../../../logic/math/random.js";
import {Canvas2dFactory} from "../../../draw/Canvas2dFactory.js";
import {compositeImage} from "../../supporting/compositeImage.js";
import fs from "fs";

const draw = async (filename, withAccentGaston, context) => {
    for (let i = 0; i < context.data.numberOfCircles; i++) {
        const loopCount = i + 1;
        const scaleBy = (context.data.scaleFactor * loopCount);
        const theAccentGaston = withAccentGaston ? findValue(context.data.circles[i].accentRange.lower, context.data.circles[i].accentRange.upper, context.data.circles[i].accentTimes, context.numberOfFrames, context.currentFrame) : 0;
        await context.canvas.drawRing2d(context.data.center, context.data.circles[i].radius, context.data.thickness * scaleBy, context.data.innerColor, (context.data.stroke + theAccentGaston) * scaleBy, context.data.circles[i].color)
    }

    await context.canvas.toFile(filename);
}

export const fuzzBands = async (data, layer, currentFrame, numberOfFrames) => {

    const context = {
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        theBlurGaston: Math.ceil(findValue(data.blurRange.lower, data.blurRange.upper, data.blurTimes, numberOfFrames, currentFrame)),
        drawing: getWorkingDirectory() + 'ring' + randomId() + '.png',
        underlayName: getWorkingDirectory() + 'ring-underlay' + randomId() + '.png',
        canvas: await Canvas2dFactory.getNewCanvas(data.width, data.height),
        data: data,
    }

    await compositeImage(draw, context, layer);

    fs.unlinkSync(context.drawing);
    fs.unlinkSync(context.underlayName);

}
