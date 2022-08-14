import {getRandomIntInclusive, randomId} from "../../logic/math/random.js";
import {getColorFromBucket, getFinalImageSize, getWorkingDirectory,} from "../../logic/core/gobals.js";
import fs from "fs";
import {findPointByAngleAndCircle} from "../../logic/math/drawingMath.js";
import {findValue} from "../../logic/math/findValue.js";
import {LayerFactory} from "../../layer/LayerFactory.js";
import {Canvas2dFactory} from "../../draw/Canvas2dFactory.js";

const finalImageSize = getFinalImageSize();

const config = {
    stroke: 1,
    thickness: 0.5,
    largeRadius: {lower: finalImageSize.height * 0.3, upper: finalImageSize.height * 0.4},
    smallRadius: {lower: finalImageSize.height * 0.1, upper: finalImageSize.height * 0.2},
    largeNumberOfRings: {lower: 15, upper: 20},
    smallNumberOfRings: {lower: 10, upper: 15},
    ripple: {lower: finalImageSize.height / 25, upper: finalImageSize.height / 35},
    times: {lower: 3, upper: 6},
    smallerRingsGroupRadius: {lower: finalImageSize.height * 0.25, upper: finalImageSize.height * 0.35},
    accentRange: {bottom: {lower: 0, upper: 2}, top: {lower: 4, upper: 6}},
    blurRange: {bottom: {lower: 1, upper: 2}, top: {lower: 4, upper: 6}},
    accentTimes: {lower: 3, upper: 6},
    blurTimes: {lower: 3, upper: 6},
}

const generate = () => {
    const data = {
        height: finalImageSize.height,
        width: finalImageSize.width,
        stroke: config.stroke,
        thickness: config.thickness,
        innerColor: getColorFromBucket(),
        largeRadius: getRandomIntInclusive(config.largeRadius.lower, config.largeRadius.upper),
        smallRadius: getRandomIntInclusive(config.smallRadius.lower, config.smallRadius.upper),
        largeNumberOfRings: getRandomIntInclusive(config.largeNumberOfRings.lower, config.largeNumberOfRings.upper),
        smallNumberOfRings: getRandomIntInclusive(config.smallNumberOfRings.lower, config.smallNumberOfRings.upper),
        ripple: getRandomIntInclusive(config.ripple.lower, config.ripple.upper),
        smallerRingsGroupRadius: getRandomIntInclusive(config.smallerRingsGroupRadius.lower, config.smallerRingsGroupRadius.upper),
        times: getRandomIntInclusive(config.times.lower, config.times.upper),
        largeColor: getColorFromBucket(),
        smallColor: getColorFromBucket(),
        center: {x: finalImageSize.width / 2, y: finalImageSize.height / 2},
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
        getInfo: () => {
            return `${fuzzyRippleEffect.name}: large rings: ${data.largeNumberOfRings}, small rings x6: ${data.smallNumberOfRings}, ripple: ${data.ripple}`
        }
    }

    return data;
}

const drawRing = async (pos, radius, innerStroke, innerColor, outerStroke, outerColor, context) => {
    const theGaston = findValue(radius, radius + context.data.ripple, context.data.times, context.numberOfFrames, context.currentFrame);
    await context.canvas.drawRing2d(pos, theGaston, innerStroke, innerColor, outerStroke + context.accentBoost, outerColor)
}

const drawRings = async (pos, color, radius, numberOfRings, context) => {
    for (let i = 0; i < numberOfRings; i++) {
        await drawRing(pos, radius / numberOfRings * i, context.data.thickness, context.data.innerColor, context.data.stroke, color, context);
    }
}

const draw = async (filename, accentBoost, context) => {
    context.accentBoost = accentBoost;

    await drawRings(findPointByAngleAndCircle(context.data.center, 30, context.data.smallerRingsGroupRadius), context.data.smallColor, context.data.smallRadius, context.data.smallNumberOfRings, context);
    await drawRings(findPointByAngleAndCircle(context.data.center, 90, context.data.smallerRingsGroupRadius), context.data.smallColor, context.data.smallRadius, context.data.smallNumberOfRings, context);
    await drawRings(findPointByAngleAndCircle(context.data.center, 150, context.data.smallerRingsGroupRadius), context.data.smallColor, context.data.smallRadius, context.data.smallNumberOfRings, context);
    await drawRings(findPointByAngleAndCircle(context.data.center, 210, context.data.smallerRingsGroupRadius), context.data.smallColor, context.data.smallRadius, context.data.smallNumberOfRings, context);
    await drawRings(findPointByAngleAndCircle(context.data.center, 270, context.data.smallerRingsGroupRadius), context.data.smallColor, context.data.smallRadius, context.data.smallNumberOfRings, context);
    await drawRings(findPointByAngleAndCircle(context.data.center, 330, context.data.smallerRingsGroupRadius), context.data.smallColor, context.data.smallRadius, context.data.smallNumberOfRings, context);

    await drawRings(context.data.center, context.data.largeColor, context.data.largeRadius, context.data.largeNumberOfRings, context);

    await context.canvas.drawPolygon2d(context.data.smallerRingsGroupRadius, context.data.center, 6, 30, context.data.thickness + accentBoost, context.data.innerColor, context.data.stroke, context.data.smallColor)

    await context.canvas.toFile(filename);
}

async function compositeImage(context, layer) {
    await draw(context.drawing, 0, context);
    await draw(context.underlayName, context.theAccentGaston, context);

    let tempLayer = await LayerFactory.getLayerFromFile(context.drawing);
    let underlayLayer = await LayerFactory.getLayerFromFile(context.underlayName);

    await underlayLayer.blur(context.theBlurGaston);
    await underlayLayer.adjustLayerOpacity(0.5);

    await layer.compositeLayerOver(underlayLayer)
    await layer.compositeLayerOver(tempLayer)
}

const fuzzyRipple = async (data, layer, currentFrame, numberOfFrames) => {
    const context = {
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        theBlurGaston: Math.ceil(findValue(data.blurRange.lower, data.blurRange.upper, data.blurTimes, numberOfFrames, currentFrame)),
        drawing: getWorkingDirectory() + 'fuzzy-ripples' + randomId() + '.png',
        underlayName: getWorkingDirectory() + 'fuzzy-ripples-underlay' + randomId() + '.png',
        canvas: await Canvas2dFactory.getNewCanvas(data.width, data.height),
        data: data,
    }

    await compositeImage(context, layer);

    fs.unlinkSync(context.drawing);
    fs.unlinkSync(context.underlayName);
}

export const effect = {
    invoke: (data, layer, currentFrame, totalFrames) => fuzzyRipple(data, layer, currentFrame, totalFrames)
}

export const fuzzyRippleEffect = {
    name: 'fuzzy-ripples',
    generateData: generate,
    effect: effect,
    effectChance: 60,
    requiresLayer: true,
}

