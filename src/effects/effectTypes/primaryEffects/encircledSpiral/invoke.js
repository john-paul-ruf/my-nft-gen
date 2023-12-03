//n2, nextTerm, -twistCount
import {findPointByAngleAndCircle} from "../../../../core/math/drawingMath.js";
import {getWorkingDirectory} from "../../../../core/GlobalSettings.js";
import {randomId} from "../../../../core/math/random.js";
import {Canvas2dFactory} from "../../../../core/factory/canvas/Canvas2dFactory.js";
import fs from "fs";
import {LayerFactory} from "../../../../core/factory/layer/LayerFactory.js";
import {findValue} from "../../../../core/math/findValue.js";

const drawLine = async (angle, context, flipTwist, thickness, color, ringIndex, sequenceIndex) => {
    const direction = ringIndex % 2 > 0 ? -1 : 1;
    angle = angle + (((context.data.ringArray[ringIndex].sparsityFactor * context.data.ringArray[ringIndex].speed) / context.numberOfFrames) * context.currentFrame) * direction;

    const pointOne = context.data.sequence[sequenceIndex] * context.data.sequencePixelConstant;
    const pointTwo = context.data.sequence[sequenceIndex + 1] * context.data.sequencePixelConstant;

    const start = findPointByAngleAndCircle(context.data.center, angle, pointOne)
    const end = findPointByAngleAndCircle(context.data.center, (angle + context.data.ringArray[ringIndex].sparsityFactor * flipTwist), pointTwo);


    await context.canvas.drawLine2d(start, end, thickness, color, 0, color);
}

async function drawBottomLayer(context, ringIndex) {
    const theAccentGaston = findValue(context.data.ringArray[ringIndex].accentRange.lower, context.data.ringArray[ringIndex].accentRange.upper, context.data.ringArray[ringIndex].featherTimes, context.numberOfFrames, context.currentFrame);
    for (let sequenceIndex = context.data.ringArray[ringIndex].minSequenceIndex; sequenceIndex <= context.data.ringArray[ringIndex].minSequenceIndex + context.data.ringArray[ringIndex].numberOfSequenceElements; sequenceIndex++) {
        for (let i = 0; i < 360; i = i + context.data.ringArray[ringIndex].sparsityFactor) {
            await drawLine(i, context, 1, context.data.ringArray[ringIndex].stroke + context.data.ringArray[ringIndex].thickness + theAccentGaston, context.data.ringArray[ringIndex].outerColor, ringIndex, sequenceIndex);
            await drawLine(i, context, -1, context.data.ringArray[ringIndex].stroke + context.data.ringArray[ringIndex].thickness + theAccentGaston, context.data.ringArray[ringIndex].outerColor, ringIndex, sequenceIndex);

            await drawLine(i, context, 1, context.data.ringArray[ringIndex].stroke, context.data.ringArray[ringIndex].innerColor, ringIndex, sequenceIndex);
            await drawLine(i, context, -1, context.data.ringArray[ringIndex].stroke, context.data.ringArray[ringIndex].innerColor, ringIndex, sequenceIndex);
        }
    }
}

async function drawTopLayer(context, ringIndex) {
    for (let sequenceIndex = context.data.ringArray[ringIndex].minSequenceIndex; sequenceIndex <= context.data.ringArray[ringIndex].minSequenceIndex + context.data.ringArray[ringIndex].numberOfSequenceElements; sequenceIndex++) {
        for (let i = 0; i < 360; i = i + context.data.ringArray[ringIndex].sparsityFactor) {
            await drawLine(i, context, 1, context.data.ringArray[ringIndex].stroke + context.data.ringArray[ringIndex].thickness, context.data.ringArray[ringIndex].outerColor, ringIndex, sequenceIndex);
            await drawLine(i, context, -1, context.data.ringArray[ringIndex].stroke + context.data.ringArray[ringIndex].thickness, context.data.ringArray[ringIndex].outerColor, ringIndex, sequenceIndex);

            await drawLine(i, context, 1, context.data.ringArray[ringIndex].stroke, context.data.ringArray[ringIndex].innerColor, ringIndex, sequenceIndex);
            await drawLine(i, context, -1, context.data.ringArray[ringIndex].stroke, context.data.ringArray[ringIndex].innerColor, ringIndex, sequenceIndex);
        }
    }
}

const draw = async (context, filename) => {

    for (let i = 0; i < context.data.ringArray.length; i++) {

        if (!context.data.invertLayers) {
            //bottom layer
            context.canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);
            await drawBottomLayer(context, i);
            await context.canvas.toFile(filename)
            const bottomLayer = await LayerFactory.getLayerFromFile(context.drawing);
            const theBlurGaston = Math.ceil(findValue(context.data.ringArray[i].blurRange.lower, context.data.ringArray[i].blurRange.upper, context.data.ringArray[i].featherTimes, context.numberOfFrames, context.currentFrame))
            await bottomLayer.blur(theBlurGaston);
            await bottomLayer.adjustLayerOpacity(context.data.underLayerOpacity);
            await context.layer.compositeLayerOver(bottomLayer);

            //top Layer
            context.canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);
            await drawTopLayer(context, i);
            await context.canvas.toFile(filename)
            const topLayer = await LayerFactory.getLayerFromFile(context.drawing);
            await topLayer.adjustLayerOpacity(context.data.layerOpacity);
            await context.layer.compositeLayerOver(topLayer);
        } else {

            //top Layer
            context.canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);
            await drawTopLayer(context, i);
            await context.canvas.toFile(filename)
            const topLayer = await LayerFactory.getLayerFromFile(context.drawing);
            await topLayer.adjustLayerOpacity(context.data.layerOpacity);
            await context.layer.compositeLayerOver(topLayer);

            //bottom layer
            context.canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);
            await drawBottomLayer(context, i);
            await context.canvas.toFile(filename)
            const bottomLayer = await LayerFactory.getLayerFromFile(context.drawing);
            const theBlurGaston = Math.ceil(findValue(context.data.ringArray[i].blurRange.lower, context.data.ringArray[i].blurRange.upper, context.data.ringArray[i].featherTimes, context.numberOfFrames, context.currentFrame))
            await bottomLayer.blur(theBlurGaston);
            await bottomLayer.adjustLayerOpacity(context.data.underLayerOpacity);
            await context.layer.compositeLayerOver(bottomLayer);

        }


    }
}


export const processDrawFunction = async (draw, context) => {
    await draw(context, context.drawing);
}

export const encircledSpiral = async (layer, data, currentFrame, numberOfFrames) => {

    const context = {
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        drawing: getWorkingDirectory() + 'encircled-spiral' + randomId() + '.png',
        underlayName: getWorkingDirectory() + 'encircled-spiral-underlay' + randomId() + '.png',
        canvas: await Canvas2dFactory.getNewCanvas(data.width, data.height),
        data: data,
        layer: layer,
    }

    await processDrawFunction(draw, context);

    fs.unlinkSync(context.drawing);
}