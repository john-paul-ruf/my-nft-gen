import {getRandomInt, randomNumber} from "../logic/random.js";
import {imageSize} from "../logic/gobals.js";
import {createCanvas} from "canvas";
import Jimp from "jimp";
import fs from "fs";
import {findPointByAngleAndCircle} from "../logic/drawingMath.js";

const config = {
    fuzzFactor: {lower: 1, upper: 5},
    sparsityFactor: {lower: 0.5, upper: 2},
    size: imageSize,
    stroke: 3,
    colorBucket: ['#FF0000', '#00FF00', '#0000FF', '#00FFFF', '#FF00FF', '#FFFF00',]
}

const generate = () => {
    const data = {
        sparsityFactor: randomNumber(config.sparsityFactor.lower, config.sparsityFactor.upper),
        height: config.size,
        width: config.size,
        color: config.colorBucket[getRandomInt(0, config.colorBucket.length)],
        length: ((config.size / 2)/2)-((config.size / 2)/3),
        lineStart: ((config.size / 2)/3)*2,
        getInfo: () => {
            return `${ampEffect.name}: sparsity factor: ${data.sparsityFactor.toFixed(3)}`
        }
    }

    return data;
}

const amp = async (data, img, currentFrame, numberOfFrames) => {
    const drawing = Date.now().toString() + '-amp.png';

    const draw = async (stroke, filename) => {
        const canvas = createCanvas(imageSize, imageSize)
        const context = canvas.getContext('2d');

        const drawRay = (stroke, color, angle, radius, length) => {
            const start = findPointByAngleAndCircle(angle, radius)
            const end = findPointByAngleAndCircle(angle, radius + length);

            context.beginPath();
            context.lineWidth = stroke;
            context.strokeStyle = color;

            context.moveTo(start.x, start.y);
            context.lineTo(end.x, end.y);

            context.stroke();
            context.closePath();
        }

        for(let i = 0; i < 360; i = i+ data.sparsityFactor)
        {
            drawRay(stroke, data.color, i, data.lineStart, data.length)
        }

        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filename, buffer);
    }

    await draw(config.stroke, drawing);

    let tmpImg = await Jimp.read(drawing);

    await img.composite(tmpImg, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
    });

    fs.unlinkSync(drawing);

}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames) => amp(data, img, currentFrame, totalFrames)
}

export const ampEffect = {
    name: 'amp',
    generateData: generate,
    effect: effect,
    effectChance: 70,
    requiresLayer: true,
    baseLayer: false,
}

