import {findOneWayValue} from "../../../logic/math/findOneWayValue.js";
import {findValue} from "../../../logic/math/findValue.js";
import {randomId} from "../../../logic/math/random.js";
import {getWorkingDirectory} from "../../../logic/core/gobals.js";
import {Canvas2dFactory} from "../../../draw/Canvas2dFactory.js";
import fs from "fs";
import {compositeImage} from "../../supporting/compositeImage.js";

const draw = async (filename, withAccentGaston, context) => {
    for (let i = 0; i < context.data.numberOfGates; i++) {
        const loopCount = i + 1;
        const direction = loopCount % 2;
        const invert = direction <= 0;
        const theAngleGaston = findOneWayValue(0, 360 / context.data.numberOfSides, context.numberOfFrames, context.currentFrame, invert);
        const theAccentGaston = withAccentGaston ? findValue(context.data.gates[i].accentRange.lower, context.data.gates[i].accentRange.upper, context.data.gates[i].accentTimes, context.numberOfFrames, context.currentFrame) : 0;
        await context.canvas.drawPolygon2d(context.data.gates[i].radius, context.data.center, context.data.numberOfSides, theAngleGaston, context.data.thickness, context.data.innerColor, context.data.stroke + theAccentGaston, context.data.gates[i].color)
    }

    await context.canvas.toFile(filename);
}

export const gates = async (data, layer, currentFrame, numberOfFrames) => {

    const context = {
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        theBlurGaston: Math.ceil(findValue(data.blurRange.lower, data.blurRange.upper, data.blurTimes, numberOfFrames, currentFrame)),
        drawing: getWorkingDirectory() + 'gate' + randomId() + '.png',
        underlayName: getWorkingDirectory() + 'gate-underlay' + randomId() + '.png',
        canvas: await Canvas2dFactory.getNewCanvas(data.width, data.height),
        data: data,
    }

    await compositeImage(draw, context, layer);

    fs.unlinkSync(context.underlayName);
    fs.unlinkSync(context.drawing);
}