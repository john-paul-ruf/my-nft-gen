import {findOneWayValue} from "../../../core/math/findOneWayValue.js";
import {findPointByAngleAndCircle} from "../../../core/math/drawingMath.js";
import {findValue} from "../../../core/math/findValue.js";
import {randomId} from "../../../core/math/random.js";
import {Canvas2dFactory} from "../../../core/factory/canvas/Canvas2dFactory.js";
import fs from "fs";
import {GlobalSettings} from "../../../core/GlobalSettings.js";
import {LayerFactory} from "../../../core/factory/layer/LayerFactory.js";


const drawHexLine = async (angle, index, context) => {

    const finalImageSize = GlobalGlobalSettings.getFinalImageSize();

    const loopCount = index + 1;
    const direction = loopCount % 2;
    const invert = direction <= 0;

    const theAngleGaston = findOneWayValue(angle + 30, angle + 30 + context.data.sparsityFactor, context.numberOfFrames, context.currentFrame, invert);
    const theRotateGaston = findOneWayValue(theAngleGaston, theAngleGaston + 360, context.numberOfFrames, context.currentFrame, invert)

    const scaleBy = (context.data.scaleFactor * loopCount);
    const radius = context.data.radiusFactor * scaleBy;
    const gapRadius = ((finalImageSize.height * .05) + radius + (context.data.gapFactor * scaleBy) * loopCount)
    const pos = findPointByAngleAndCircle(context.data.center, theAngleGaston, gapRadius)

    switch (context.data.strategy) {
        case 'rotate':
            await context.canvas.drawPolygon2d(radius, pos, 6, theRotateGaston, context.data.thickness * scaleBy, context.data.innerColor, (context.data.stroke + context.accentBoost) * scaleBy, context.data.color)
            break;
        case 'angle':
            await context.canvas.drawPolygon2d(radius, pos, 6, theAngleGaston, context.data.thickness * scaleBy, context.data.innerColor, (context.data.stroke + context.accentBoost) * scaleBy, context.data.color)
            break;
        case 'static':
            await context.canvas.drawPolygon2d(radius, pos, 6, 30, context.data.thickness * scaleBy, context.data.innerColor, (context.data.stroke + context.accentBoost) * scaleBy, context.data.color)
            break;
    }
}

const drawHexLineOuter = async (angle, index, context) => {

    const finalImageSize = GlobalGlobalSettings.getFinalImageSize();

    const loopCount = index + 1;
    const direction = loopCount % 2;
    const invert = direction <= 0;

    const theAngleGaston = findOneWayValue(angle + 30, angle + 30 + context.data.sparsityFactor, context.numberOfFrames, context.currentFrame, invert);
    const theRotateGaston = findOneWayValue(theAngleGaston, theAngleGaston + 360, context.numberOfFrames, context.currentFrame, invert)

    const scaleBy = (context.data.scaleFactor * loopCount);
    const radius = context.data.radiusFactor * scaleBy;
    const gapRadius = ((finalImageSize.height * .05) + radius + (context.data.gapFactor * scaleBy) * loopCount)
    const pos = findPointByAngleAndCircle(context.data.center, theAngleGaston, gapRadius)

    switch (context.data.strategy) {
        case 'rotate':
            await context.canvas.drawPolygon2d(radius, pos, 6, theRotateGaston, context.data.thickness * scaleBy, context.data.color, (context.data.stroke + context.accentBoost) * scaleBy, context.data.color)
            break;
        case 'angle':
            await context.canvas.drawPolygon2d(radius, pos, 6, theAngleGaston, context.data.thickness * scaleBy, context.data.color, (context.data.stroke + context.accentBoost) * scaleBy, context.data.color)
            break;
        case 'static':
            await context.canvas.drawPolygon2d(radius, pos, 6, 30, context.data.thickness * scaleBy, context.data.color, (context.data.stroke + context.accentBoost) * scaleBy, context.data.color)
            break;
    }
}

const drawHexLineInner = async (angle, index, context) => {

    const finalImageSize = GlobalGlobalSettings.getFinalImageSize();

    const loopCount = index + 1;
    const direction = loopCount % 2;
    const invert = direction <= 0;

    const theAngleGaston = findOneWayValue(angle + 30, angle + 30 + context.data.sparsityFactor, context.numberOfFrames, context.currentFrame, invert);
    const theRotateGaston = findOneWayValue(theAngleGaston, theAngleGaston + 360, context.numberOfFrames, context.currentFrame, invert)

    const scaleBy = (context.data.scaleFactor * loopCount);
    const radius = context.data.radiusFactor * scaleBy;
    const gapRadius = ((finalImageSize.height * .05) + radius + (context.data.gapFactor * scaleBy) * loopCount)
    const pos = findPointByAngleAndCircle(context.data.center, theAngleGaston, gapRadius)

    switch (context.data.strategy) {
        case 'rotate':
            await context.canvas.drawPolygon2d(radius, pos, 6, theRotateGaston, context.data.thickness * scaleBy, context.data.innerColor, 0, context.data.innerColor)
            break;
        case 'angle':
            await context.canvas.drawPolygon2d(radius, pos, 6, theAngleGaston, context.data.thickness * scaleBy, context.data.innerColor, 0, context.data.innerColor)
            break;
        case 'static':
            await context.canvas.drawPolygon2d(radius, pos, 6, 30, context.data.thickness * scaleBy, context.data.innerColor, 0, context.data.innerColor)
            break;
    }
}


const draw = async (context, filename) => {
    context.accentBoost = context.theAccentGaston;

    switch (context.data.overlayStrategy) {
        case 'overlay':
            for (let i = 0; i < context.data.numberOfHex; i++) {
                for (let a = 0; a < 360; a = a + context.data.sparsityFactor) {
                    await drawHexLine(a, i, context)
                }
            }
            break;
        case 'flat':
            for (let i = 0; i < context.data.numberOfHex; i++) {
                for (let a = 0; a < 360; a = a + context.data.sparsityFactor) {
                    await drawHexLineOuter(a, i, context)
                }
            }

            for (let i = 0; i < context.data.numberOfHex; i++) {
                for (let a = 0; a < 360; a = a + context.data.sparsityFactor) {
                    await drawHexLineInner(a, i, context)
                }
            }
            break;
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

export const processDrawFunction = async (draw, context) => {

    await draw(context, context.underlayName);

    context.theAccentGaston = 0;
    context.canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

    await draw(context, context.drawing);
}

export const hex = async (layer, data, currentFrame, numberOfFrames) => {

    const context = {
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        theAccentGaston: findValue(data.accentRange.lower, data.accentRange.upper, data.featherTimes, numberOfFrames, currentFrame),
        theBlurGaston: Math.ceil(findValue(data.blurRange.lower, data.blurRange.upper, data.featherTimes, numberOfFrames, currentFrame)),
        drawing: GlobalSettings.getWorkingDirectory() + 'hex' + randomId() + '.png',
        underlayName: GlobalSettings.getWorkingDirectory() + 'hex-under' + randomId() + '.png',
        canvas: await Canvas2dFactory.getNewCanvas(data.width, data.height),
        data: data,
    }

    await processDrawFunction(draw, context);
    await compositeImage(context, layer);

    fs.unlinkSync(context.drawing);
    fs.unlinkSync(context.underlayName);
}