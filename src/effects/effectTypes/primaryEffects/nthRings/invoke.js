import {findPointByAngleAndCircle} from "../../../../core/math/drawingMath.js";
import {findValue} from "../../../../core/math/findValue.js";
import {getWorkingDirectory} from "../../../../core/GlobalSettings.js";
import fs from "fs";
import {randomId} from "../../../../core/math/random.js";
import {Canvas2dFactory} from "../../../../core/factory/canvas/Canvas2dFactory.js";
import {findOneWayValue} from "../../../../core/math/findOneWayValue.js";
import {LayerFactory} from "../../../../core/factory/layer/LayerFactory.js";

const drawRing = async (pos, radius, innerStroke, innerColor, outerStroke, outerColor, context) => {
    const theGaston = findValue(radius, radius + context.data.ripple, context.data.times, context.numberOfFrames, context.currentFrame);
    await context.canvas.drawRing2d(pos, theGaston, innerStroke, innerColor, outerStroke, outerColor)
}

const drawRings = async (pos, color, radius, numberOfRings, context, weight) => {
    for (let i = 0; i < numberOfRings; i++) {
        await drawRing(pos, radius / numberOfRings * i, weight, color, 0, color, context);
    }
}

const draw = async (context, filename) => {

    const angle = (360 / context.data.totalRingCount);

    const theAngleGaston = findOneWayValue(0, angle, context.numberOfFrames, context.currentFrame)

    for (let i = 0; i < 360; i += angle) {
        await drawRings(
            findPointByAngleAndCircle(context.data.center, i + theAngleGaston, context.data.smallerRingsGroupRadius),
            context.data.innerColor,
            context.data.smallRadius,
            context.data.smallNumberOfRings,
            context,
            context.data.thickness
        );
    }

    await context.canvas.toFile(filename);
}

const drawUnderlay = async (context, filename) => {

    const angle = (360 / context.data.totalRingCount);

    const theAngleGaston = findOneWayValue(0, angle, context.numberOfFrames, context.currentFrame)

    for (let i = 0; i < 360; i += angle) {
        await drawRings(
            findPointByAngleAndCircle(context.data.center, i + theAngleGaston, context.data.smallerRingsGroupRadius),
            context.data.outerColor,
            context.data.smallRadius,
            context.data.smallNumberOfRings,
            context,
            context.data.thickness + context.data.stroke + context.theAccentGaston);
    }

    await context.canvas.toFile(filename);
}

export const compositeImage = async (context, layer) => {
    let tempLayer = await LayerFactory.getLayerFromFile(context.drawing);
    let underlayLayer = await LayerFactory.getLayerFromFile(context.underlayName);

    await underlayLayer.blur(context.theBlurGaston);

    await underlayLayer.adjustLayerOpacity(context.data.underLayerOpacity);
    await tempLayer.adjustLayerOpacity(context.data.layerOpacity);

    await layer.compositeLayerOver(underlayLayer);
    await layer.compositeLayerOver(tempLayer);

}

export const processDrawFunction = async (context) => {

    await drawUnderlay(context, context.underlayName);

    context.theAccentGaston = 0;
    context.canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

    await draw(context, context.drawing);
}

export const nthRings = async (layer, data, currentFrame, numberOfFrames) => {
    const context = {
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        theAccentGaston: findValue(data.accentRange.lower, data.accentRange.upper, data.featherTimes, numberOfFrames, currentFrame),
        theBlurGaston: Math.ceil(findValue(data.blurRange.lower, data.blurRange.upper, data.featherTimes, numberOfFrames, currentFrame)),
        drawing: getWorkingDirectory() + 'nth-rings' + randomId() + '.png',
        underlayName: getWorkingDirectory() + 'nth-rings-underlay' + randomId() + '.png',
        canvas: await Canvas2dFactory.getNewCanvas(data.width, data.height),
        data: data,
    }

    await processDrawFunction(context);
    await compositeImage(context, layer);

    fs.unlinkSync(context.drawing);
    fs.unlinkSync(context.underlayName);
}
