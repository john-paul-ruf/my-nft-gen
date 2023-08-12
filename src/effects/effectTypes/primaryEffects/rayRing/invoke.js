import {randomId} from "../../../../core/math/random.js";
import {getWorkingDirectory,} from "../../../../core/GlobalSettings.js";
import fs from "fs";
import {findValue} from "../../../../core/math/findValue.js";
import {Canvas2dFactory} from "../../../../core/factory/canvas/Canvas2dFactory.js";
import {findOneWayValue} from "../../../../core/math/findOneWayValue.js";
import {LayerFactory} from "../../../../core/factory/layer/LayerFactory.js";


async function drawRayRingInstance(withAccentGaston, i, context) {
    const theAccentGaston = withAccentGaston ? findValue(context.data.circles[i].accentRange.lower, context.data.circles[i].accentRange.upper, context.data.circles[i].featherTimes, context.numberOfFrames, context.currentFrame) : 0;
    const invertTheRayGaston = (i + 1) % 2;
    const theRayGaston = findOneWayValue(0, context.data.circles[i].sparsityFactor * context.data.circles[i].speed, context.numberOfFrames, context.currentFrame);

    await context.canvas.drawRing2d(
        context.data.center,
        context.data.circles[i].radius,
        context.data.thickness,
        context.data.circles[i].color,
        (context.data.stroke + theAccentGaston),
        context.data.circles[i].outerColor
    )

    let rayIndex = 0;
    for (let a = 0; a < 360; a = a + context.data.circles[i].sparsityFactor) {
        const theLengthGaston = findValue(context.data.circles[i].rays[rayIndex].length.lower, context.data.circles[i].rays[rayIndex].length.upper, context.data.circles[i].rays[rayIndex].lengthTimes, context.numberOfFrames, context.currentFrame);
        const theFinalAngle = invertTheRayGaston === 0 ? (a + theRayGaston) % 360 : (a - theRayGaston) % 360;

        await context.canvas.drawRay2d(
            context.data.center,
            theFinalAngle,
            context.data.circles[i].radius + ((context.data.thickness + context.data.stroke) / 2),
            theLengthGaston,
            context.data.rayThickness,
            context.data.circles[i].color,
            (context.data.rayStroke + theAccentGaston),
            context.data.circles[i].outerColor
        );

        rayIndex++;
    }
}

const draw = async (context, filename) => {
    for (let i = 0; i < context.data.numberOfCircles; i++) {
        await drawRayRingInstance(context.useAccentGaston, i, context);
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

    context.useAccentGaston = false;
    context.canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

    await draw(context, context.drawing);
}

export const rayRing = async (layer, data, currentFrame, numberOfFrames) => {

    const context = {
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        useAccentGaston: true,
        theBlurGaston: Math.ceil(findValue(data.blurRange.lower, data.blurRange.upper, data.featherTimes, numberOfFrames, currentFrame)),
        drawing: getWorkingDirectory() + 'ray-ring' + randomId() + '.png',
        underlayName: getWorkingDirectory() + 'ray-ring-underlay' + randomId() + '.png',
        canvas: await Canvas2dFactory.getNewCanvas(data.width, data.height),
        data: data
    }

    await processDrawFunction(draw, context);
    await compositeImage(context, layer);

    fs.unlinkSync(context.drawing);
    fs.unlinkSync(context.underlayName);

}