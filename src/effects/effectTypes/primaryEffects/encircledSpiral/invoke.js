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

async function spiral(context, index, thickness, color) {

    const unitLength = context.data.ringArray[index].radius / await findSegmentCount(context.data.ringArray[index].numberOfSegments);

    await context.canvas.drawRing2d(context.data.center, context.data.ringArray[index].radius, context.data.ringArray[index].ringThickness, context.data.ringArray[index].innerColor, context.data.ringArray[index].ringStroke, context.data.ringArray[index].outerColor);

    for (let seg = 4; seg <= context.data.ringArray[index].numberOfSegments; seg++) {
        for (let i = 0; i < 360; i = i + context.data.ringArray[index].sparsityFactor) {
            await drawLine(i, unitLength, seg, context, 1, thickness, color, index)
            await drawLine(i, unitLength, seg, context, -1, thickness, color, index)
        }
    }
}

const draw = async (context, filename) => {

    for (let i = 0; i < context.data.ringArray.length; i++) {
        //bottom layer
        context.canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);
        const theAccentGaston = findValue(context.data.ringArray[i].accentRange.lower, context.data.ringArray[i].accentRange.upper, context.data.ringArray[i].featherTimes, context.numberOfFrames, context.currentFrame);
        await spiral(context, i, (context.data.ringArray[i].thickness + context.data.ringArray[i].stroke + theAccentGaston), context.data.ringArray[i].outerColor);
        await context.canvas.toFile(filename)
        const bottomLayer = await LayerFactory.getLayerFromFile(context.drawing);
        const theBlurGaston = Math.ceil(findValue(context.data.ringArray[i].blurRange.lower, context.data.ringArray[i].blurRange.upper, context.data.ringArray[i].featherTimes, context.numberOfFrames, context.currentFrame))
        await bottomLayer.blur(theBlurGaston);
        await bottomLayer.adjustLayerOpacity(context.data.underLayerOpacity);
        await context.layer.compositeLayerOver(bottomLayer);
    }

    for (let i = 0; i < context.data.ringArray.length; i++) {
        //top Layer
        context.canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);
        await spiral(context, i, context.data.ringArray[i].thickness, context.data.ringArray[i].innerColor);
        await context.canvas.toFile(filename)
        const topLayer = await LayerFactory.getLayerFromFile(context.drawing);
        await topLayer.adjustLayerOpacity(context.data.layerOpacity);
        await context.layer.compositeLayerOver(topLayer);
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