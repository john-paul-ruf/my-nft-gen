import {getRandomIntInclusive, randomId, randomNumber} from "../../logic/math/random.js";
import {getColorFromBucket, getFinalImageSize, getWorkingDirectory,} from "../../logic/core/gobals.js";
import fs from "fs";
import {findValue} from "../../logic/math/findValue.js";
import {Canvas2dFactory} from "../../draw/Canvas2dFactory.js";
import {LayerFactory} from "../../layer/LayerFactory.js";


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
    blurRange: {bottom: {lower: 1, upper: 2}, top: {lower: 4, upper: 6}},
}

const generate = () => {

    const finalImageSize = getFinalImageSize();

    const data = {
        height: finalImageSize.height,
        width: finalImageSize.width,
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
        blurRange: {
            lower: getRandomIntInclusive(config.blurRange.bottom.lower, config.blurRange.bottom.upper),
            upper: getRandomIntInclusive(config.blurRange.top.lower, config.blurRange.top.upper)
        },
        center: {x: finalImageSize.width / 2, y: finalImageSize.height / 2},
        getInfo: () => {
            return `${viewportEffect.name}: amp length:${data.ampLength}, sparsity:${data.sparsityFactor.toFixed(3)}`
        }
    }

    return data;
}

const draw = async (imgName, accentBoost, context) => {
    const theAmpGaston = findValue(context.data.ampRadius, context.data.ampRadius + context.data.ampLength + context.data.amplitude, context.data.times, context.numberOfFrames, context.currentFrame);
    await context.canvas.drawRays2d(context.data.center, context.data.ampRadius, theAmpGaston, context.data.sparsityFactor, context.data.ampThickness, context.data.ampInnerColor, context.data.ampStroke + accentBoost, context.data.ampOuterColor)

    const thePolyGaston = findValue(context.data.radius, context.data.radius + context.data.amplitude, context.data.times, context.numberOfFrames, context.currentFrame);
    await context.canvas.drawPolygon2d(thePolyGaston, context.data.center, 3, 210, context.data.thickness, context.data.innerColor, context.data.stroke + accentBoost, context.data.color)

    await context.canvas.toFile(imgName);
}

async function compositeImage(context, layer) {
    await draw(context.drawing, 0, context);
    await draw(context.underlayName, context.theAccentGaston, context);

    let tempLayer = await LayerFactory.getLayerFromFile(context.drawing);
    let underlayLayer = await LayerFactory.getLayerFromFile(context.underlayName);

    await underlayLayer.blur(context.theBlurGaston);
    await underlayLayer.adjustLayerOpacity(0.5);

    await layer.compositeLayerOver(underlayLayer);
    await layer.compositeLayerOver(tempLayer);
}

const viewport = async (data, layer, currentFrame, numberOfFrames) => {

    const context = {
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        theAccentGaston: findValue(0, 20, 1, numberOfFrames, currentFrame),
        drawing: getWorkingDirectory() + 'viewport' + randomId() + '.png',
        underlayName: getWorkingDirectory() + 'viewport-underlay' + randomId() + '.png',
        canvas: await Canvas2dFactory.getNewCanvas(data.width, data.height),
        data: data,
    }

    await compositeImage(context, layer);

    fs.unlinkSync(context.drawing);
}

export const effect = {
    invoke: (data, layer, currentFrame, totalFrames) => viewport(data, layer, currentFrame, totalFrames)
}

export const viewportEffect = {
    name: 'viewport',
    generateData: generate,
    effect: effect,
    effectChance: 100,
    requiresLayer: true,
}

