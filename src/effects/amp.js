import {getRandomInt} from "../logic/random.js";
import {imageSize} from "../logic/gobals.js";
import {createCanvas} from "canvas";
import Jimp from "jimp";
import {findValue} from "../logic/findValue.js";
import fs from "fs";
import {findPointByAngleAndCircle} from "../logic/drawingMath.js";

const config = {
    circles: {lower: 10, upper: 25},
    fuzzFactor: {lower: 1, upper: 5},
    densityFactory: {lower: 1, upper: 5},
    size: imageSize,
    times: {lower: 1, upper: 3},
    stroke: 1,
    colorBucket: ['#FF0000', '#00FF00', '#0000FF', '#00FFFF', '#FF00FF', '#FFFF00',]
}

const generate = () => {
    const data = {
        sparsityFactory: getRandomInt(config.densityFactory.lower, config.densityFactory.upper),
        fuzzFactor: getRandomInt(config.fuzzFactor.lower, config.fuzzFactor.upper),
        numberOfCircles: getRandomInt(config.circles.lower, config.circles.upper),
        height: config.size,
        width: config.size,
        times: getRandomInt(config.times.lower, config.times.upper),
        color: config.colorBucket[getRandomInt(0, config.colorBucket.length)],
        length: (config.size / 2) - (config.size / 3),
        lineStart: config.size / 3,
        getInfo: () => {
            return `${ampEffect.name}: sparsity Factor: ${data.sparsityFactory}, fuzz factor: ${data.fuzzFactor}, ${data.times} times`
        }
    }

    const computeInitialInfo = (num) => {
        const info = [];
        for (let i = 0; i <= num; i++) {
            info.push({
                radius: getRandomInt(config.size / 3, config.size / 2),
                color: config.colorBucket[getRandomInt(0, config.colorBucket.length)],
            });
        }
        return info;
    }

    data.circles = computeInitialInfo(data.numberOfCircles);

    return data;
}

const amp = async (data, img, currentFrame, numberOfFrames) => {
    const drawing = Date.now().toString() + '-amp.png';
    const fuzz = Date.now().toString() + '-amp-fuzz.png';

    const draw = async (stroke, filename) => {
        const canvas = createCanvas(imageSize, imageSize)
        const context = canvas.getContext('2d');

        const drawRing = (radius, stroke, color) => {
            context.beginPath();
            context.arc(imageSize / 2, imageSize / 2, radius, 0, 2 * Math.PI, false);
            context.lineWidth = stroke;
            context.strokeStyle = color;
            context.stroke();
            context.closePath();
        }

        const drawCross = (color, stroke, angle, radius, size) => {

            const oneStart = findPointByAngleAndCircle(angle - size, radius - size)
            const oneEnd = findPointByAngleAndCircle(angle + size, radius + size);

            const twoStart = findPointByAngleAndCircle(angle - size, radius + size)
            const twoEnd = findPointByAngleAndCircle(angle + size, radius - size);

            context.beginPath();

            context.lineWidth = stroke;
            context.strokeStyle = color;

            context.moveTo(oneStart.x, oneStart.y);
            context.lineTo(oneEnd.x, oneEnd.y);
            context.stroke();

            context.closePath();

            context.beginPath();

            context.lineWidth = stroke;
            context.strokeStyle = color;

            context.moveTo(twoStart.x, twoStart.y);
            context.lineTo(twoEnd.x, twoEnd.y);
            context.stroke();

            context.closePath();
        }

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

        for (let i = 0; i < data.numberOfCircles; i++) {
            drawRing(data.circles[i].radius, stroke, data.circles[i].color);
        }

        for(let i = 0; i < 360; i = i+ data.sparsityFactory)
        {
            drawRay(stroke, data.color, i, data.lineStart, data.length)
        }

        for (let i = 0; i < data.numberOfCircles; i++) {
            for (let a = 0; a < 360; a = a + data.sparsityFactory) {
                drawCross(data.circles[i].color, stroke, a, data.circles[i].radius, 3)
            }
        }
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filename, buffer);
    }

    await draw(config.stroke, drawing);
    await draw(Math.floor(findValue(0, data.fuzzFactor + config.stroke, data.times, numberOfFrames, currentFrame)), fuzz);

    let tmpImg = await Jimp.read(drawing);
    let fuzzImg = await Jimp.read(fuzz);

    await fuzzImg.blur(Math.floor(findValue(1, data.fuzzFactor + config.ringStroke, data.times, numberOfFrames, currentFrame)));
    await fuzzImg.opacity(0.7);

    await img.composite(fuzzImg, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
    });

    await img.composite(tmpImg, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
    });

    fs.unlinkSync(drawing);
    fs.unlinkSync(fuzz);

}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames) => amp(data, img, currentFrame, totalFrames)
}

export const ampEffect = {
    name: 'amp',
    generateData: generate,
    effect: effect,
    effectChance: 100,
    requiresLayer: true,
    baseLayer: false,
}

