import {getRandomInt} from "../logic/random.js";
import {imageSize} from "../logic/gobals.js";
import {createCanvas} from "canvas";
import Jimp from "jimp";
import fs from "fs";
import {findPointByAngleAndCircle} from "../logic/drawingMath.js";

const config = {
    size: imageSize*2,
    stroke: 0.5,
    colorBucket: ['#FF0000', '#00FF00', '#0000FF', '#00FFFF', '#FF00FF', '#FFFF00',],
    sparsityFactor: {lower: 5, upper: 15},
    speed:{lower:1, upper:4},
    counterClockwise: {lower: 0, upper: 2},
    unitLength: {lower: 20, upper: 40},
}

const generate = () => {
    const data = {
        height: config.size,
        width: config.size,
        stroke: config.stroke,
        unitLength: getRandomInt(config.unitLength.lower, config.unitLength.upper),
        sparsityFactor: getRandomInt(config.sparsityFactor.lower, config.sparsityFactor.upper),
        color1: config.colorBucket[getRandomInt(0, config.colorBucket.length)],
        color2: config.colorBucket[getRandomInt(0, config.colorBucket.length)],
        color3: config.colorBucket[getRandomInt(0, config.colorBucket.length)],
        center: {x:config.size/2,y:config.size/2},
        speed:getRandomInt(config.speed.lower, config.speed.upper),
        counterClockwise: getRandomInt(config.counterClockwise.lower, config.counterClockwise.upper),
        getInfo: () => {
            return `${wireframeSpiralEffect.name}: sparsity: ${data.sparsityFactor.toFixed(3)}, unit: ${data.unitLength}, speed: ${data.speed}, direction: ${data.counterClockwise > 0 ? 'clockwise' : 'counter'}`
        }
    }

    return data;
}

const wireframeSpiral = async (data, img, currentFrame, numberOfFrames, card) => {
    const imgName = Date.now().toString() + '-wireframe-spiral.png';

    const draw = async (stroke, filename) => {
        const canvas = createCanvas(config.size, config.size)
        const context = canvas.getContext('2d');
        let twistCount = 2;
        let n1 = data.unitLength, n2 = data.unitLength, nextTerm;
        nextTerm = n1 + n2;

        const drawRay = (stroke, angle, radius, radiusNext, twist) => {
            const start = findPointByAngleAndCircle(data.center, angle, radius)
            const end = findPointByAngleAndCircle(data.center,angle+(twist*data.sparsityFactor), radiusNext);

            context.beginPath();

            const grad = context.createLinearGradient(start.x, start.y, end.x, end.y);
            grad.addColorStop(0, data.color1);
            grad.addColorStop(0.5, data.color2);
            grad.addColorStop(1, data.color3);

            context.strokeStyle = grad;

            context.moveTo(start.x, start.y);
            context.lineTo(end.x, end.y);

            context.stroke();
            context.closePath();
        }

        while (nextTerm <= config.size) {

            for (let i = 0; i < 360; i = i + data.sparsityFactor) {
                drawRay(stroke, i, n2, nextTerm, twistCount)
                drawRay(stroke, i, n2, nextTerm, -twistCount)
            }

            //assignment for next loop
            twistCount++;
            n1 = n2;
            n2 = nextTerm;
            nextTerm = n1 + n2;
        }

        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filename, buffer);
    }

    await draw(config.ringStroke, imgName);

    let tmpImg = await Jimp.read(imgName);


    const direction = data.counterClockwise > 0 ? -1 : 1
    await tmpImg.rotate((((data.sparsityFactor*data.speed)/numberOfFrames)*currentFrame)*direction, false);

    await img.composite(tmpImg, -imageSize/2, -imageSize/2, {
        mode: Jimp.BLEND_SOURCE_OVER,
    });

    fs.unlinkSync(imgName);

}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames, card) => wireframeSpiral(data, img, currentFrame, totalFrames, card)
}

export const wireframeSpiralEffect = {
    name: 'wireframe-spiral',
    generateData: generate,
    effect: effect,
    effectChance: 40,
    requiresLayer: true,
    rotatesImg:false,
    allowsRotation: false,
    rotationTotalAngle: 0,
}

