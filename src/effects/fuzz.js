import {getRandomInt} from "../logic/random.js";
import {imageSize} from "../logic/gobals.js";
import {createCanvas} from "canvas";
import Jimp from "jimp";
import {findValue} from "../logic/findValue.js";
import fs from "fs";

const config = {
    circles: {lower: 30, upper: 60},
    fuzzFactor: {lower: 3, upper: 8},
    size: imageSize,
    times:  {lower: 1, upper: 3},
    ringStroke: 1,
    colorBucket: ['#FF0000','#00FF00','#0000FF','#00FFFF','#FF00FF','#FFFF00',]
}

const generate = () => {
    const data = {
        numberOfCircles: getRandomInt(config.circles.lower, config.circles.upper),
        fuzzFactor: getRandomInt(config.fuzzFactor.lower, config.fuzzFactor.upper),
        height: config.size,
        width: config.size,
        times: getRandomInt(config.times.lower, config.times.upper),
        getInfo: () => {
            return `${fuzzEffect.name}: ${data.numberOfCircles} circles, fuzz factor: ${data.fuzzFactor}, ${data.times} times`
        }
    }

    const computeInitialInfo = (num) => {
        const info = [];
        for (let i = 0; i <= num; i++) {
            info.push({
                radius: getRandomInt(0, config.size),
                color: config.colorBucket[getRandomInt(0, config.colorBucket.length)],
            });
        }
        return info;
    }

    data.circles = computeInitialInfo(data.numberOfCircles);

    return data;
}

const fuzz = async (data, img, currentFrame, numberOfFrames) => {
    const ring = Date.now().toString() +'-ring.png';
    const fuzz = Date.now().toString() +'-fuzz.png';

    const draw = async (stroke, filename) => {
        const canvas = createCanvas(imageSize, imageSize)
        const context = canvas.getContext('2d');

        const drawRing = (radius, stroke, color) => {
            context.beginPath();
            context.arc(imageSize/2, imageSize/2, radius, 0, 2 * Math.PI, false);
            context.lineWidth = stroke;
            context.strokeStyle = color;
            context.stroke();
            context.closePath();
        }

        for (let i = 0; i < data.numberOfCircles; i++) {
            drawRing(data.circles[i].radius, stroke, data.circles[i].color);
        }

        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filename, buffer);
    }

    await draw(config.ringStroke, ring);
    await draw(Math.floor(findValue(0, data.fuzzFactor+config.ringStroke,data.times, numberOfFrames, currentFrame)), fuzz);

    let ringImg = await Jimp.read(ring);
    let fuzzImg = await Jimp.read(fuzz);

    await fuzzImg.blur(Math.floor(findValue(1, data.fuzzFactor+config.ringStroke,data.times, numberOfFrames, currentFrame)));

    await img.composite(fuzzImg, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
    });

    await img.composite(ringImg, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
    });

    fs.unlinkSync(ring);
    fs.unlinkSync(fuzz);

}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames) => fuzz(data, img, currentFrame, totalFrames)
}

export const fuzzEffect = {
    name: 'fuzz',
    generateData: generate,
    effect: effect,
    effectChance: 50,
    requiresLayer: true,
    baseLayer: false,
}

