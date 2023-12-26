//n2, nextTerm, -twistCount
import {findPointByAngleAndCircle} from "../../../core/math/drawingMath.js";
import {findValue} from "../../../core/math/findValue.js";
import {randomId} from "../../../core/math/random.js";
import {Canvas2dFactory} from "../../../core/factory/canvas/Canvas2dFactory.js";
import fs from "fs";
import {GlobalSettings} from "../../../core/GlobalSettings.js";
import {LayerFactory} from "../../../core/factory/layer/LayerFactory.js";

const drawLine = async (angle, loopControl, context, flipTwist, thickness, color) => {
    angle = angle + (((context.data.sparsityFactor * context.data.speed) / context.numberOfFrames) * context.currentFrame) * context.data.direction;

    const start = findPointByAngleAndCircle(context.data.center, angle, loopControl.n2 + context.data.radiusConstant)
    const end = findPointByAngleAndCircle(context.data.center, angle + (loopControl.twistCount * flipTwist * context.data.sparsityFactor), loopControl.nextTerm + context.data.radiusConstant);

    await context.canvas.drawLine2d(start, end, thickness, color, thickness, color);
}

async function spiral(context, thickness, color) {

    const unitLength = context.data.unitLength + context.theUnitLengthGaston;

    const loopControl = {
        twistCount: context.data.startTwistCount,
        n1: unitLength,
        n2: unitLength,
        nextTerm: unitLength + unitLength
    }

    while (loopControl.nextTerm <= context.data.drawHeight) {

        for (let i = 0; i < 360; i = i + context.data.sparsityFactor) {
            await drawLine(i, loopControl, context, 1, thickness, color)
            await drawLine(i, loopControl, context, -1, thickness, color)
        }

        //assignment for next loop
        loopControl.twistCount++;
        loopControl.n1 = loopControl.n2;
        loopControl.n2 = loopControl.nextTerm;
        loopControl.nextTerm = loopControl.n1 + loopControl.n2;
    }
}

const drawUnderlay = async (context, filename) => {
    await spiral(context, context.data.thickness + context.data.stroke + context.theAccentGaston, context.data.outerColor);
    await context.canvas.toFile(filename)
}

const draw = async (context, filename) => {
    await spiral(context, context.data.thickness, context.data.innerColor);
    await context.canvas.toFile(filename)
}


export const compositeImage = async (context, layer) => {
    let tempLayer = await LayerFactory.getLayerFromFile(context.drawing);
    let underlayLayer = await LayerFactory.getLayerFromFile(context.underlayName);

    await underlayLayer.blur(context.theBlurGaston);
    await underlayLayer.adjustLayerOpacity(context.theUnderLayerOpacityGaston);

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

export const wireframeSpiral = async (layer, data, currentFrame, numberOfFrames) => {

    const context = {
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        theAccentGaston: findValue(data.accentRange.lower, data.accentRange.upper, data.featherTimes, numberOfFrames, currentFrame),
        theBlurGaston: Math.ceil(findValue(data.blurRange.lower, data.blurRange.upper, data.featherTimes, numberOfFrames, currentFrame)),
        theUnitLengthGaston: findValue(0, data.unitLengthChangeConstant, 1, numberOfFrames, currentFrame),
        theUnderLayerOpacityGaston: findValue(data.underLayerOpacityRange.lower, data.underLayerOpacityRange.upper, data.underLayerOpacityTimes, numberOfFrames, currentFrame),
        drawing: GlobalSettings.getWorkingDirectory() + 'wireframe-spiral' + randomId() + '.png',
        underlayName: GlobalSettings.getWorkingDirectory() + 'wireframe-spiral-underlay' + randomId() + '.png',
        canvas: await Canvas2dFactory.getNewCanvas(data.width, data.height),
        data: data,
    }

    await processDrawFunction(context);
    await compositeImage(context, layer);

    fs.unlinkSync(context.underlayName);
    fs.unlinkSync(context.drawing);
}