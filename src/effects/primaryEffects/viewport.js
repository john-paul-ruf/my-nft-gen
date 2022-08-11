import {getRandomIntInclusive, randomId, randomNumber} from "../../logic/math/random.js";
import {CANVASTRATEGY, getColorFromBucket, IMAGEHEIGHT, IMAGEWIDTH, WORKINGDIRETORY} from "../../logic/core/gobals.js";
import fs from "fs";
import {findValue} from "../../logic/math/findValue.js";
import {Canvas2dFactory} from "../../draw/Canvas2dFactory.js";


const config = {
    stroke: 2,
    thickness: 5,
    ampStroke: 1,
    ampThickness: 1,
    radius: {lower: 150, upper: 300},
    ampLength: {lower: 75, upper: 150},
    ampRadius: {lower: 50, upper: 150},
    sparsityFactor: {lower: 2, upper: 5},
    amplitude: {lower: 20, upper: 50},
    times: {lower: 3, upper: 6},
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

        const canvas = await Canvas2dFactory.getNewCanvas(CANVASTRATEGY, data.width, data.height);

        const theAmpGaston = findValue(data.ampRadius, data.ampRadius + data.ampLength + data.amplitude, data.times, numberOfFrames, currentFrame);
        await canvas.drawRays2d(data.center, data.ampRadius, theAmpGaston, data.sparsityFactor, data.ampThickness, data.ampInnerColor, data.ampStroke, data.ampOuterColor)

        const thePolyGaston = findValue(data.radius, data.radius + data.amplitude, data.times, numberOfFrames, currentFrame);
        await canvas.drawPolygon2d(thePolyGaston, data.center, 3, 210, data.thickness, data.innerColor, data.stroke, data.color)

        await canvas.toFile(imgName);
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

