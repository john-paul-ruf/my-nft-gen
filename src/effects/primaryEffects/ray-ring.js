import {getRandomIntInclusive, randomId, randomNumber} from "../../logic/math/random.js";
import {getColorFromBucket, getFinalImageSize, getWorkingDirectory,} from "../../logic/core/gobals.js";
import fs from "fs";
import {findValue} from "../../logic/math/findValue.js";
import {LayerFactory} from "../../layer/LayerFactory.js";
import {Canvas2dFactory} from "../../draw/Canvas2dFactory.js";

const finalImageSize = getFinalImageSize();

const config = {
    circles: {lower: 20, upper: 30},
    radiusGap: 40,
    stroke: 1,
    thickness: 1,
    scaleFactor: 1.01,
    densityFactor: 0.90,
    accentRange: {bottom: {lower: 0, upper: 2}, top: {lower: 4, upper: 6}},
    blurRange: {bottom: {lower: 1, upper: 2}, top: {lower: 4, upper: 6}},
    accentTimes: {lower: 3, upper: 6},
    blurTimes: {lower: 3, upper: 6},
    lengthRange: {bottom: {lower: 0, upper: 0}, top: {lower: 30, upper: 120}},
    lengthTimes: {lower: 3, upper: 12},
    sparsityFactor: {lower: 5, upper: 15},
}

const getRays = (sparsityFactor) => {
    const rays = [];

    for (let i = 0; i < 360; i = i + sparsityFactor) {
        rays.push({
            length: {
                lower: getRandomIntInclusive(config.lengthRange.bottom.lower, config.lengthRange.bottom.upper),
                upper: getRandomIntInclusive(config.lengthRange.top.lower, config.lengthRange.top.upper)
            },
            lengthTimes: getRandomIntInclusive(config.lengthTimes.lower, config.lengthTimes.upper)
        });
    }

    return rays;
}

const computeInitialInfo = (num) => {
    const info = [];
    for (let i = 0; i <= num; i++) {
        info.push({
            radius: config.radiusGap * (i + 1),
            color: getColorFromBucket(),
            accentTimes: getRandomIntInclusive(config.accentTimes.lower, config.accentTimes.upper),
            accentRange: {
                lower: getRandomIntInclusive(config.accentRange.bottom.lower, config.accentRange.bottom.upper),
                upper: getRandomIntInclusive(config.accentRange.top.lower, config.accentRange.top.upper)
            },
            sparsityFactor: randomNumber(config.sparsityFactor.lower, config.sparsityFactor.upper) * (config.densityFactor / (i + 1)),
        });
    }

    for (let c = 0; c < info.length; c++) {
        info[c].rays = getRays(info[c].sparsityFactor);
    }

    return info;
}

const generate = () => {
    const data = {
        numberOfCircles: getRandomIntInclusive(config.circles.lower, config.circles.upper),
        height: finalImageSize.height,
        width: finalImageSize.width,
        stroke: config.stroke,
        thickness: config.thickness,
        innerColor: getColorFromBucket(),
        scaleFactor: config.scaleFactor,
        center: {x: finalImageSize.width / 2, y: finalImageSize.height / 2},
        blurRange: {
            lower: getRandomIntInclusive(config.blurRange.bottom.lower, config.blurRange.bottom.upper),
            upper: getRandomIntInclusive(config.blurRange.top.lower, config.blurRange.top.upper)
        },
        blurTimes: getRandomIntInclusive(config.blurTimes.lower, config.blurTimes.upper),
        getInfo: () => {
            return `${rayRingEffect.name}: ${data.numberOfCircles} ray rings`
        }
    }

    data.circles = computeInitialInfo(data.numberOfCircles);

    return data;
}

async function drawRayRingInstance(withAccentGaston, i, context) {
    const theAccentGaston = withAccentGaston ? findValue(context.data.circles[i].accentRange.lower, context.data.circles[i].accentRange.upper, context.data.circles[i].accentTimes, context.numberOfFrames, context.currentFrame) : 0;
    await context.canvas.drawRing2d(context.data.center, context.data.circles[i].radius, context.data.thickness, context.data.innerColor, (context.data.stroke + theAccentGaston), context.data.circles[i].color)

    let rayIndex = 0;
    for (let a = 0; a < 360; a = a + context.data.circles[i].sparsityFactor) {
        const theLengthGaston = findValue(context.data.circles[i].rays[rayIndex].length.lower, context.data.circles[i].rays[rayIndex].length.upper, context.data.circles[i].rays[rayIndex].lengthTimes, context.numberOfFrames, context.currentFrame);
        await context.canvas.drawRay2d(context.data.center, context.data.stroke, context.data.circles[i].color, context.data.circles[i].color, a, context.data.circles[i].radius, theLengthGaston);
        rayIndex++;
    }
}

const draw = async (filename, withAccentGaston, context) => {
    for (let i = 0; i < context.data.numberOfCircles; i++) {
        await drawRayRingInstance(withAccentGaston, i, context);
    }
    await context.canvas.toFile(filename);
}

async function compositeImage(ring, fuzz, context, layer) {
    const theBlurGaston = Math.ceil(findValue(context.data.blurRange.lower, context.data.blurRange.upper, context.data.blurTimes, context.numberOfFrames, context.currentFrame));

    let fuzzLayer = await LayerFactory.getLayerFromFile(fuzz);
    let ringLayer = await LayerFactory.getLayerFromFile(ring);

    await fuzzLayer.blur(theBlurGaston);
    await fuzzLayer.adjustLayerOpacity(0.5);

    await layer.compositeLayerOver(fuzzLayer);
    await layer.compositeLayerOver(ringLayer);
}

const rayRing = async (data, layer, currentFrame, numberOfFrames) => {

    const context = {
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        drawing: getWorkingDirectory() + 'ray-ring' + randomId() + '.png',
        underlayName: getWorkingDirectory() + 'ray-ring-underlay' + randomId() + '.png',
        canvas: await Canvas2dFactory.getNewCanvas(data.width, data.height),
        data: data
    }

    await draw(context.drawing, false, context);
    await draw(context.underlayName, true, context);
    await compositeImage(context.drawing, context.underlayName, context, layer);

    fs.unlinkSync(context.drawing);
    fs.unlinkSync(context.underlayName);

}

export const effect = {
    invoke: (data, layer, currentFrame, totalFrames) => rayRing(data, layer, currentFrame, totalFrames)
}

export const rayRingEffect = {
    name: 'ray-rings', generateData: generate, effect: effect, effectChance: 100, requiresLayer: true,
}

