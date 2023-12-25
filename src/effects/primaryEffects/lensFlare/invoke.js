
import {randomId} from "../../../core/math/random.js";
import {findValue} from "../../../core/math/findValue.js";
import {Canvas2dFactory} from "../../../core/factory/canvas/Canvas2dFactory.js";
import {findPointByAngleAndCircle} from "../../../core/math/drawingMath.js";
import {LayerFactory} from "../../../core/factory/layer/LayerFactory.js";
import fs from "fs";
import {GlobalSettings} from "../../../core/GlobalSettings.js";

//not hex but hey...
const drawHexArray = async (context, array) => {
    async function hex(i) {
        return new Promise(async (innerResolve) => {
            const tempFileName = GlobalSettings.getWorkingDirectory() + 'lens-flare-ring' + randomId() + '.png'

            const angleGaston = findValue(context.data.angleRangeFlareHex.lower, context.data.angleRangeFlareHex.upper, context.data.angleGastonTimes, context.numberOfFrames, context.currentFrame);

            const pos = findPointByAngleAndCircle(context.data.center, angleGaston, array[i].offset)

            const theOpacityGaston = findValue(array[i].opacity.lower, array[i].opacity.upper, array[i].opacityTimes, context.numberOfFrames, context.currentFrame)

            await context.canvas.drawFilledPolygon2d(array[i].size, pos, array[i].sides, array[i].angle, array[i].color, theOpacityGaston);
            await context.canvas.drawPolygon2d(array[i].size, pos, array[i].sides, array[i].angle, 1.5, array[i].strokeColor, 1.5, array[i].strokeColor, theOpacityGaston);

            await canvas.toFile(tempFileName);
            const tempLayer = await LayerFactory.getLayerFromFile(tempFileName);

            fs.unlinkSync(tempFileName);
            innerResolve(tempLayer);
        });
    }

    return new Promise(async (resolve) => {
        const promiseArray = [];

        for (let i = 0; i < array.length; i++) {
            promiseArray.push(hex(i));
        }

        //when all effect promises complete
        Promise.all(promiseArray).then(async (layers) => {
            resolve(layers); //we have completed a single frame
        });
    });
}

async function rings(i, array, context) {
    return new Promise(async (innerResolve) => {
        try {
            const tempFileName = GlobalSettings.getWorkingDirectory() + 'lens-flare-ring' + randomId() + '.png'
            const canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

            const theOpacityGaston = findValue(array[i].opacity.lower, array[i].opacity.upper, array[i].opacityTimes, context.numberOfFrames, context.currentFrame)
            const theRadiusGaston = findValue(array[i].size + array[i].gastonRange.lower, array[i].size + array[i].gastonRange.upper, array[i].gastonTimes, context.numberOfFrames, context.currentFrame, array[i].gastonInvert)
            const theBlurGaston = Math.ceil(findValue(array[i].blurRange.lower, array[i].blurRange.upper, array[i].blurTimes, context.numberOfFrames, context.currentFrame));


            await canvas.drawRing2d(context.data.center, theRadiusGaston, array[i].stroke, array[i].color, array[i].stroke, array[i].color, theOpacityGaston);

            await canvas.toFile(tempFileName);

            const tempLayer = await LayerFactory.getLayerFromFile(tempFileName);

            await tempLayer.blur(theBlurGaston);
            await tempLayer.adjustLayerOpacity(theOpacityGaston);

            fs.unlinkSync(tempFileName);

            innerResolve(tempLayer);

        } catch (e) {
            console.log(e);
        }
    });
}

const drawRingArray = async (context, array) => {
    return new Promise(async (resolve) => {
        const ringPromiseArray = [];

        for (let i = 0; i < array.length; i++) {
            ringPromiseArray.push(rings(i, array, context));
        }

        //when all effect promises complete
        Promise.all(ringPromiseArray).then(async (layers) => {
            resolve(layers); //we have completed a single frame
        });
    });
}

async function rays(i, array, context) {
    return new Promise(async (innerResolve) => {
        try {
            const tempFileName = GlobalSettings.getWorkingDirectory() + 'lens-flare-ray' + randomId() + '.png'
            const canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

            const theOpacityGaston = findValue(array[i].opacity.lower, array[i].opacity.upper, array[i].opacityTimes, context.numberOfFrames, context.currentFrame)
            const theBlurGaston = Math.ceil(findValue(array[i].blurRange.lower, array[i].blurRange.upper, array[i].blurTimes, context.numberOfFrames, context.currentFrame));

            const theAngleGaston = findValue(array[i].angle + array[i].gastonRange.lower, array[i].angle + array[i].gastonRange.upper, array[i].gastonTimes, context.numberOfFrames, context.currentFrame, array[i].gastonInvert)

            const start = findPointByAngleAndCircle(context.data.center, theAngleGaston, array[i].offset);
            const end = findPointByAngleAndCircle(context.data.center, theAngleGaston, array[i].size);

            await canvas.drawLine2d(start, end, array[i].stroke, array[i].color, array[i].stroke, array[i].color, theOpacityGaston);
            await canvas.toFile(tempFileName);

            const tempLayer = await LayerFactory.getLayerFromFile(tempFileName);

            await tempLayer.blur(theBlurGaston);
            await tempLayer.adjustLayerOpacity(theOpacityGaston);

            fs.unlinkSync(tempFileName);

            innerResolve(tempLayer);
        } catch (e) {
            console.log(e);
        }

    });
}

const drawRayArray = async (context, array) => {
    return new Promise(async (resolve) => {
        const promiseArray = [];
        for (let i = 0; i < array.length; i++) {
            promiseArray.push(rays(i, array, context));
        }
        //when all effect promises complete
        Promise.all(promiseArray).then(async (layers) => {
            resolve(layers); //we have completed a single frame
        });
    });
}

const createLensFlare = async (context) => {
    return new Promise(async (resolve) => {

        const promiseArray = [];

        promiseArray.push(drawHexArray(context, context.data.hexArray));
        promiseArray.push(drawRingArray(context, context.data.ringArray));
        promiseArray.push(drawRayArray(context, context.data.rayArray));

        //when all effect promises complete
        Promise.all(promiseArray).then(async (layers) => {
            for (let i = 0; i < layers.length; i++) {
                if(layers[i].length > 0) {
                    for (let inner = 0; inner < layers[i].length; inner++) {
                        await context.layer.compositeLayerOver(layers[i][inner]);
                    }
                }
            }
            resolve();
        });
    });
}


export const lensFlare = async (layer, data, currentFrame, numberOfFrames) => {
    const context = {
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        canvas: await Canvas2dFactory.getNewCanvas(data.width, data.height),
        data: data,
        layer: layer
    };

    await createLensFlare(context);

    const theOpacityGaston = findValue(data.layerOpacityRange.lower, data.layerOpacityRange.upper, data.layerOpacityTimes, numberOfFrames, currentFrame)
    await layer.adjustLayerOpacity(theOpacityGaston);
}
