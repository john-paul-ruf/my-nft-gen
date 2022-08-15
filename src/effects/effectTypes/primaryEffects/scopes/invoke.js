import {findOneWayValue} from "../../../../core/math/findOneWayValue.js";
import {findValue} from "../../../../core/math/findValue.js";
import {findPointByAngleAndCircle} from "../../../../core/math/drawingMath.js";
import {getFinalImageSize, getWorkingDirectory} from "../../../../core/GlobalSettings.js";
import {randomId} from "../../../../core/math/random.js";
import {Canvas2dFactory} from "../../../../core/factory/canvas/Canvas2dFactory.js";
import {LayerFactory} from "../../../../core/factory/layer/LayerFactory.js";
import fs from "fs";

const finalImageSize = getFinalImageSize();

const drawHexLine = async (angle, index, color, alphaRange, context) => {
    const loopCount = index + 1;
    const direction = loopCount % 2;
    const invert = direction <= 0;

    const theRotateGaston = findOneWayValue(angle, angle + 720, context.numberOfFrames, context.currentFrame, invert);
    const theAlphaGaston = findValue(alphaRange.lower, alphaRange.upper, 5, context.numberOfFrames, context.currentFrame);

    const scaleBy = (context.data.scaleFactor * loopCount);
    const radius = context.data.radiusFactor * scaleBy;
    const gapRadius = ((finalImageSize.height * .05) + radius + (context.data.gapFactor * scaleBy) * loopCount)
    const pos = findPointByAngleAndCircle(context.data.center, angle, gapRadius)

    await context.canvas.drawFilledPolygon2d(radius, pos, 6, theRotateGaston, color, theAlphaGaston)
}

const draw = async (context, filename) => {
    for (let s = 0; s < context.data.scopes.length; s++) {
        await drawHexLine(context.data.scopes[s].angle, context.data.scopes[s].loopCount, context.data.scopes[s].color, context.data.scopes[s].alphaRange, context)
    }
    await context.canvas.toFile(filename);
}

export const scopes = async (layer, data, currentFrame, numberOfFrames) => {
    const context = {
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        drawing: getWorkingDirectory() + 'scopes' + randomId() + '.png',
        canvas: await Canvas2dFactory.getNewCanvas(data.width, data.height),
        data: data
    }

    await draw(context, context.drawing);

    let tempLayer = await LayerFactory.getLayerFromFile(context.drawing);
    await layer.compositeLayerOver(tempLayer)

    fs.unlinkSync(context.drawing);
}