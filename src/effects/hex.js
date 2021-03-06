import {getRandomInt, randomNumber} from "../logic/random.js";
import {imageSize} from "../logic/gobals.js";
import {createCanvas} from "canvas";
import Jimp from "jimp";
import fs from "fs";
import {findPointByAngleAndCircle} from "../logic/drawingMath.js";
import {findValue} from "../logic/findValue.js";
import {drawRing2d} from "../draw/drawRing2d.js";
import {drawPolygon2d} from "../draw/drawPolygon2d.js";
import {findOneWayValue} from "../logic/findOneWayValue.js";

const config = {
    size: imageSize,
    sparsityFactor: {lower: 24, upper: 24},
    gapFactor: {lower: 5, upper: 15},
    radiusFactor: {lower: 30, upper: 55},
    stroke: 0.5,
    thickness: 3,
    scaleFactor: 1.10,
    innerColor: '#000000',
    colorBucket: ['#FF0000', '#00FF00', '#0000FF', '#00FFFF', '#FF00FF', '#FFFF00',]
}

const generate = () => {
    const data = {
        height: config.size,
        width: config.size,
        stroke: config.stroke,
        thickness: config.thickness,
        innerColor: config.innerColor,
        scaleFactor: config.scaleFactor,
        sparsityFactor: getRandomInt(config.sparsityFactor.lower, config.sparsityFactor.upper),
        gapFactor: getRandomInt(config.gapFactor.lower, config.gapFactor.upper),
        radiusFactor: getRandomInt(config.radiusFactor.lower, config.radiusFactor.upper),
        color: config.colorBucket[getRandomInt(0, config.colorBucket.length)],
        center: {x: config.size / 2, y: config.size / 2},
        getInfo: () => {
            return `${hexEffect.name}: sparsityFactor: ${data.sparsityFactor}, gapFactor: ${data.gapFactor}, radiusFactor: ${data.radiusFactor}`
        }
    }

    return data;
}

const hex = async (data, img, currentFrame, numberOfFrames, card) => {
    const imgName = Date.now().toString() + 'hex.png';
    const underlayName = Date.now().toString() + 'hex-accent.png';

    const draw = async (stroke, filename, accentBoost) => {
        const canvas = createCanvas(config.size, config.size)
        const context = canvas.getContext('2d');

        const drawHexLine = (angle, index) => {
            const loopCount = index + 1;
            const direction = loopCount % 2;
            const invert = direction <= 0;

            const theAngleGaston = findOneWayValue(angle, angle + data.sparsityFactor, numberOfFrames, currentFrame, invert);
            const theRotateGaston = findOneWayValue(theAngleGaston, theAngleGaston + 60, numberOfFrames, currentFrame, invert)

            const scaleBy = (data.scaleFactor * loopCount);
            const radius = data.radiusFactor * scaleBy;
            const gapRadius = ((imageSize * .05) + radius + (data.gapFactor * scaleBy) * loopCount)
            const pos = findPointByAngleAndCircle(data.center, theAngleGaston, gapRadius)

            drawPolygon2d(context, radius, pos, 6, theAngleGaston, data.thickness * scaleBy, data.innerColor, (data.stroke + accentBoost) * scaleBy, data.color)
        }

        for (let i = 0; i < 20; i++) {
            for (let a = 0; a < 360; a = a + data.sparsityFactor) {
                drawHexLine(a, i)
            }
        }

        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filename, buffer);
    }

    await draw(config.ringStroke, imgName, 0);

    const theAccentGaston = findValue(0, 3, 1, numberOfFrames, currentFrame);
    await draw(config.ringStroke, underlayName, theAccentGaston);

    let underlayImg = await Jimp.read(underlayName);

    const theBlurGaston = Math.ceil(findValue(1, 3, 1, numberOfFrames, currentFrame));
    await underlayImg.blur(theBlurGaston);

    await underlayImg.opacity(0.5);

    let tmpImg = await Jimp.read(imgName);

    await img.composite(underlayImg, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
    });

    await img.composite(tmpImg, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
    });

   /* const compName = Date.now().toString() + 'hex-comp.png';
    img.write(compName);*/

    fs.unlinkSync(imgName);
    fs.unlinkSync(underlayName);
}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames, card) => hex(data, img, currentFrame, totalFrames, card)
}

export const hexEffect = {
    name: 'hex',
    generateData: generate,
    effect: effect,
    effectChance: 50,
    requiresLayer: true,
    rotatesImg: false,
    allowsRotation: false,
    rotationTotalAngle: 0,
}

