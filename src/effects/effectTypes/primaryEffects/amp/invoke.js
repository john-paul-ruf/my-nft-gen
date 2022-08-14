import {getWorkingDirectory} from "../../../../core/GlobalSettings.js";
import {randomId} from "../../../../core/math/random.js";
import {Canvas2dFactory} from "../../../../core/factory/Canvas2dFactory.js";
import {LayerFactory} from "../../../../core/factory/LayerFactory.js";
import fs from "fs";

const draw = async (stroke, context) => {
    for (let i = 0; i < 360; i = i + context.data.sparsityFactor) {
        await context.canvas.drawRay2d(context.data.center, stroke, context.data.color, context.data.innerColor, i, context.data.lineStart, context.data.length)
    }
    await context.canvas.toFile(context.drawing);
}

export const amp = async (layer, data) => {
    const context = {
        drawing: getWorkingDirectory() + 'amp' + randomId() + '.png',
        underlayName: getWorkingDirectory() + 'fuzzy-ripples-underlay' + randomId() + '.png',
        canvas: await Canvas2dFactory.getNewCanvas(data.width, data.height),
        data: data,
    }

    await draw(data.stroke, context);
    const compositeLayer = await LayerFactory.getLayerFromFile(context.drawing);
    await layer.compositeLayerOver(compositeLayer);

    fs.unlinkSync(context.drawing);
}