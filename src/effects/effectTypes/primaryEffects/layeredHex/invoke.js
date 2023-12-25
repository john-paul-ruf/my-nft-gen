import {getWorkingDirectory} from "../../../../core/GlobalSettings.js";
import {randomId} from "../../../../core/math/random.js";
import {findValue} from "../../../../core/math/findValue.js";
import {Canvas2dFactory} from "../../../../core/factory/canvas/Canvas2dFactory.js";
import {LayerFactory} from "../../../../core/factory/layer/LayerFactory.js";
import {findPointByAngleAndCircle, getPointsForLayerAndDensity} from "../../../../core/math/drawingMath.js";
import fs from "fs";
import {findOneWayValue} from "../../../../core/math/findOneWayValue.js";

async function DrawHexElement(arrayIndex, context, useAccentGaston) {
    const count = arrayIndex + 1;

    const numberOfPoints = getPointsForLayerAndDensity(context.data.initialNumberOfPoints, context.data.scaleByFactor, count);
    const startingAngle = 360 / numberOfPoints;

    const element = context.data.hexArray[arrayIndex];
    const theAccentGaston = findValue(element.accentRange.lower, element.accentRange.upper, element.featherTimes, context.numberOfFrames, context.currentFrame);

    const invert = (count % 2) > 0;
    const theAngleGaston = findOneWayValue(0, context.data.hexArray[arrayIndex].movementGaston * startingAngle, context.numberOfFrames, context.currentFrame, invert);

    const tempCanvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

    for (let i = 1; i <= numberOfPoints; i++) {

        const angle = ((startingAngle * i) + theAngleGaston) % 360;
        const offset = context.data.offsetRadius * count;

        const pos = findPointByAngleAndCircle(context.data.center, angle, offset);

        const theOpacityGaston = findValue(element.opacity.lower, element.opacity.upper, element.opacityTimes, context.numberOfFrames, context.currentFrame, invert)

        if (useAccentGaston) {
            await tempCanvas.drawPolygon2d(context.data.hexArray[arrayIndex].radius, pos, 6, context.data.startAngle, context.data.thickness, element.color, context.data.thickness + context.data.stroke + theAccentGaston, element.outline, theOpacityGaston);
        } else {
            await tempCanvas.drawPolygon2d(context.data.hexArray[arrayIndex].radius, pos, 6, context.data.startAngle, context.data.thickness, element.color, context.data.thickness + context.data.stroke, element.outline, theOpacityGaston);
        }
    }
    return {element, tempCanvas};
}

const drawLayer = async (context, arrayIndex, useAccentGaston) => {
    return new Promise(async (innerResolve) => {
        try {
            const tempFileName = getWorkingDirectory() + 'layered-hex-element' + randomId() + '.png'
            const {element, tempCanvas} = await DrawHexElement(arrayIndex, context, useAccentGaston);
            await tempCanvas.toFile(tempFileName)
            const tempLayer = await LayerFactory.getLayerFromFile(tempFileName);
            const theBlurGaston = Math.ceil(findValue(element.blurRange.lower, element.blurRange.upper, element.featherTimes, context.numberOfFrames, context.currentFrame))
            await tempLayer.blur(theBlurGaston);
            fs.unlinkSync(tempFileName);
            innerResolve(tempLayer);
        } catch (e) {
            console.log(e);
        }
    });
}

const createLayers = async (context) => {

    return new Promise(async (resolve) => {

        const promiseBottomArray = [];
        const promiseTopArray = [];

        for (let i = 0; i < context.data.hexArray.length; i++) {
            promiseBottomArray.push(drawLayer(context, i, true));
        }

        for (let i = 0; i < context.data.hexArray.length; i++) {
            promiseTopArray.push(drawLayer(context, i, false));
        }

        //when all effect promises complete
        Promise.all([Promise.all(promiseBottomArray), Promise.all(promiseTopArray)]).then(async (layers) => {

            const theOpacityGaston = findValue(context.data.layerOpacityRange.lower, context.data.layerOpacityRange.upper, context.data.layerOpacityTimes, context.numberOfFrames, context.currentFrame)

            if (!context.data.invertLayers) {
                for (let i = 0; i < layers.length; i++) {
                    if (layers[i].length > 0) {
                        for (let inner = 0; inner < layers[i].length; inner++) {
                            await layers[i][inner].adjustLayerOpacity(theOpacityGaston);
                            await context.layer.compositeLayerOver(layers[i][inner]);
                        }
                    }
                }
            } else {
                for (let i = layers.length-1; i >= 0; i--) {
                    if (layers[i].length > 0) {
                        for (let inner = 0; inner < layers[i].length; inner++) {
                            await layers[i][inner].adjustLayerOpacity(theOpacityGaston);
                            await context.layer.compositeLayerOver(layers[i][inner]);
                        }
                    }
                }
            }
            resolve();
        });
    });

}


export const layeredHex = async (layer, data, currentFrame, numberOfFrames) => {
    const context = {
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        top: getWorkingDirectory() + 'layered-hex-top' + randomId() + '.png',
        bottom: getWorkingDirectory() + 'layered-hex-bottom' + randomId() + '.png',
        data: data,
        layer: layer
    };

    await createLayers(context);
}
