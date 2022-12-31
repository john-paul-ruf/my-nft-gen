import {getWorkingDirectory} from "../../../../core/GlobalSettings.js";
import {randomId} from "../../../../core/math/random.js";
import {findValue} from "../../../../core/math/findValue.js";
import {Canvas2dFactory} from "../../../../core/factory/canvas/Canvas2dFactory.js";
import {LayerFactory} from "../../../../core/factory/layer/LayerFactory.js";
import {findPointByAngleAndCircle, getPointsForLayerAndDensity} from "../../../../core/math/drawingMath.js";
import fs from "fs";
import {findOneWayValue} from "../../../../core/math/findOneWayValue.js";

//not hex but hey...
const drawHexLayer = async (context, arrayIndex, layer) => {

    const numberOfPoints = getPointsForLayerAndDensity(context.data.initialNumberOfPoints, context.data.scaleByFactor, layer);
    const startingAngle = 360 / numberOfPoints;

    const element = context.data.hexArray[arrayIndex];

    const invert = (layer % 2) > 0;
    const theAngleGaston = findOneWayValue(0, context.data.hexArray[arrayIndex].movementGaston * startingAngle, context.numberOfFrames, context.currentFrame, invert);

    for (let i = 1; i <= numberOfPoints; i++) {

        const angle = ((startingAngle * i) + theAngleGaston) % 360;
        const offset = context.data.offsetRadius * layer;

        const pos = findPointByAngleAndCircle(context.data.center, angle, offset);

        const theOpacityGaston = findValue(element.opacity.lower, element.opacity.upper, element.opacityTimes, context.numberOfFrames, context.currentFrame, invert)

        await context.canvas.drawFilledPolygon2d(context.data.hexArray[arrayIndex].radius, pos, 6, context.data.startAngle, element.color, theOpacityGaston);
        await context.canvas.drawPolygon2d(context.data.hexArray[arrayIndex].radius, pos, 6, context.data.startAngle, context.data.thickness, element.outline, context.data.stroke, element.outlineStrokeColor, theOpacityGaston);
    }
}
const createLayers = async (context) => {

    for (let i = 0; i < context.data.hexArray.length; i++) {
        await drawHexLayer(context, i, context.data.startIndex + i);
    }

    await context.canvas.toFile(context.drawing);
}


export const layeredHex = async (layer, data, currentFrame, numberOfFrames) => {
    const context = {
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        drawing: getWorkingDirectory() + 'layered-hex' + randomId() + '.png',
        canvas: await Canvas2dFactory.getNewCanvas(data.width, data.height),
        data: data
    };

    await createLayers(context);

    let drawingLayer = await LayerFactory.getLayerFromFile(context.drawing);

    const theOpacityGaston = findValue(data.layerOpacityRange.lower, data.layerOpacityRange.upper, data.layerOpacityTimes, numberOfFrames, currentFrame)
    await drawingLayer.adjustLayerOpacity(theOpacityGaston); //gaston this later

    await layer.compositeLayerOver(drawingLayer);
    fs.unlinkSync(context.drawing);
}
