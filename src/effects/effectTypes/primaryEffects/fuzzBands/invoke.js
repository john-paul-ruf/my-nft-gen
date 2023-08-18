import {findValue} from "../../../../core/math/findValue.js";
import {getWorkingDirectory} from "../../../../core/GlobalSettings.js";
import {randomId} from "../../../../core/math/random.js";
import {Canvas2dFactory} from "../../../../core/factory/canvas/Canvas2dFactory.js";
import fs from "fs";
import {LayerFactory} from "../../../../core/factory/layer/LayerFactory.js";

const createThoseFuzzyBands = async (context) => {

    //draw with top
    for (let i = 0; i < context.data.numberOfCircles; i++) {
        let canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

        await canvas.drawRing2d(context.data.center, context.data.circles[i].radius, context.data.thickness, context.data.circles[i].innerColor, context.data.stroke, context.data.circles[i].color)

        await canvas.toFile(context.names.layerNames[i]);
    }

    //draw underlay, blur and composite on main layer
    for (let i = 0; i < context.data.numberOfCircles; i++) {

        let canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

        const theAccentGaston = findValue(context.data.circles[i].accentRange.lower, context.data.circles[i].accentRange.upper, context.data.circles[i].featherTimes, context.numberOfFrames, context.currentFrame);
        await canvas.drawRing2d(context.data.center, context.data.circles[i].radius, context.data.thickness, context.data.circles[i].innerColor, (context.data.stroke + theAccentGaston), context.data.circles[i].color)

        await canvas.toFile(context.names.underlayNames[i]);

        let underlayLayer = await LayerFactory.getLayerFromFile(context.names.underlayNames[i]);

        let compositeCanvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);
        await compositeCanvas.toFile(context.names.compositeNames[i]);

        let compositeLayer = await LayerFactory.getLayerFromFile(context.names.compositeNames[i]);

        const theBlurGaston = Math.ceil(findValue(context.data.circles[i].blurRange.lower, context.data.circles[i].blurRange.upper, context.data.circles[i].featherTimes, context.numberOfFrames, context.currentFrame));
        await underlayLayer.blur(theBlurGaston);

        await underlayLayer.adjustLayerOpacity(context.data.underLayerOpacity);

        await compositeLayer.compositeLayerOver(underlayLayer);
        await compositeLayer.toFile(context.names.compositeNames[i]);

        fs.unlinkSync(context.names.underlayNames[i]);
    }

    //composite all top layers over the underlay
    for (let i = 0; i < context.data.numberOfCircles; i++) {

        let tempLayer = await LayerFactory.getLayerFromFile(context.names.layerNames[i]);

        let compositeLayer = await LayerFactory.getLayerFromFile(context.names.compositeNames[i]);

        await tempLayer.adjustLayerOpacity(context.data.layerOpacity);

        await compositeLayer.compositeLayerOver(tempLayer);
        await compositeLayer.toFile(context.names.compositeNames[i]);

        fs.unlinkSync(context.names.layerNames[i]);
    }

    //add all composites, with individual feathering, to effect layer
    for (let i = 0; i < context.data.numberOfCircles; i++) {
        let compositeLayer = await LayerFactory.getLayerFromFile(context.names.compositeNames[i]);

        await context.layer.compositeLayerOver(compositeLayer);

        fs.unlinkSync(context.names.compositeNames[i]);
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
