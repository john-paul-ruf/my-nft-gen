//n2, nextTerm, -twistCount
import {findPointByAngleAndCircle} from "../../../../core/math/drawingMath.js";
import {getWorkingDirectory} from "../../../../core/GlobalSettings.js";
import {randomId} from "../../../../core/math/random.js";
import {Canvas2dFactory} from "../../../../core/factory/canvas/Canvas2dFactory.js";
import fs from "fs";
import {LayerFactory} from "../../../../core/factory/layer/LayerFactory.js";
import {findValue} from "../../../../core/math/findValue.js";

const drawLine = async (angle, unitLength, seg, context, flipTwist, thickness, color, index) => {
    const direction = index % 2 > 0 ? -1 : 1;
    angle = angle + (((context.data.ringArray[index].sparsityFactor * context.data.ringArray[index].speed) / context.numberOfFrames) * context.currentFrame) * direction;

    const start = findPointByAngleAndCircle(context.data.center, angle, unitLength * await findSegmentCount(seg - 1))
    const end = findPointByAngleAndCircle(context.data.center, angle + (seg * flipTwist * context.data.ringArray[index].sparsityFactor), unitLength * await findSegmentCount(seg));


    await context.canvas.drawLine2d(start, end, thickness, color, 0, color);
}

async function findSegmentCount(num) {
    let returnValue = 0

    for (let i = 1; i < num; i++) {
        returnValue += i;
    }

    return returnValue;
}

async function drawBottomLayer(context, index) {
    const unitLength = context.data.ringArray[index].radius / await findSegmentCount(context.data.ringArray[index].numberOfSegments);
    const theAccentGaston = findValue(context.data.ringArray[index].accentRange.lower, context.data.ringArray[index].accentRange.upper, context.data.ringArray[index].featherTimes, context.numberOfFrames, context.currentFrame);
    for (let seg = context.data.startSegment; seg <= context.data.ringArray[index].numberOfSegments; seg++) {
        for (let i = 0; i < 360; i = i + context.data.ringArray[index].sparsityFactor) {
            await drawLine(i, unitLength, seg, context, 1, context.data.ringArray[index].stroke + context.data.ringArray[index].thickness + theAccentGaston, context.data.ringArray[index].outerColor, index);
            await drawLine(i, unitLength, seg, context, -1, context.data.ringArray[index].stroke + context.data.ringArray[index].thickness + theAccentGaston, context.data.ringArray[index].outerColor, index);

            await drawLine(i, unitLength, seg, context, 1, context.data.ringArray[index].stroke, context.data.ringArray[index].innerColor, index);
            await drawLine(i, unitLength, seg, context, -1, context.data.ringArray[index].stroke, context.data.ringArray[index].innerColor, index);
        }
    }
}

async function drawTopLayer(context, index) {
    const unitLength = context.data.ringArray[index].radius / await findSegmentCount(context.data.ringArray[index].numberOfSegments);
    for (let seg = context.data.startSegment; seg <= context.data.ringArray[index].numberOfSegments; seg++) {
        for (let i = 0; i < 360; i = i + context.data.ringArray[index].sparsityFactor) {
            await drawLine(i, unitLength, seg, context, 1, context.data.ringArray[index].stroke + context.data.ringArray[index].thickness, context.data.ringArray[index].outerColor, index);
            await drawLine(i, unitLength, seg, context, -1, context.data.ringArray[index].stroke + context.data.ringArray[index].thickness, context.data.ringArray[index].outerColor, index);

            await drawLine(i, unitLength, seg, context, 1, context.data.ringArray[index].stroke, context.data.ringArray[index].innerColor, index);
            await drawLine(i, unitLength, seg, context, -1, context.data.ringArray[index].stroke, context.data.ringArray[index].innerColor, index);
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