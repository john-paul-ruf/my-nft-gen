import {getWorkingDirectory} from "../../../../core/GlobalSettings.js";
import {randomId} from "../../../../core/math/random.js";
import {findValue} from "../../../../core/math/findValue.js";
import {Canvas2dFactory} from "../../../../core/factory/canvas/Canvas2dFactory.js";
import {findPointByAngleAndCircle} from "../../../../core/math/drawingMath.js";
import {LayerFactory} from "../../../../core/factory/layer/LayerFactory.js";
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

    return new Promise(async (resolve) => {

        async function rings(i) {
            const tempFileName = getWorkingDirectory() + 'lens-flare-ring' + randomId() + '.png'
            const canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

            const theOpacityGaston = findValue(array[i].opacity.lower, array[i].opacity.upper, array[i].opacityTimes, context.numberOfFrames, context.currentFrame)
            const theRadiusGaston = findValue(array[i].size + array[i].gastonRange.lower, array[i].size + array[i].gastonRange.upper, array[i].gastonTimes, context.numberOfFrames, context.currentFrame, array[i].gastonInvert)
            const theBlurGaston = Math.ceil(findValue(array[i].blurRange.lower, array[i].blurRange.upper, array[i].blurTimes, context.numberOfFrames, context.currentFrame));


            await canvas.drawRing2d(context.data.center, theRadiusGaston, array[i].stroke, array[i].color, array[i].stroke, array[i].color, theOpacityGaston);

            await canvas.toFile(tempFileName);

            const tempLayer = await LayerFactory.getLayerFromFile(tempFileName);

            await tempLayer.blur(theBlurGaston);
            await tempLayer.adjustLayerOpacity(theOpacityGaston);
            await context.layer.compositeLayerOver(tempLayer);

            fs.unlinkSync(tempFileName);
        }

        const ringPromiseArray = [];

        for (let i = 0; i < array.length; i++) {
            ringPromiseArray.push(rings(i));
        }

        //when all effect promises complete
        Promise.all(ringPromiseArray).then(() => {
            //resolve process frame promise
            resolve(); //we have completed a single frame
        });
    });
}

const drawRayArray = async (context, array) => {

    return new Promise(async (resolve) => {
        async function rays(i) {
            const tempFileName = getWorkingDirectory() + 'lens-flare-ray' + randomId() + '.png'
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
            await context.layer.compositeLayerOver(tempLayer);

            fs.unlinkSync(tempFileName);
        }

        const promiseArray = [];

        for (let i = 0; i < array.length; i++) {
            promiseArray.push(rays(i));
        }

        //when all effect promises complete
        Promise.all(promiseArray).then(() => {
            //resolve process frame promise
            resolve(); //we have completed a single frame
        });
    });
}

const createLensFlare = async (context) => {
    await drawHexArray(context, context.data.hexArray);
    await drawRingArray(context, context.data.ringArray);
    await drawRayArray(context, context.data.rayArray);
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
