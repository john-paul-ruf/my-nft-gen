import {findPointByAngleAndCircle} from "../../../logic/math/drawingMath.js";
import {findValue} from "../../../logic/math/findValue.js";
import {getWorkingDirectory} from "../../../logic/core/gobals.js";
import fs from "fs";
import {compositeImage} from "../../supporting/compositeImage.js";
import {randomId} from "../../../logic/math/random.js";
import {Canvas2dFactory} from "../../../draw/Canvas2dFactory.js";

const drawRing = async (pos, radius, innerStroke, innerColor, outerStroke, outerColor, context) => {
    const theGaston = findValue(radius, radius + context.data.ripple, context.data.times, context.numberOfFrames, context.currentFrame);
    await context.canvas.drawRing2d(pos, theGaston, innerStroke, innerColor, outerStroke + context.accentBoost, outerColor)
}

const drawRings = async (pos, color, radius, numberOfRings, context) => {
    for (let i = 0; i < numberOfRings; i++) {
        await drawRing(pos, radius / numberOfRings * i, context.data.thickness, context.data.innerColor, context.data.stroke, color, context);
    }
}

const draw = async (filename, accentBoost, context) => {
    context.accentBoost = accentBoost;

    await drawRings(findPointByAngleAndCircle(context.data.center, 30, context.data.smallerRingsGroupRadius), context.data.smallColor, context.data.smallRadius, context.data.smallNumberOfRings, context);
    await drawRings(findPointByAngleAndCircle(context.data.center, 90, context.data.smallerRingsGroupRadius), context.data.smallColor, context.data.smallRadius, context.data.smallNumberOfRings, context);
    await drawRings(findPointByAngleAndCircle(context.data.center, 150, context.data.smallerRingsGroupRadius), context.data.smallColor, context.data.smallRadius, context.data.smallNumberOfRings, context);
    await drawRings(findPointByAngleAndCircle(context.data.center, 210, context.data.smallerRingsGroupRadius), context.data.smallColor, context.data.smallRadius, context.data.smallNumberOfRings, context);
    await drawRings(findPointByAngleAndCircle(context.data.center, 270, context.data.smallerRingsGroupRadius), context.data.smallColor, context.data.smallRadius, context.data.smallNumberOfRings, context);
    await drawRings(findPointByAngleAndCircle(context.data.center, 330, context.data.smallerRingsGroupRadius), context.data.smallColor, context.data.smallRadius, context.data.smallNumberOfRings, context);

    await drawRings(context.data.center, context.data.largeColor, context.data.largeRadius, context.data.largeNumberOfRings, context);

    await context.canvas.drawPolygon2d(context.data.smallerRingsGroupRadius, context.data.center, 6, 30, context.data.thickness + accentBoost, context.data.innerColor, context.data.stroke, context.data.smallColor)

    await context.canvas.toFile(filename);
}

export const fuzzyRipple = async (data, layer, currentFrame, numberOfFrames) => {
    const context = {
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        theBlurGaston: Math.ceil(findValue(data.blurRange.lower, data.blurRange.upper, data.blurTimes, numberOfFrames, currentFrame)),
        drawing: getWorkingDirectory() + 'fuzzy-ripples' + randomId() + '.png',
        underlayName: getWorkingDirectory() + 'fuzzy-ripples-underlay' + randomId() + '.png',
        canvas: await Canvas2dFactory.getNewCanvas(data.width, data.height),
        data: data,
    }

    await compositeImage(draw, context, layer);

    fs.unlinkSync(context.drawing);
    fs.unlinkSync(context.underlayName);
}
