import {getRandomInt} from "../logic/random.js";
import {imageSize} from "../logic/gobals.js";
import {createCanvas} from "canvas";
import Jimp from "jimp";
import {findValue} from "../logic/findValue.js";
import fs from "fs";
import {findPointByAngleAndCircle} from "../logic/drawingMath.js";

const config = {
    gates: {lower: 5, upper: 12},
    gateWidth: 20,
    fuzzFactor: {lower: 1, upper: 5},
    size: imageSize,
    times: {lower: 1, upper: 3},
    stroke: 2,
    colorBucket: ['#FF0000', '#00FF00', '#0000FF', '#00FFFF', '#FF00FF', '#FFFF00',]
}

const generate = () => {
    const data = {
        fuzzFactor: getRandomInt(config.fuzzFactor.lower, config.fuzzFactor.upper),
        numberOfGates: getRandomInt(config.gates.lower, config.gates.upper),
        height: config.size,
        width: config.size,
        times: getRandomInt(config.times.lower, config.times.upper),
        gateWidth: config.gateWidth,
        getInfo: () => {
            return `${gatesEffect.name}: ${data.numberOfGates} gates`
        }
    }

    const computeInitialInfo = (num) => {
        const info = [];
        for (let i = 0; i <= num; i++) {
            info.push({
                radius: getRandomInt(0, config.size),
                scribeColor: config.colorBucket[getRandomInt(0, config.colorBucket.length)],
                gateColor: config.colorBucket[getRandomInt(0, config.colorBucket.length)],
            });
        }
        return info;
    }

    data.gates = computeInitialInfo(data.numberOfGates);

    return data;
}

const gates = async (data, img, currentFrame, numberOfFrames) => {
    const drawing = Date.now().toString() + '-gate.png';
    const fuzz = Date.now().toString() + '-gate-fuzz.png';

    const draw = async (stroke, filename) => {
        const canvas = createCanvas(imageSize, imageSize)
        const context = canvas.getContext('2d');

        const drawGate = (radius, stroke, gateColor, scribeColor) => {


            function drawOctagon(r) {
                context.beginPath();

                const start = findPointByAngleAndCircle(0, r);

                context.lineWidth = stroke;
                context.strokeStyle = gateColor;

                context.moveTo(start.x, start.y);

                for (let a = 45; a < 360; a = a + 45) {
                    const point = findPointByAngleAndCircle(a, r);
                    context.lineTo(point.x, point.y);
                }

                context.lineTo(start.x, start.y);

                context.closePath();
            }

            const inscribe = (stroke, color, minRadius, maxRadius) => {
                const lineRadius = minRadius + ((maxRadius - minRadius) / 2);

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

                for (let a = 45; a < 360; a = a + 45) {
                    context.beginPath();

                    context.lineWidth = stroke;
                    context.strokeStyle = color;

                    const start = findPointByAngleAndCircle(a + 5, lineRadius);
                    const end = findPointByAngleAndCircle(a + 40, lineRadius);

                    context.moveTo(start.x, start.y);
                    context.lineTo(end.x, end.y);

                    context.closePath();

                    for(let nextA = a+10; nextA < a-10; nextA++)
                    {
                        drawRay(stroke, color, minRadius, maxRadius);
                    }
                }
            }


            drawOctagon(radius);
            drawOctagon(radius + data.gateWidth);

            inscribe(stroke, scribeColor, radius+2, radius + data.gateWidth-2);

        }

        for (let i = 0; i < data.numberOfGates; i++) {
            drawGate(data.gates[i].radius, stroke, data.gates[i].gateColor, data.gates[i].scribeColor);
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
    invoke: (data, img, currentFrame, totalFrames) => gates(data, img, currentFrame, totalFrames)
}

export const gatesEffect = {
    name: 'gates',
    generateData: generate,
    effect: effect,
    effectChance: 100,
    requiresLayer: true,
    baseLayer: false,
}

