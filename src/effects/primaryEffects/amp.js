import {randomId, randomNumber} from "../../logic/random.js";
import {getColorFromBucket, IMAGESIZE, LAYERSTRATEGY, WORKINGDIRETORY} from "../../logic/gobals.js";
import {createCanvas} from "canvas";
import fs from "fs";
import {drawRay2d} from "../../draw/drawRay2d.js";
import {LayerFactory} from "../../layer/LayerFactory.js";

const config = {
    sparsityFactor: {lower: 0.5, upper: 1},
    size: IMAGESIZE,
    stroke: 1,
}

const generate = () => {
    const data = {
        sparsityFactor: randomNumber(config.sparsityFactor.lower, config.sparsityFactor.upper),
        height: config.size,
        width: config.size,
        stroke: config.stroke,
        color: getColorFromBucket(),
        innerColor: getColorFromBucket(),
        length: 400,
        lineStart: 350,
        center: {x: config.size / 2, y: config.size / 2},
        getInfo: () => {
            return `${ampEffect.name}: sparsity factor: ${data.sparsityFactor.toFixed(3)}`
        }
    }

    return data;
}

const amp = async (data, layer) => {
    const amp = WORKINGDIRETORY + 'amp' + randomId() + '.png';

    const draw = async (stroke, filename) => {
        const canvas = createCanvas(IMAGESIZE, IMAGESIZE)
        const context = canvas.getContext('2d');

        for (let i = 0; i < 360; i = i + data.sparsityFactor) {
            drawRay2d(context, data.center, stroke, data.color, data.innerColor, i, data.lineStart, data.length)
        }

        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filename, buffer);
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

