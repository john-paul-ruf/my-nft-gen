import {findOneWayValue} from "../../../../core/math/findOneWayValue.js";
import {findValue} from "../../../../core/math/findValue.js";
import {randomId} from "../../../../core/math/random.js";
import {getWorkingDirectory} from "../../../../core/GlobalSettings.js";
import {Canvas2dFactory} from "../../../../core/factory/canvas/Canvas2dFactory.js";
import fs from "fs";
import {LayerFactory} from "../../../../core/factory/layer/LayerFactory.js";

const draw = async (context, filename) => {

    //quick fix
    for (let i = 0; i < context.data.numberOfGates; i++) {
        const loopCount = i + 1;
        const direction = loopCount % 2;
        const invert = direction <= 0;
        const theAngleGaston = (findOneWayValue(0, 360 / context.data.numberOfSides, context.numberOfFrames, context.currentFrame, invert) + context.data.gates[i].startingAngle) % 360;
        const theAccentGaston = context.useAccentGaston ? findValue(context.data.gates[i].accentRange.lower, context.data.gates[i].accentRange.upper, context.data.gates[i].featherTimes, context.numberOfFrames, context.currentFrame) : 0;
        await context.canvas.drawPolygon2d(context.data.gates[i].radius, context.data.center, context.data.numberOfSides, theAngleGaston, context.data.thickness, context.data.gates[i].color, context.data.stroke + theAccentGaston, context.data.gates[i].color)
    }

    for (let i = 0; i < context.data.numberOfGates; i++) {
        const loopCount = i + 1;
        const direction = loopCount % 2;
        const invert = direction <= 0;
        const theAngleGaston = (findOneWayValue(0, 360 / context.data.numberOfSides, context.numberOfFrames, context.currentFrame, invert) + context.data.gates[i].startingAngle) % 360;
        await context.canvas.drawPolygon2d(context.data.gates[i].radius, context.data.center, context.data.numberOfSides, theAngleGaston, context.data.thickness, context.data.gates[i].innerColor, 0, context.data.gates[i].innerColor)
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

export const gates = async (layer, data, currentFrame, numberOfFrames) => {

    const context = {
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        useAccentGaston: true,
        theBlurGaston: Math.ceil(findValue(data.blurRange.lower, data.blurRange.upper, data.featherTimes, numberOfFrames, currentFrame)),
        drawing: getWorkingDirectory() + 'gate' + randomId() + '.png',
        underlayName: getWorkingDirectory() + 'gate-underlay' + randomId() + '.png',
        canvas: await Canvas2dFactory.getNewCanvas(data.width, data.height),
        data: data,
    }

    await processDrawFunction(draw, context);
    await compositeImage(context, layer);

    fs.unlinkSync(context.underlayName);
    fs.unlinkSync(context.drawing);
}