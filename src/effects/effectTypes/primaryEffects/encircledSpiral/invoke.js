//n2, nextTerm, -twistCount
import {findPointByAngleAndCircle} from "../../../../core/math/drawingMath.js";
import {getWorkingDirectory} from "../../../../core/GlobalSettings.js";
import {randomId} from "../../../../core/math/random.js";
import {Canvas2dFactory} from "../../../../core/factory/canvas/Canvas2dFactory.js";
import fs from "fs";
import {LayerFactory} from "../../../../core/factory/layer/LayerFactory.js";

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

    const unitLength = context.data.ringArray[index].size / await findSegmentCount(context.data.ringArray[index].numberOfSegments);

    for (let seg = 0; seg <= context.data.ringArray[index].numberOfSegments; seg++) {
        for (let i = 0; i < 360; i = i + context.data.ringArray[index].sparsityFactor) {
            await drawLine(i, unitLength, seg, context, 1, thickness, color, index)
            await drawLine(i, unitLength, seg, context, -1, thickness, color, index)
        }
    }


    await context.canvas.drawRing2d(context.data.center, context.data.ringArray[index].size, context.data.ringArray[index].ringThickness, context.data.ringArray[index].innerColor, context.data.ringArray[index].ringStroke, context.data.ringArray[index].outerColor);
}

const draw = async (context, filename) => {

    for (let i = 0; i < context.data.ringArray.length; i++) {
        await spiral(context, i, context.data.ringArray[i].thickness + context.data.ringArray[i].stroke, context.data.ringArray[i].outerColor);
    }


    for (let i = 0; i < context.data.ringArray.length; i++) {
        await spiral(context, i, context.data.ringArray[i].thickness, context.data.ringArray[i].innerColor);
    }

    await context.canvas.toFile(filename)
}

export const compositeImage = async (context, layer) => {
    let tempLayer = await LayerFactory.getLayerFromFile(context.drawing);

    await tempLayer.adjustLayerOpacity(context.data.layerOpacity);

    await layer.compositeLayerOver(tempLayer);
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
    }

    await processDrawFunction(draw, context);
    await compositeImage(context, layer);

    fs.unlinkSync(context.drawing);
}