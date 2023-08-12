import {getWorkingDirectory} from "../../../../core/GlobalSettings.js";
import {randomId} from "../../../../core/math/random.js";
import {Canvas2dFactory} from "../../../../core/factory/canvas/Canvas2dFactory.js";
import fs from "fs";
import {findValue} from "../../../../core/math/findValue.js";
import {findOneWayValue} from "../../../../core/math/findOneWayValue.js";
import {LayerFactory} from "../../../../core/factory/layer/LayerFactory.js";

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
            context.data.stroke,
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

    await layer.compositeLayerOver(underlayLayer);
    await layer.compositeLayerOver(tempLayer);

}

export const processDrawFunction = async (draw, context) => {

    await draw(context, context.underlayName);

    context.theAccentGaston = 0;
    context.canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

    await draw(context, context.drawing);
}

export const amp = async (layer, data, currentFrame, numberOfFrames) => {
    const context = {
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        drawing: getWorkingDirectory() + 'amp' + randomId() + '.png',
        underlayName: getWorkingDirectory() + 'amp-underlay' + randomId() + '.png',
        theAccentGaston: findValue(data.accentRange.lower, data.accentRange.upper, data.featherTimes, numberOfFrames, currentFrame),
        theBlurGaston: Math.ceil(findValue(data.blurRange.lower, data.blurRange.upper, data.featherTimes, numberOfFrames, currentFrame)),
        canvas: await Canvas2dFactory.getNewCanvas(data.width, data.height),
        data: data,
    }

    await processDrawFunction(draw, context);
    await compositeImage(context, layer);

    fs.unlinkSync(context.drawing);
    fs.unlinkSync(context.underlayName);
}
