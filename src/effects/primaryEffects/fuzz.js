import {getRandomIntExclusive, getRandomIntInclusive, randomId} from "../../logic/random.js";
import {getColorFromBucket, IMAGESIZE} from "../../logic/gobals.js";
import {createCanvas} from "canvas";
import Jimp from "jimp";
import fs from "fs";


const config = {
    circles: {lower: 10, upper: 20},
    fuzzFactor: {lower: 1, upper: 3},
    size: IMAGESIZE,
    times: {lower: 1, upper: 3},
    ringStroke: 0.5,
    blur: 2,
}

const generate = () => {
    const data = {
        numberOfCircles: getRandomIntInclusive(config.circles.lower, config.circles.upper),
        fuzzFactor: getRandomIntInclusive(config.fuzzFactor.lower, config.fuzzFactor.upper),
        height: config.size,
        width: config.size,
        times: getRandomIntInclusive(config.times.lower, config.times.upper),
        getInfo: () => {
            return `${fuzzEffect.name}: ${data.numberOfCircles} circles, fuzz factor: ${data.fuzzFactor}, ${data.times} times`
        }
    }

    const computeInitialInfo = (num) => {
        const info = [];
        for (let i = 0; i <= num; i++) {
            info.push({
                radius: getRandomIntExclusive(0, config.size),
                color: getColorFromBucket(),
            });
        }
        return info;
    }

    data.circles = computeInitialInfo(data.numberOfCircles);

    return data;
}

const fuzz = async (data, img) => {
    const ring = randomId() + '-ring.png';
    const fuzz = randomId() + '-fuzz.png';

    const draw = async (stroke, filename) => {
        const canvas = createCanvas(IMAGESIZE, IMAGESIZE)
        const context = canvas.getContext('2d');

        const drawRing = (radius, stroke, color) => {
            context.beginPath();
            context.lineWidth = stroke;
            context.strokeStyle = color;

            context.arc(IMAGESIZE / 2, IMAGESIZE / 2, radius, 0, 2 * Math.PI, false);

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
    await draw(data.fuzzFactor + config.ringStroke, fuzz);

    let ringImg = await Jimp.read(ring);
    let fuzzImg = await Jimp.read(fuzz);

    await fuzzImg.blur(config.blur);

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
    invoke: (data, img) => fuzz(data, img)
}

export const fuzzEffect = {
    name: 'fuzz',
    generateData: generate,
    effect: effect,
    effectChance: 0,
    requiresLayer: true,
    rotatesImg: false,
    allowsRotation: false,
    rotationTotalAngle: 0,
}

