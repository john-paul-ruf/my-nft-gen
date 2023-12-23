import {findValue} from "../../../../core/math/findValue.js";
import {getWorkingDirectory} from "../../../../core/GlobalSettings.js";
import {randomId} from "../../../../core/math/random.js";
import {Canvas2dFactory} from "../../../../core/factory/canvas/Canvas2dFactory.js";
import fs from "fs";
import {LayerFactory} from "../../../../core/factory/layer/LayerFactory.js";

async function top(context, i) {
    return new Promise(async (resolve) => {
        let canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

        //draw
        await canvas.drawRing2d(context.data.center, context.data.circles[i].radius, context.data.thickness, context.data.circles[i].innerColor, context.data.stroke, context.data.circles[i].color)
        await canvas.toFile(context.names.layerNames[i]);

        //opacity
        let tempLayer = await LayerFactory.getLayerFromFile(context.names.layerNames[i]);
        await tempLayer.adjustLayerOpacity(context.data.layerOpacity);

        await tempLayer.toFile(context.names.layerNames[i]);

        resolve();
    });
}

async function bottom(context, i) {
    return new Promise(async (resolve) => {
        let canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

        //draw underlay
        const theAccentGaston = findValue(context.data.circles[i].accentRange.lower, context.data.circles[i].accentRange.upper, context.data.circles[i].featherTimes, context.numberOfFrames, context.currentFrame);
        await canvas.drawRing2d(context.data.center, context.data.circles[i].radius, context.data.thickness, context.data.circles[i].innerColor, (context.data.stroke + theAccentGaston), context.data.circles[i].color)
        await canvas.toFile(context.names.underlayNames[i]);

        let underlayLayer = await LayerFactory.getLayerFromFile(context.names.underlayNames[i]);

        //blur
        const theBlurGaston = Math.ceil(findValue(context.data.circles[i].blurRange.lower, context.data.circles[i].blurRange.upper, context.data.circles[i].featherTimes, context.numberOfFrames, context.currentFrame));
        await underlayLayer.blur(theBlurGaston);

        //opacity
        const theUnderLayerOpacityGaston = findValue(context.data.circles[i].underLayerOpacityRange.lower, context.data.circles[i].underLayerOpacityRange.upper, context.data.circles[i].underLayerOpacityTimes, context.numberOfFrames, context.currentFrame);
        await underlayLayer.adjustLayerOpacity(theUnderLayerOpacityGaston);

        await underlayLayer.toFile(context.names.underlayNames[i]);

        resolve();
    });
}

function buildLayers(context) {
    return new Promise(async (resolve) => {
        const promiseArray = [];

        //draw with top, opacity
        for (let i = 0; i < context.data.numberOfCircles; i++) {
            promiseArray.push(top(context, i));
        }

        //draw underlay, blur, and opacity
        for (let i = 0; i < context.data.numberOfCircles; i++) {
            promiseArray.push(await bottom(context, i));
        }

        Promise.all(promiseArray).then(() => {
            resolve();
        });
    });
}

const createThoseFuzzyBands = async (context) => {
    await buildLayers(context);
    //Combine top and bottom layers
    if (!context.data.invertLayers) {
        for (let i = 0; i < context.data.numberOfCircles; i++) {
            let tempUnderlay = await LayerFactory.getLayerFromFile(context.names.underlayNames[i]);
            await context.layer.compositeLayerOver(tempUnderlay);
            fs.unlinkSync(context.names.underlayNames[i]);
        }

        for (let i = 0; i < context.data.numberOfCircles; i++) {
            let tempLayer = await LayerFactory.getLayerFromFile(context.names.layerNames[i]);
            await context.layer.compositeLayerOver(tempLayer);
            fs.unlinkSync(context.names.layerNames[i]);
        }

    } else {
        for (let i = 0; i < context.data.numberOfCircles; i++) {
            let tempLayer = await LayerFactory.getLayerFromFile(context.names.layerNames[i]);
            await context.layer.compositeLayerOver(tempLayer);
            fs.unlinkSync(context.names.layerNames[i]);
        }

        for (let i = 0; i < context.data.numberOfCircles; i++) {
            let tempUnderlay = await LayerFactory.getLayerFromFile(context.names.underlayNames[i]);
            await context.layer.compositeLayerOver(tempUnderlay);
            fs.unlinkSync(context.names.underlayNames[i]);
        }
    }

}

export const fuzzBands = async (layer, data, currentFrame, numberOfFrames) => {

    const generateNames = (data) => {

        const layerNames = [];
        const underlayNames = [];
        const compositeNames = [];


        for (let index = 0; index < data.numberOfCircles; index++) {
            layerNames.push(getWorkingDirectory() + 'fuzz' + randomId() + '-layer-' + index.toString() + '.png')
            underlayNames.push(getWorkingDirectory() + 'fuzz' + randomId() + '-layer-underlay-' + index.toString() + '.png')
            compositeNames.push(getWorkingDirectory() + 'fuzz' + randomId() + '-layer-comp-' + index.toString() + '.png')
        }

        return {
            layerNames: layerNames,
            underlayNames: underlayNames,
            compositeNames: compositeNames,
        }
    }
    const context = {
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        names: (generateNames(data)),
        data: data,
        layer: layer,
    }

    await createThoseFuzzyBands(context);

}
