import {getWorkingDirectory} from "../../../../core/GlobalSettings.js";
import {randomId} from "../../../../core/math/random.js";
import {findValue} from "../../../../core/math/findValue.js";
import {Canvas2dFactory} from "../../../../core/factory/canvas/Canvas2dFactory.js";
import {LayerFactory} from "../../../../core/factory/layer/LayerFactory.js";
import {findPointByAngleAndCircle, getPointsForLayerAndDensity} from "../../../../core/math/drawingMath.js";
import fs from "fs";
import {findOneWayValue} from "../../../../core/math/findOneWayValue.js";

const drawBottomHexLayer = async (context, arrayIndex, layer) => {

    const count = arrayIndex + 1;

    const numberOfPoints = getPointsForLayerAndDensity(context.data.initialNumberOfPoints, context.data.scaleByFactor, count);
    const startingAngle = 360 / numberOfPoints;

    const element = context.data.hexArray[arrayIndex];
    const theAccentGaston = findValue(element.accentRange.lower, element.accentRange.upper, element.featherTimes, context.numberOfFrames, context.currentFrame);

    const invert = (count % 2) > 0;
    const theAngleGaston = findOneWayValue(0, context.data.hexArray[arrayIndex].movementGaston * startingAngle, context.numberOfFrames, context.currentFrame, invert);

    const tempCanvasName = getWorkingDirectory() + 'layered-hex-temp' + randomId() + '.png'
    const tempCanvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

    for (let i = 1; i <= numberOfPoints; i++) {

        const angle = ((startingAngle * i) + theAngleGaston) % 360;
        const offset = context.data.offsetRadius * count;

        const pos = findPointByAngleAndCircle(context.data.center, angle, offset);

        const theOpacityGaston = findValue(element.opacity.lower, element.opacity.upper, element.opacityTimes, context.numberOfFrames, context.currentFrame, invert)

        await tempCanvas.drawPolygon2d(context.data.hexArray[arrayIndex].radius, pos, 6, context.data.startAngle, context.data.thickness, element.color, context.data.thickness + context.data.stroke + theAccentGaston, element.outline, theOpacityGaston);
    }

    await tempCanvas.toFile(tempCanvasName)

    const blurLayer = await LayerFactory.getLayerFromFile(tempCanvasName);
    const theBlurGaston = Math.ceil(findValue(element.blurRange.lower, element.blurRange.upper, element.featherTimes, context.numberOfFrames, context.currentFrame))
    await blurLayer.blur(theBlurGaston);
    await blurLayer.adjustLayerOpacity(context.data.underLayerOpacity);
    await layer.compositeLayerOver(blurLayer);

    fs.unlinkSync(tempCanvasName);
}

const drawTopHexLayer = async (context, arrayIndex, layer) => {

    const count = arrayIndex + 1;

    const canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

    const numberOfPoints = getPointsForLayerAndDensity(context.data.initialNumberOfPoints, context.data.scaleByFactor, count);
    const startingAngle = 360 / numberOfPoints;

    const element = context.data.hexArray[arrayIndex];

    const invert = (count % 2) > 0;
    const theAngleGaston = findOneWayValue(0, context.data.hexArray[arrayIndex].movementGaston * startingAngle, context.numberOfFrames, context.currentFrame, invert);

    for (let i = 1; i <= numberOfPoints; i++) {

        const angle = ((startingAngle * i) + theAngleGaston) % 360;
        const offset = context.data.offsetRadius * count;

        const pos = findPointByAngleAndCircle(context.data.center, angle, offset);

        const theOpacityGaston = findValue(element.opacity.lower, element.opacity.upper, element.opacityTimes, context.numberOfFrames, context.currentFrame, invert)

        await canvas.drawPolygon2d(context.data.hexArray[arrayIndex].radius, pos, 6, context.data.startAngle, context.data.thickness, element.color, context.data.thickness +context.data.stroke, element.outline, theOpacityGaston);
    }

    const segmentName = getWorkingDirectory() + 'layered-hex-seg' + randomId() + '.png'
    await canvas.toFile(segmentName)
    await layer.compositeLayerOver(await LayerFactory.getLayerFromFile(segmentName));

    fs.unlinkSync(segmentName);
}

const createLayers = async (context, layer) => {

    const topCanvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);
    const bottomCanvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

    await topCanvas.toFile(context.top);
    await bottomCanvas.toFile(context.bottom);

    let topLayer = await LayerFactory.getLayerFromFile(context.top);
    let bottomLayer = await LayerFactory.getLayerFromFile(context.bottom);

    for (let i = 0; i < context.data.hexArray.length; i++) {
        await drawBottomHexLayer(context, i, bottomLayer);
        await drawTopHexLayer(context, i, topLayer);
    }

    const theOpacityGaston = findValue(context.data.layerOpacityRange.lower, context.data.layerOpacityRange.upper, context.data.layerOpacityTimes, context.numberOfFrames, context.currentFrame)

    await topLayer.adjustLayerOpacity(theOpacityGaston);
    await bottomLayer.adjustLayerOpacity(theOpacityGaston);

    if (!context.data.invertLayers) {
        await layer.compositeLayerOver(bottomLayer);
        await layer.compositeLayerOver(topLayer);
    } else {
        await layer.compositeLayerOver(topLayer);
        await layer.compositeLayerOver(bottomLayer);
    }
}


export const layeredHex = async (layer, data, currentFrame, numberOfFrames) => {
    const context = {
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        top: getWorkingDirectory() + 'layered-hex-top' + randomId() + '.png',
        bottom: getWorkingDirectory() + 'layered-hex-bottom' + randomId() + '.png',
        data: data
    };

    await createLayers(context, layer);

    fs.unlinkSync(context.top);
    fs.unlinkSync(context.bottom);
}
