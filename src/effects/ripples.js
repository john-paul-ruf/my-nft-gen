import {getRandomInt} from "../logic/random.js";
import {imageSize} from "../logic/gobals.js";
import {createCanvas} from "canvas";
import Jimp from "jimp";
import fs from "fs";
import {findPointByAngleAndCircle} from "../logic/drawingMath.js";
import {findValue} from "../logic/findValue.js";
import {drawRing2d} from "../draw/drawRing2d.js";
import {drawPolygon2d} from "../draw/drawPolygon2d.js";

const config = {
    size: imageSize,
    stroke: 4,
    thickness: 15,
    innerColor: '#000000',
    colorBucket: ['#FF0000', '#00FF00', '#0000FF', '#00FFFF', '#FF00FF', '#FFFF00',],
    largeRadius: {lower: imageSize * 0.35, upper: imageSize * 0.45},
    smallRadius: {lower: imageSize * 0.15, upper: imageSize * 0.25},
    largeNumberOfRings: {lower: 10, upper: 20},
    smallNumberOfRings: {lower: 3, upper: 7},
    ripple: {lower: imageSize / 20, upper: imageSize / 30},
    times: {lower: 1, upper: 2},
    smallerRingsGroupRadius: {lower: imageSize * 0.2, upper: imageSize * 0.3},
}

const generate = () => {
    const data = {
        height: config.size,
        width: config.size,
        stroke: config.stroke,
        thickness: config.thickness,
        innerColor: config.innerColor,
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

const ripple = async (data, img, currentFrame, numberOfFrames, card) => {
    const imgName = Date.now().toString() + '-ripple.png';

    const draw = async (stroke, filename) => {
        const canvas = createCanvas(config.size, config.size)
        const context = canvas.getContext('2d');

        const drawRing = (pos, radius, innerStroke, innerColor, outerStroke, outerColor) => {
            const theGaston = findValue(radius, radius + data.ripple, data.times, numberOfFrames, currentFrame);
            drawRing2d(context, pos, theGaston, innerStroke, innerColor, outerStroke, outerColor)
        }

        const drawRings = (pos, color, radius, numberOfRings) => {
            for (let i = 0; i < numberOfRings; i++) {
                drawRing(pos, radius / numberOfRings * i, data.thickness, data.innerColor, data.stroke, color);
            }
        }

        drawRings(findPointByAngleAndCircle(data.center, 30, data.smallerRingsGroupRadius), data.smallColor, data.smallRadius, data.smallNumberOfRings);
        drawRings(findPointByAngleAndCircle(data.center, 90, data.smallerRingsGroupRadius), data.smallColor, data.smallRadius, data.smallNumberOfRings);
        drawRings(findPointByAngleAndCircle(data.center, 150, data.smallerRingsGroupRadius), data.smallColor, data.smallRadius, data.smallNumberOfRings);
        drawRings(findPointByAngleAndCircle(data.center, 210, data.smallerRingsGroupRadius), data.smallColor, data.smallRadius, data.smallNumberOfRings);
        drawRings(findPointByAngleAndCircle(data.center, 270, data.smallerRingsGroupRadius), data.smallColor, data.smallRadius, data.smallNumberOfRings);
        drawRings(findPointByAngleAndCircle(data.center, 330, data.smallerRingsGroupRadius), data.smallColor, data.smallRadius, data.smallNumberOfRings);

        drawPolygon2d(context, data.smallRadius, data.center, 6, 30, data.thickness, data.innerColor, data.stroke, data.smallColor)

        drawRings(data.center, data.largeColor, data.largeRadius, data.largeNumberOfRings);

        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filename, buffer);
    }

    await draw(config.ringStroke, imgName);

    let tmpImg = await Jimp.read(imgName);

    await img.composite(tmpImg, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
    });

    fs.unlinkSync(imgName);

}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames, card) => ripple(data, img, currentFrame, totalFrames, card)
}

export const rippleEffect = {
    name: 'ripples',
    generateData: generate,
    effect: effect,
    effectChance: 0, //Was I a good effect?  You were the best effect...
    requiresLayer: true,
    rotatesImg: false,
    allowsRotation: true,
    rotationTotalAngle: 60,
}

