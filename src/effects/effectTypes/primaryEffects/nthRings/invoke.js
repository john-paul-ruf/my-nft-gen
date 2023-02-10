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
    await context.canvas.drawRing2d(pos, theGaston, innerStroke, innerColor, outerStroke + context.theAccentGaston, outerColor)
}

const drawRings = async (pos, color, radius, numberOfRings, context, weight) => {
    for (let i = 0; i < numberOfRings; i++) {
        await drawRing(pos, radius / numberOfRings * i, weight, color, 0, color, context);
    }
}

const draw = async (context, filename) => {

    const angle = Math.floor((360 / context.data.totalRingCount));

    for (let i = 0; i < 360; i += angle) {
        await drawRings(findPointByAngleAndCircle(context.data.center, i + context.theAngleGaston, context.data.smallerRingsGroupRadius), context.data.outerColor, context.data.smallRadius, context.data.smallNumberOfRings, context, context.data.thickness + context.data.stroke);
    }

    for (let i = 0; i < 360; i += angle) {
        await drawRings(findPointByAngleAndCircle(context.data.center, i + context.theAngleGaston, context.data.smallerRingsGroupRadius), context.data.innerColor, context.data.smallRadius, context.data.smallNumberOfRings, context, context.data.thickness);
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

export const nthRings = async (layer, data, currentFrame, numberOfFrames) => {
    const context = {
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        theAccentGaston: findValue(data.accentRange.lower, data.accentRange.upper, data.accentTimes, numberOfFrames, currentFrame),
        theBlurGaston: Math.ceil(findValue(data.blurRange.lower, data.blurRange.upper, data.blurTimes, numberOfFrames, currentFrame)),
        theAngleGaston: findOneWayValue(0, 45, numberOfFrames, currentFrame),
        drawing: getWorkingDirectory() + 'nth-rings' + randomId() + '.png',
        underlayName: getWorkingDirectory() + 'nth-rings-underlay' + randomId() + '.png',
        canvas: await Canvas2dFactory.getNewCanvas(data.width, data.height),
        data: data,
    }

    await processDrawFunction(draw, context);
    await compositeImage(context, layer);

    fs.unlinkSync(context.drawing);
    fs.unlinkSync(context.underlayName);
}
