import {randomId, randomNumber} from "../../logic/math/random.js";
import {
    CANVASTRATEGY,
    getColorFromBucket,
    IMAGEHEIGHT,
    IMAGEWIDTH,
    LAYERSTRATEGY,
    WORKINGDIRETORY
} from "../../logic/core/gobals.js";
import fs from "fs";
import {LayerFactory} from "../../layer/LayerFactory.js";
import {Canvas2dFactory} from "../../draw/Canvas2dFactory.js";

const config = {
    sparsityFactor: {lower: 0.5, upper: 1},
    stroke: 2,
}

const generate = () => {
    const data = {
        sparsityFactor: randomNumber(config.sparsityFactor.lower, config.sparsityFactor.upper),
        height: IMAGEHEIGHT,
        width: IMAGEWIDTH,
        stroke: config.stroke,
        color: getColorFromBucket(),
        innerColor: getColorFromBucket(),
        length: 400,
        lineStart: 350,
        center: {x: IMAGEWIDTH / 2, y: IMAGEHEIGHT / 2},
        getInfo: () => {
            return `${ampEffect.name}: sparsity factor: ${data.sparsityFactor.toFixed(3)}`
        }
    }

    return data;
}

const amp = async (data, layer) => {
    const amp = WORKINGDIRETORY + 'amp' + randomId() + '.png';

    const draw = async (stroke, filename) => {
        const canvas = await Canvas2dFactory.getNewCanvas(CANVASTRATEGY, data.width, data.height);

        for (let i = 0; i < 360; i = i + data.sparsityFactor) {
            await canvas.drawRay2d(data.center, stroke, data.color, data.innerColor, i, data.lineStart, data.length)
        }

        await canvas.toFile(filename);
    }

    await draw(config.stroke, amp);

    const compositeLayer = await LayerFactory.getLayerFromFile(LAYERSTRATEGY, amp);

    await layer.compositeLayerOver(compositeLayer);

    fs.unlinkSync(amp);

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

