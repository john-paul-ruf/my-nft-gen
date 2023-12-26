
import {randomId} from "../../../core/math/random.js";
import {Canvas2dFactory} from "../../../core/factory/canvas/Canvas2dFactory.js";
import fs from "fs";
import {GlobalSettings} from "../../../core/GlobalSettings.js";
import {findValue} from "../../../core/math/findValue.js";
import {findOneWayValue} from "../../../core/math/findOneWayValue.js";
import {LayerFactory} from "../../../core/factory/layer/LayerFactory.js";

const drawUnderlay = async (context, filename) => {
    const theRayGaston = findOneWayValue(0, context.data.sparsityFactor * context.data.speed, context.numberOfFrames, context.currentFrame);
    for (let i = 0; i < 360; i = i + context.data.sparsityFactor) {
        await context.canvas.drawRay2d(
            context.data.center,
            (i + theRayGaston) % 360,
            context.data.lineStart + context.data.stroke,
            context.data.length + context.data.stroke,
            context.data.stroke,
            context.data.innerColor,
            context.data.stroke + context.theAccentGaston,
            context.data.outerColor
        )
    }

    await context.canvas.toFile(filename);
}

const draw = async (context, filename) => {
    const theRayGaston = findOneWayValue(0, context.data.sparsityFactor * context.data.speed, context.numberOfFrames, context.currentFrame);

    for (let i = 0; i < 360; i = i + context.data.sparsityFactor) {
        await context.canvas.drawRay2d(
            context.data.center,
            (i + theRayGaston) % 360,
            context.data.lineStart,
            context.data.length,
            context.data.thickness,
            context.data.innerColor,
            context.data.thickness,
            context.data.outerColor
        )
    }

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

export const amp = async (layer, data, currentFrame, numberOfFrames) => {
    const context = {
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        drawing: GlobalSettings.getWorkingDirectory() + 'amp' + randomId() + '.png',
        underlayName: GlobalSettings.getWorkingDirectory() + 'amp-underlay' + randomId() + '.png',
        theAccentGaston: findValue(data.accentRange.lower, data.accentRange.upper, data.featherTimes, numberOfFrames, currentFrame),
        theBlurGaston: Math.ceil(findValue(data.blurRange.lower, data.blurRange.upper, data.featherTimes, numberOfFrames, currentFrame)),
        canvas: await Canvas2dFactory.getNewCanvas(data.width, data.height),
        data: data,
    }

    await processDrawFunction(context);
    await compositeImage(context, layer);

    fs.unlinkSync(context.drawing);
    fs.unlinkSync(context.underlayName);
}
