import {randomId, randomNumber} from "../../logic/math/random.js";
import {getColorFromBucket, getFinalImageSize, getWorkingDirectory,} from "../../logic/core/gobals.js";
import fs from "fs";
import {LayerFactory} from "../../layer/LayerFactory.js";
import {Canvas2dFactory} from "../../draw/Canvas2dFactory.js";

const config = {
    sparsityFactor: {lower: 0.5, upper: 1},
    stroke: 0.5,
}

const finalImageSize = getFinalImageSize();

const generate = () => {
    const data = {
        sparsityFactor: randomNumber(config.sparsityFactor.lower, config.sparsityFactor.upper),
        height: finalImageSize.height,
        width: finalImageSize.width,
        stroke: config.stroke,
        color: getColorFromBucket(),
        innerColor: getColorFromBucket(),
        length: 400,
        lineStart: 350,
        center: {x: finalImageSize.width / 2, y: finalImageSize.height / 2},
        getInfo: () => {
            return `${ampEffect.name}: sparsity factor: ${data.sparsityFactor.toFixed(3)}`
        }
    }

    return data;
}

const draw = async (stroke, context) => {
    for (let i = 0; i < 360; i = i + context.data.sparsityFactor) {
        await context.canvas.drawRay2d(context.data.center, stroke, context.data.color, context.data.innerColor, i, context.data.lineStart, context.data.length)
    }
    await context.canvas.toFile(context.drawing);
}

const amp = async (data, layer) => {
    const context = {
        drawing: getWorkingDirectory() + 'amp' + randomId() + '.png',
        underlayName: getWorkingDirectory() + 'fuzzy-ripples-underlay' + randomId() + '.png',
        canvas: await Canvas2dFactory.getNewCanvas(data.width, data.height),
        data: data,
    }

    await draw(config.stroke, context);
    const compositeLayer = await LayerFactory.getLayerFromFile(context.drawing);
    await layer.compositeLayerOver(compositeLayer);

    fs.unlinkSync(context.drawing);
}

export const effect = {
    invoke: (data, layer) => amp(data, layer)
}

export const ampEffect = {
    name: 'amp',
    generateData: generate,
    effect: effect,
    effectChance: 50,
    requiresLayer: true,
}

