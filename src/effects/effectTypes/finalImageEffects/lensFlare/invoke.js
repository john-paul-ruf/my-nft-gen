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
        const pos = {x: context.data.center + array[i].offsetX, y: context.data.center + array[i].offsetY};
        await context.canvas.drawFilledPolygon2d(array[i].size, pos, array[i].sides, array[i].angle, array[i].color, array[i].opacity);
    }
}

const drawRingArray = async (context, array) => {
    for (let i = 0; i < array.length; i++) {
        await context.canvas.drawRing2d(context.data.center, array[i].size, array[i].stroke, array[i].color, array[i].stroke, array[i].color, array[i].opacity);
    }
}

const drawRayArray = async (context, array) => {
    for (let i = 0; i < array.length; i++) {
        const start = context.data.center
        const end = findPointByAngleAndCircle(context.data.center, array[i].radius, array[i].size);
        await context.canvas.drawLine2d(start, end, array[i].stroke, array[i].color, array[i].stroke, array[i].color, array[i].opacity);
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
    await drawingLayer.adjustLayerOpacity(theOpacityGaston); //gaston this later

    const theBlurGaston = Math.ceil(findValue(data.blurRange.lower, data.blurRange.upper, data.blurTimes, numberOfFrames, currentFrame))
    await drawingLayer.blur(theBlurGaston); //gaston this later

    await layer.compositeLayerOver(drawingLayer);
    fs.unlinkSync(context.drawing);
}
