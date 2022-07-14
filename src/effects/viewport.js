import {getRandomInt, randomNumber} from "../logic/random.js";
import {imageSize} from "../logic/gobals.js";
import {createCanvas} from "canvas";
import Jimp from "jimp";
import fs from "fs";
import {findValue} from "../logic/findValue.js";
import {drawPolygon2d} from "../draw/drawPolygon2d.js";
import {drawRays2d} from "../draw/drawRays2d.js";

const config = {
    size: imageSize,
    stroke: 5,
    thickness: 30,
    innerColor: '#000000',
    ampStroke: 1,
    ampThickness: 3,
    radius: {lower: imageSize * 0.15, upper: imageSize * 0.20},
    ampLength: {lower: imageSize * 0.1, upper: imageSize * 0.15},
    ampRadius: {lower: imageSize * 0.05, upper: imageSize * 0.1},
    sparsityFactor: {lower: 2, upper: 4},
    amplitude: {lower: imageSize * 0.01, upper: imageSize * 0.02},
    times: {lower: 1, upper: 2},
    colorBucket: ['#FF0000', '#00FF00', '#0000FF', '#00FFFF', '#FF00FF', '#FFFF00',],
}

const generate = () => {
    const data = {
        height: config.size,
        width: config.size,
        stroke: config.stroke,
        thickness: config.thickness,
        innerColor: config.innerColor,
        radius: getRandomInt(config.radius.lower, config.radius.upper),
        ampStroke: config.ampStroke,
        ampThickness: config.ampThickness,
        ampLength: getRandomInt(config.ampLength.lower, config.ampLength.upper),
        ampRadius: getRandomInt(config.ampRadius.lower, config.ampRadius.upper),
        sparsityFactor: randomNumber(config.sparsityFactor.lower, config.sparsityFactor.upper),
        amplitude: randomNumber(config.amplitude.lower, config.amplitude.upper),
        times: getRandomInt(config.times.lower, config.times.upper),
        color: config.colorBucket[getRandomInt(0, config.colorBucket.length)],
        ampInnerColor: config.colorBucket[getRandomInt(0, config.colorBucket.length)],
        ampOuterColor: config.colorBucket[getRandomInt(0, config.colorBucket.length)],
        center: {x: config.size / 2, y: config.size / 2},
        getInfo: () => {
            return `${viewportEffect.name}: amp length:${data.ampLength}, sparsity:${data.sparsityFactor.toFixed(3)}`
        }
    }

    return data;
}

const viewport = async (data, img, currentFrame, numberOfFrames, card) => {
    const imgName = Date.now().toString() + '-viewport.png';

    const draw = async (stroke, filename) => {
        const canvas = createCanvas(config.size, config.size)
        const context = canvas.getContext('2d');

        const theAmpGaston = findValue(data.ampRadius, data.ampRadius + data.ampLength+ data.amplitude, data.times, numberOfFrames, currentFrame);
        drawRays2d(context, data.center, data.ampRadius, theAmpGaston, data.sparsityFactor, data.ampThickness, data.ampInnerColor, data.ampStroke, data.ampOuterColor)

        const thePolyGaston = findValue(data.radius, data.radius + data.amplitude, data.times, numberOfFrames, currentFrame);
        drawPolygon2d(context, thePolyGaston, data.center, 3, 210,data.thickness, data.innerColor, data.stroke, data.color )

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
    invoke: (data, img, currentFrame, totalFrames, card) => viewport(data, img, currentFrame, totalFrames, card)
}

export const viewportEffect = {
    name: 'viewport',
    generateData: generate,
    effect: effect,
    effectChance: 100,
    requiresLayer: true,
    rotatesImg: false,
    allowsRotation: false,
    rotationTotalAngle: 0,
}

