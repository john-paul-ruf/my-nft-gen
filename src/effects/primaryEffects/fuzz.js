import {getRandomIntExclusive, getRandomIntInclusive, randomId} from "../../logic/math/random.js";
import {getColorFromBucket, IMAGEHEIGHT, IMAGEWIDTH, LAYERSTRATEGY, WORKINGDIRETORY} from "../../logic/core/gobals.js";
import {createCanvas} from "canvas";
import fs from "fs";
import {LayerFactory} from "../../layer/LayerFactory.js";


const config = {
    circles: {lower: 10, upper: 20},
    fuzzFactor: {lower: 1, upper: 3},
    times: {lower: 1, upper: 3},
    ringStroke: 0.5,
    blur: 2,
}

const generate = () => {
    const data = {
        numberOfCircles: getRandomIntInclusive(config.circles.lower, config.circles.upper),
        fuzzFactor: getRandomIntInclusive(config.fuzzFactor.lower, config.fuzzFactor.upper),
        height: IMAGEHEIGHT,
        width: IMAGEWIDTH,
        times: getRandomIntInclusive(config.times.lower, config.times.upper),
        getInfo: () => {
            return `${fuzzEffect.name}: ${data.numberOfCircles} circles, fuzz factor: ${data.fuzzFactor}, ${data.times} times`
        }
    }

    const computeInitialInfo = (num) => {
        const info = [];
        for (let i = 0; i <= num; i++) {
            info.push({
                radius: getRandomIntExclusive(0, data.width),
                color: getColorFromBucket(),
            });
        }
        return info;
    }

    data.circles = computeInitialInfo(data.numberOfCircles);

    return data;
}

const fuzz = async (data, layer) => {
    const ring = WORKINGDIRETORY + 'ring' + randomId() + '.png';
    const fuzz = WORKINGDIRETORY + 'fuzz' + randomId() + '.png';

    const draw = async (stroke, filename) => {
        const canvas = createCanvas(data.width, data.height)
        const context = canvas.getContext('2d');

        const drawRing = (radius, stroke, color) => {
            context.beginPath();
            context.lineWidth = stroke;
            context.strokeStyle = color;

            context.arc(IMAGEHEIGHT / 2, IMAGEHEIGHT / 2, radius, 0, 2 * Math.PI, false);

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

    let ringLayer = await LayerFactory.getLayerFromFile(LAYERSTRATEGY, ring);
    let fuzzLayer = await LayerFactory.getLayerFromFile(LAYERSTRATEGY, fuzz);

    await fuzzLayer.blur(config.blur);

    await layer.compositeLayerOver(fuzzLayer);
    await layer.compositeLayerOver(ringLayer);

    fs.unlinkSync(ring);
    fs.unlinkSync(fuzz);

}

export const effect = {
    invoke: (data, layer) => fuzz(data, layer)
}

export const fuzzEffect = {
    name: 'fuzz',
    generateData: generate,
    effect: effect,
    effectChance: 0,
    requiresLayer: true,
}

