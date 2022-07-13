import {getRandomInt} from "../logic/random.js";
import {imageSize} from "../logic/gobals.js";
import {createCanvas} from "canvas";
import Jimp from "jimp";
import fs from "fs";
import {findPointByAngleAndCircle} from "../logic/drawingMath.js";
import {findValue} from "../logic/findValue.js";

const config = {
    size: imageSize,
    stroke: 0.5,
    colorBucket: ['#FF0000', '#00FF00', '#0000FF', '#00FFFF', '#FF00FF', '#FFFF00',],
    largeRadius: {lower: imageSize * 0.35, upper: imageSize * 0.45},
    smallRadius: {lower: imageSize * 0.2, upper: imageSize * 0.3},
    largeNumberOfRings: {lower: 10, upper: 20},
    smallNumberOfRings: {lower: 5, upper: 10},
    ripple: {lower: imageSize / 25, upper: imageSize / 20},
    times: {lower: 1, upper: 4},
    smallerRingsGroupRadius: {lower: imageSize * 0.2, upper: imageSize * 0.3},
}

const generate = () => {
    const data = {
        height: config.size,
        width: config.size,
        stroke: config.stroke,
        largeRadius: getRandomInt(config.largeRadius.lower, config.largeRadius.upper),
        smallRadius: getRandomInt(config.smallRadius.lower, config.smallRadius.upper),
        largeNumberOfRings: getRandomInt(config.largeNumberOfRings.lower, config.largeNumberOfRings.upper),
        smallNumberOfRings: getRandomInt(config.smallNumberOfRings.lower, config.smallNumberOfRings.upper),
        ripple: getRandomInt(config.ripple.lower, config.ripple.upper),
        smallerRingsGroupRadius: getRandomInt(config.smallerRingsGroupRadius.lower, config.smallerRingsGroupRadius.upper),
        times: getRandomInt(config.times.lower, config.times.upper),
        largeColor: config.colorBucket[getRandomInt(0, config.colorBucket.length)],
        smallColor: config.colorBucket[getRandomInt(0, config.colorBucket.length)],
        center: {x: config.size / 2, y: config.size / 2},
        getInfo: () => {
            return `${rippleEffect.name}: large rings: ${data.largeNumberOfRings}, small rings x6: ${data.smallNumberOfRings}, ripple: ${data.ripple}`
        }
    }

    return data;
}

const ripple = async (data, img, currentFrame, numberOfFrames) => {
    const imgName = Date.now().toString() + '-ripple.png';

    const draw = async (stroke, filename) => {
        const canvas = createCanvas(config.size, config.size)
        const context = canvas.getContext('2d');

        const drawRing = (pos, radius, stroke, color) => {
            context.beginPath();

            const theGaston = findValue(radius, radius+data.ripple, data.times, numberOfFrames, currentFrame);

            context.lineWidth = stroke;
            context.strokeStyle = color;

            context.arc(pos.x, pos.y, theGaston, 0, 2 * Math.PI, false);

            context.stroke();
            context.closePath();
        }

        const drawRings = (pos, color, radius, numberOfRings) => {
            for (let i = 0; i < numberOfRings; i++) {
                drawRing(pos,  radius/numberOfRings * i, stroke, color);
            }
        }

        drawRings(data.center, data.largeColor, data.largeRadius, data.largeNumberOfRings);
        drawRings(findPointByAngleAndCircle(data.center, 30, data.smallerRingsGroupRadius), data.smallColor, data.smallRadius, data.smallNumberOfRings);
        drawRings(findPointByAngleAndCircle(data.center, 90, data.smallerRingsGroupRadius), data.smallColor, data.smallRadius, data.smallNumberOfRings);
        drawRings(findPointByAngleAndCircle(data.center, 150, data.smallerRingsGroupRadius), data.smallColor, data.smallRadius, data.smallNumberOfRings);
        drawRings(findPointByAngleAndCircle(data.center, 210, data.smallerRingsGroupRadius), data.smallColor, data.smallRadius, data.smallNumberOfRings);
        drawRings(findPointByAngleAndCircle(data.center, 270, data.smallerRingsGroupRadius), data.smallColor, data.smallRadius, data.smallNumberOfRings);
        drawRings(findPointByAngleAndCircle(data.center, 330, data.smallerRingsGroupRadius), data.smallColor, data.smallRadius, data.smallNumberOfRings);

        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filename, buffer);
    }

    await draw(config.ringStroke, imgName);

    let tmpImg = await Jimp.read(imgName);

    await img.composite(tmpImg, -imageSize / 2, -imageSize / 2, {
        mode: Jimp.BLEND_SOURCE_OVER,
    });

    fs.unlinkSync(imgName);

}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames) => ripple(data, img, currentFrame, totalFrames)
}

export const rippleEffect = {
    name: 'ripples',
    generateData: generate,
    effect: effect,
    effectChance: 100,
    requiresLayer: true,
    rotatesImg: false,
    allowsRotation: false,
}

