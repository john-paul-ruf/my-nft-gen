import {findPointByAngleAndCircle} from "../../../../core/math/drawingMath.js";
import {findValue} from "../../../../core/math/findValue.js";
import {getWorkingDirectory} from "../../../../core/GlobalSettings.js";
import fs from "fs";
import {randomId} from "../../../../core/math/random.js";
import {Canvas2dFactory} from "../../../../core/factory/canvas/Canvas2dFactory.js";
import {findOneWayValue} from "../../../../core/math/findOneWayValue.js";
import {LayerFactory} from "../../../../core/factory/layer/LayerFactory.js";

const drawRing = async (pos, radius, weight, color, context) => {
    const theGaston = findValue(radius, radius + context.data.ripple, context.data.times, context.numberOfFrames, context.currentFrame);
    await context.canvas.drawRing2d(pos, theGaston, weight, color, 0, color)
}

const drawRings = async (context, pos, radius, numberOfRings, color, weight) => {
    for (let i = 0; i < numberOfRings; i++) {
        await drawRing(pos, radius / numberOfRings * i, weight, color, context);
    }
}

const drawUnderlay = async (context, filename) => {

    //outer color
    await drawRings(context, context.data.center, context.data.largeRadius, context.data.largeNumberOfRings, context.data.outerColor, context.data.thickness + context.data.stroke);
    for (let i = 30; i <= 330; i += 60) {
        await drawRings(
            context,
            findPointByAngleAndCircle(context.data.center, i + context.theAngleGaston, context.data.smallerRingsGroupRadius),
            context.data.smallRadius, context.data.smallNumberOfRings,
            context.data.outerColor,
            context.data.thickness + context.data.stroke + context.theAccentGaston);
    }
    await context.canvas.drawPolygon2d(context.data.smallerRingsGroupRadius, context.data.center, 6, 30 + context.theAngleGaston, context.data.thickness, context.data.outerColor, context.data.stroke + context.theAccentGaston, context.data.outerColor)

    await context.canvas.toFile(filename);
}

const draw = async (context, filename) => {

    //inner color
    await drawRings(context, context.data.center, context.data.largeRadius, context.data.largeNumberOfRings, context.data.innerColor, context.data.thickness);
    for (let i = 30; i <= 330; i += 60) {
        await drawRings(
            context,
            findPointByAngleAndCircle(context.data.center, i + context.theAngleGaston, context.data.smallerRingsGroupRadius),
            context.data.smallRadius,
            context.data.smallNumberOfRings,
            context.data.innerColor,
            context.data.thickness);
    }
    await context.canvas.drawPolygon2d(context.data.smallerRingsGroupRadius, context.data.center, 6, 30 + context.theAngleGaston, context.data.thickness, context.data.innerColor, 0, context.data.innerColor)

    await context.canvas.toFile(filename);
}

export const compositeImage = async (context, layer) => {
    let tempLayer = await LayerFactory.getLayerFromFile(context.drawing);
    let underlayLayer = await LayerFactory.getLayerFromFile(context.underlayName);

    await underlayLayer.blur(context.theBlurGaston);

    await underlayLayer.adjustLayerOpacity(context.data.underLayerOpacity);
    await tempLayer.adjustLayerOpacity(context.data.layerOpacity);

    if (!context.data.invertLayers) {
        await layer.compositeLayerOver(underlayLayer);
        await layer.compositeLayerOver(tempLayer);
    } else {
        await layer.compositeLayerOver(tempLayer);
        await layer.compositeLayerOver(underlayLayer);
    }

}

export const processDrawFunction = async (context) => {

    await drawUnderlay(context, context.underlayName);

    context.theAccentGaston = 0;
    context.canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

    await draw(context, context.drawing);
}

export const fuzzyRipple = async (layer, data, currentFrame, numberOfFrames) => {
    const context = {
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        theAccentGaston: findValue(data.accentRange.lower, data.accentRange.upper, data.featherTimes, numberOfFrames, currentFrame),
        theBlurGaston: Math.ceil(findValue(data.blurRange.lower, data.blurRange.upper, data.featherTimes, numberOfFrames, currentFrame)),
        theAngleGaston: findOneWayValue(0, 60, numberOfFrames, currentFrame),
        drawing: getWorkingDirectory() + 'fuzzy-ripples' + randomId() + '.png',
        underlayName: getWorkingDirectory() + 'fuzzy-ripples-underlay' + randomId() + '.png',
        canvas: await Canvas2dFactory.getNewCanvas(data.width, data.height),
        data: data,
    }

    await processDrawFunction(context);
    await compositeImage(context, layer);

    fs.unlinkSync(context.drawing);
    fs.unlinkSync(context.underlayName);
}
