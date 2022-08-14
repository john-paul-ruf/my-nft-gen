import {getRandomIntInclusive, randomId} from "../../logic/math/random.js";
import {getColorFromBucket, getFinalImageSize, getWorkingDirectory,} from "../../logic/core/gobals.js";
import fs from "fs";
import {findPointByAngleAndCircle} from "../../logic/math/drawingMath.js";
import {findValue} from "../../logic/math/findValue.js";
import {findOneWayValue} from "../../logic/math/findOneWayValue.js";
import {LayerFactory} from "../../layer/LayerFactory.js";
import {Canvas2dFactory} from "../../draw/Canvas2dFactory.js";

const config = {
    sparsityFactor: {lower: 24, upper: 24},
    gapFactor: {lower: 5, upper: 10},
    radiusFactor: {lower: 15, upper: 30},
    accentRange: {bottom: {lower: 0, upper: 2}, top: {lower: 4, upper: 6}},
    blurRange: {bottom: {lower: 1, upper: 2}, top: {lower: 4, upper: 6}},
    accentTimes: {lower: 3, upper: 6},
    blurTimes: {lower: 3, upper: 6},
    stroke: 0.25,
    thickness: 0.5,
    scaleFactor: 1.005,
}

const finalImageSize = getFinalImageSize();

const generate = () => {
    const data = {
        height: finalImageSize.height,
        width: finalImageSize.width,
        stroke: config.stroke,
        thickness: config.thickness,
        innerColor: getColorFromBucket(),
        scaleFactor: config.scaleFactor,
        sparsityFactor: getRandomIntInclusive(config.sparsityFactor.lower, config.sparsityFactor.upper),
        gapFactor: getRandomIntInclusive(config.gapFactor.lower, config.gapFactor.upper),
        radiusFactor: getRandomIntInclusive(config.radiusFactor.lower, config.radiusFactor.upper),
        accentRange: {
            lower: getRandomIntInclusive(config.accentRange.bottom.lower, config.accentRange.bottom.upper),
            upper: getRandomIntInclusive(config.accentRange.top.lower, config.accentRange.top.upper)
        },
        blurRange: {
            lower: getRandomIntInclusive(config.blurRange.bottom.lower, config.blurRange.bottom.upper),
            upper: getRandomIntInclusive(config.blurRange.top.lower, config.blurRange.top.upper)
        },
        accentTimes: getRandomIntInclusive(config.accentTimes.lower, config.accentTimes.upper),
        blurTimes: getRandomIntInclusive(config.blurTimes.lower, config.blurTimes.upper),
        color: getColorFromBucket(),
        center: {x: finalImageSize.width / 2, y: finalImageSize.height / 2},
        getInfo: () => {
            return `${hexEffect.name}: sparsityFactor: ${data.sparsityFactor}, gapFactor: ${data.gapFactor}, radiusFactor: ${data.radiusFactor}`
        }
    }

    return data;
}

const drawHexLine = async (angle, index, context) => {
    const loopCount = index + 1;
    const direction = loopCount % 2;
    const invert = direction <= 0;

    const theAngleGaston = findOneWayValue(angle, angle + context.data.sparsityFactor, context.numberOfFrames, context.currentFrame, invert);
    const theRotateGaston = findOneWayValue(theAngleGaston, theAngleGaston + 360, context.numberOfFrames, context.currentFrame, invert)

    const scaleBy = (context.data.scaleFactor * loopCount);
    const radius = context.data.radiusFactor * scaleBy;
    const gapRadius = ((finalImageSize.height * .05) + radius + (context.data.gapFactor * scaleBy) * loopCount)
    const pos = findPointByAngleAndCircle(context.data.center, theAngleGaston, gapRadius)

    await context.canvas.drawPolygon2d(radius, pos, 6, theRotateGaston, context.data.thickness * scaleBy, context.data.innerColor, (context.data.stroke + context.accentBoost) * scaleBy, context.data.color)
}

const draw = async (filename, accentBoost, context) => {
    context.accentBoost = accentBoost;
    for (let i = 0; i < 20; i++) {
        for (let a = 0; a < 360; a = a + context.data.sparsityFactor) {
            await drawHexLine(a, i, context)
        }
    }
    await context.canvas.toFile(filename);
}

async function compositeImage(data, context, layer) {

    await draw(context.drawing, 0, context);
    await draw(context.underlayName, context.theAccentGaston, context);

    let tempLayer = await LayerFactory.getLayerFromFile(context.drawing);
    let underlayLayer = await LayerFactory.getLayerFromFile(context.underlayName);

    await underlayLayer.blur(context.theBlurGaston);
    await underlayLayer.adjustLayerOpacity(0.5);

    await layer.compositeLayerOver(underlayLayer)
    await layer.compositeLayerOver(tempLayer)
}

const hex = async (data, layer, currentFrame, numberOfFrames) => {

    const context = {
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        theAccentGaston: findValue(data.accentRange.lower, data.accentRange.upper, data.accentTimes, numberOfFrames, currentFrame),
        theBlurGaston: Math.ceil(findValue(data.blurRange.lower, data.blurRange.upper, data.blurTimes, numberOfFrames, currentFrame)),
        drawing: getWorkingDirectory() + 'hex' + randomId() + '.png',
        underlayName: getWorkingDirectory() + 'hex-under' + randomId() + '.png',
        canvas: await Canvas2dFactory.getNewCanvas(data.width, data.height),
        data: data,
    }

    await compositeImage(data, context, layer);

    fs.unlinkSync(context.drawing);
    fs.unlinkSync(context.underlayName);
}

export const effect = {
    invoke: (data, layer, currentFrame, totalFrames) => hex(data, layer, currentFrame, totalFrames)
}

export const hexEffect = {
    name: 'hex',
    generateData: generate,
    effect: effect,
    effectChance: 70,
    requiresLayer: true,
}

