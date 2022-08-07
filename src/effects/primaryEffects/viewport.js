import {getRandomIntInclusive, randomId, randomNumber} from "../../logic/math/random.js";
import {getColorFromBucket, IMAGEHEIGHT, IMAGEWIDTH, WORKINGDIRETORY} from "../../logic/core/gobals.js";
import {createCanvas} from "canvas";
import fs from "fs";
import {findValue} from "../../logic/math/findValue.js";
import {drawPolygon2d} from "../../draw/drawPolygon2d.js";
import {drawRays2d} from "../../draw/drawRays2d.js";


const config = {
    stroke: 5,
    thickness: 5,
    ampStroke: 4,
    ampThickness: 2,
    radius: {lower: IMAGEHEIGHT * 0.15, upper: IMAGEHEIGHT * 0.20},
    ampLength: {lower: IMAGEHEIGHT * 0.1, upper: IMAGEHEIGHT * 0.15},
    ampRadius: {lower: IMAGEHEIGHT * 0.05, upper: IMAGEHEIGHT * 0.1},
    sparsityFactor: {lower: 10, upper: 20},
    amplitude: {lower: IMAGEHEIGHT * 0.001, upper: IMAGEHEIGHT * 0.005},
    times: {lower: 1, upper: 2},
}

const generate = () => {
    const data = {
        height: IMAGEHEIGHT,
        width: IMAGEWIDTH,
        stroke: config.stroke,
        thickness: config.thickness,
        innerColor: getColorFromBucket(),
        radius: getRandomIntInclusive(config.radius.lower, config.radius.upper),
        ampStroke: config.ampStroke,
        ampThickness: config.ampThickness,
        ampLength: getRandomIntInclusive(config.ampLength.lower, config.ampLength.upper),
        ampRadius: getRandomIntInclusive(config.ampRadius.lower, config.ampRadius.upper),
        sparsityFactor: randomNumber(config.sparsityFactor.lower, config.sparsityFactor.upper),
        amplitude: randomNumber(config.amplitude.lower, config.amplitude.upper),
        times: getRandomIntInclusive(config.times.lower, config.times.upper),
        color: getColorFromBucket(),
        ampInnerColor: getColorFromBucket(),
        ampOuterColor: getColorFromBucket(),
        center: {x: IMAGEWIDTH / 2, y: IMAGEHEIGHT / 2},
        getInfo: () => {
            return `${viewportEffect.name}: amp length:${data.ampLength}, sparsity:${data.sparsityFactor.toFixed(3)}`
        }
    }

    return data;
}

const viewport = async (data, layer, currentFrame, numberOfFrames) => {
    const imgName = WORKINGDIRETORY + 'viewport' + randomId() + '.png';

    const draw = async () => {
        const canvas = createCanvas(data.width, data.height)
        const context = canvas.getContext('2d');

        const theAmpGaston = findValue(data.ampRadius, data.ampRadius + data.ampLength + data.amplitude, data.times, numberOfFrames, currentFrame);
        drawRays2d(context, data.center, data.ampRadius, theAmpGaston, data.sparsityFactor, data.ampThickness, data.ampInnerColor, data.ampStroke, data.ampOuterColor)

        const thePolyGaston = findValue(data.radius, data.radius + data.amplitude, data.times, numberOfFrames, currentFrame);
        drawPolygon2d(context, thePolyGaston, data.center, 3, 210, data.thickness, data.innerColor, data.stroke, data.color)

        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(imgName, buffer);
    }

    await draw();

    await layer.fromFile(imgName);

    fs.unlinkSync(imgName);
}

export const effect = {
    invoke: (data, layer, currentFrame, totalFrames) => viewport(data, layer, currentFrame, totalFrames)
}

export const viewportEffect = {
    name: 'viewport',
    generateData: generate,
    effect: effect,
    effectChance: 70,
    requiresLayer: true,
}

