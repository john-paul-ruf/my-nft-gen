import {getRandomInt} from "../logic/random.js";
import {imageSize} from "../logic/gobals.js";
import {createCanvas} from "canvas";
import Jimp from "jimp";
import fs from "fs";
import {findPointByAngleAndCircle} from "../logic/drawingMath.js";

const config = {
    gates: {lower: 4, upper: 9},
    gateWidth: 12,
    size: imageSize,
    stroke: 8,
    colorBucket: ['#FF0000', '#00FF00', '#0000FF', '#00FFFF', '#FF00FF', '#FFFF00',]
}

const generate = () => {
    const data = {
        numberOfGates: getRandomInt(config.gates.lower, config.gates.upper),
        height: config.size,
        width: config.size,
        gateWidth: config.gateWidth,
        getInfo: () => {
            return `${gatesEffect.name}: ${data.numberOfGates} gates`
        }
    }

    const computeInitialInfo = (num) => {
        const info = [];
        for (let i = 0; i <= num; i++) {
            info.push({
                radius: getRandomInt(0, config.size/2),
                color: config.colorBucket[getRandomInt(0, config.colorBucket.length)],
            });
        }
        return info;
    }

    data.gates = computeInitialInfo(data.numberOfGates);

    return data;
}

const gates = async (data, img, currentFrame, numberOfFrames) => {
    const drawing = Date.now().toString() + '-gate.png';

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

                context.stroke();
                context.closePath();
            }

            drawOctagon(radius);
            drawOctagon(radius + data.gateWidth);
        }

        for (let i = 0; i < data.numberOfGates; i++) {
            drawGate(data.gates[i].radius, stroke, data.gates[i].color, data.gates[i].color);
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
    effectChance: 40,
    requiresLayer: true,
    baseLayer: false,
}

