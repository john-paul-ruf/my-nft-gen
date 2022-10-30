import {getWorkingDirectory} from "../../../../core/GlobalSettings.js";
import {randomId} from "../../../../core/math/random.js";
import {findValue} from "../../../../core/math/findValue.js";
import {Canvas2dFactory} from "../../../../core/factory/canvas/Canvas2dFactory.js";
import {LayerFactory} from "../../../../core/factory/layer/LayerFactory.js";
import {findPointByAngleAndCircle} from "../../../../core/math/drawingMath.js";
import fs from "fs";

//not hex but hey...
const drawHexArray = async (context, array) => {
    for (let i = 0; i < array.length; i++) {

        const angleGaston = findValue(context.data.angleRangeFlareHex.lower, context.data.angleRangeFlareHex.upper, context.data.angleGastonTimes, context.numberOfFrames, context.currentFrame);

        const pos = findPointByAngleAndCircle(context.data.center, angleGaston, array[i].offset)

        const theOpacityGaston = findValue(array[i].opacity.lower, array[i].opacity.upper, array[i].opacityTimes, context.numberOfFrames, context.currentFrame)

        await context.canvas.drawFilledPolygon2d(array[i].size, pos, array[i].sides, array[i].angle, array[i].color, theOpacityGaston);
        await context.canvas.drawPolygon2d(array[i].size, pos, array[i].sides, array[i].angle, 1.5, array[i].strokeColor, 1.5, array[i].strokeColor, theOpacityGaston);
    }
}

const drawRingArray = async (context, array) => {
    for (let i = 0; i < array.length; i++) {
        const theOpacityGaston = findValue(array[i].opacity.lower, array[i].opacity.upper, array[i].opacityTimes, context.numberOfFrames, context.currentFrame)
        const theRadiusGaston = findValue(array[i].size + array[i].gastonRange.lower, array[i].size + array[i].gastonRange.upper, array[i].gastonTimes, context.numberOfFrames, context.currentFrame, array[i].gastonInvert)

        await context.canvas.drawRing2d(context.data.center, theRadiusGaston, array[i].stroke, array[i].color, array[i].stroke, array[i].color, theOpacityGaston);
    }
}

const drawRayArray = async (context, array) => {
    for (let i = 0; i < array.length; i++) {
        const theOpacityGaston = findValue(array[i].opacity.lower, array[i].opacity.upper, array[i].opacityTimes, context.numberOfFrames, context.currentFrame)
        const theAngleGaston = findValue(array[i].angle + array[i].gastonRange.lower, array[i].angle + array[i].gastonRange.upper, array[i].gastonTimes, context.numberOfFrames, context.currentFrame, array[i].gastonInvert)

        const start = findPointByAngleAndCircle(context.data.center, theAngleGaston, array[i].offset);
        const end = findPointByAngleAndCircle(context.data.center, theAngleGaston, array[i].size);

        await context.canvas.drawLine2d(start, end, array[i].stroke, array[i].color, array[i].stroke, array[i].color, theOpacityGaston);
    }
}

const createLensFlare = async (context) => {
    await drawHexArray(context, context.data.hexArray);
    await drawRingArray(context, context.data.ringArray);
    await drawRayArray(context, context.data.rayArray);

    await context.canvas.toFile(context.drawing);
}


export const lensFlare = async (layer, data, currentFrame, numberOfFrames) => {
    const context = {
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        drawing: getWorkingDirectory() + 'lens-flare' + randomId() + '.png',
        canvas: await Canvas2dFactory.getNewCanvas(data.width, data.height),
        data: data
    };

    await createLensFlare(context);

    let drawingLayer = await LayerFactory.getLayerFromFile(context.drawing);

    const theOpacityGaston = findValue(data.layerOpacityRange.lower, data.layerOpacityRange.upper, data.layerOpacityTimes, numberOfFrames, currentFrame)
    await drawingLayer.adjustLayerOpacity(theOpacityGaston);

    const theBlurGaston = Math.ceil(findValue(data.blurRange.lower, data.blurRange.upper, data.blurTimes, numberOfFrames, currentFrame))
    await drawingLayer.blur(theBlurGaston);

    await layer.compositeLayerOver(drawingLayer);
    fs.unlinkSync(context.drawing);
}
