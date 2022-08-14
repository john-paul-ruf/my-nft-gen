import {getRandomIntExclusive, getRandomIntInclusive, randomId} from "../../logic/math/random.js";
import {getColorFromBucket, getFinalImageSize, getWorkingDirectory,} from "../../logic/core/gobals.js";
import fs from "fs";
import {findValue} from "../../logic/math/findValue.js";
import {LayerFactory} from "../../layer/LayerFactory.js";
import {Canvas2dFactory} from "../../draw/Canvas2dFactory.js";

const finalImageSize = getFinalImageSize();

const config = {
    circles: {lower: 10, upper: 20},
    stroke: 0.5,
    thickness: 0.25,
    scaleFactor: 1.02,
    accentRange: {bottom: {lower: 0, upper: 2}, top: {lower: 4, upper: 6}},
    blurRange: {bottom: {lower: 1, upper: 2}, top: {lower: 4, upper: 6}},
    accentTimes: {lower: 3, upper: 6},
    blurTimes: {lower: 3, upper: 6},
}

const computeInitialInfo = (num, width) => {
    const info = [];
    for (let i = 0; i <= num; i++) {
        info.push({
            radius: getRandomIntExclusive(0, width * 0.75),
            color: getColorFromBucket(),
            accentRange: {
                lower: getRandomIntInclusive(config.accentRange.bottom.lower, config.accentRange.bottom.upper),
                upper: getRandomIntInclusive(config.accentRange.top.lower, config.accentRange.top.upper)
            },
            accentTimes: getRandomIntInclusive(config.accentTimes.lower, config.accentTimes.upper),
        });
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
            return `${fuzzBandsEffect.name}: ${data.numberOfCircles} fuzzy bands`
        }
    }

    data.circles = computeInitialInfo(data.numberOfCircles, data.width);

    return data;
}

const draw = async (filename, withAccentGaston, context) => {
    for (let i = 0; i < context.data.numberOfCircles; i++) {
        const loopCount = i + 1;
        const scaleBy = (context.data.scaleFactor * loopCount);
        const theAccentGaston = withAccentGaston ? findValue(context.data.circles[i].accentRange.lower, context.data.circles[i].accentRange.upper, context.data.circles[i].accentTimes, context.numberOfFrames, context.currentFrame) : 0;
        await context.canvas.drawRing2d(context.data.center, context.data.circles[i].radius, context.data.thickness * scaleBy, context.data.innerColor, (context.data.stroke + theAccentGaston) * scaleBy, context.data.circles[i].color)
    }

    await context.canvas.toFile(filename);
}

async function compositeImage(context, layer) {
    await draw(context.drawing, false, context);
    await draw(context.underlayName, true, context);

    let fuzzLayer = await LayerFactory.getLayerFromFile(context.drawing);
    let ringLayer = await LayerFactory.getLayerFromFile(context.underlayName);

    await fuzzLayer.blur(context.theBlurGaston);
    await fuzzLayer.adjustLayerOpacity(0.5);

    await layer.compositeLayerOver(fuzzLayer);
    await layer.compositeLayerOver(ringLayer);
}

const fuzzBands = async (data, layer, currentFrame, numberOfFrames) => {

    const context = {
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        theBlurGaston: Math.ceil(findValue(data.blurRange.lower, data.blurRange.upper, data.blurTimes, numberOfFrames, currentFrame)),
        drawing: getWorkingDirectory() + 'ring' + randomId() + '.png',
        underlayName: getWorkingDirectory() + 'ring-underlay' + randomId() + '.png',
        canvas: await Canvas2dFactory.getNewCanvas(data.width, data.height),
        data: data,
    }

    await compositeImage(context, layer);

    fs.unlinkSync(context.drawing);
    fs.unlinkSync(context.underlayName);

}

export const effect = {
    invoke: (data, layer, currentFrame, totalFrames) => fuzzBands(data, layer, currentFrame, totalFrames)
}

export const fuzzBandsEffect = {
    name: 'fuzz-bands',
    generateData: generate,
    effect: effect,
    effectChance: 70,
    requiresLayer: true,
}

