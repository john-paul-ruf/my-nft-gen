import {getRandomIntExclusive, getRandomIntInclusive, randomId} from "../../logic/math/random.js";
import {getColorFromBucket, getFinalImageSize, getWorkingDirectory,} from "../../logic/core/gobals.js";
import fs from "fs";
import {findValue} from "../../logic/math/findValue.js";
import {findOneWayValue} from "../../logic/math/findOneWayValue.js";
import {LayerFactory} from "../../layer/LayerFactory.js";
import {Canvas2dFactory} from "../../draw/Canvas2dFactory.js";

const config = {
    gates: {lower: 5, upper: 11},
    numberOfSides: {lower: 4, upper: 8},
    thickness: 2,
    stroke: 0.5,
    accentRange: {bottom: {lower: 0, upper: 2}, top: {lower: 4, upper: 6}},
    blurRange: {bottom: {lower: 1, upper: 2}, top: {lower: 4, upper: 6}},
    accentTimes: {lower: 3, upper: 6},
    blurTimes: {lower: 3, upper: 6},
}

const finalImageSize = getFinalImageSize();

const computeInitialInfo = (num, width) => {
    const info = [];
    for (let i = 0; i <= num; i++) {
        info.push({
            radius: getRandomIntExclusive(0, width / 2),
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
        numberOfGates: getRandomIntInclusive(config.gates.lower, config.gates.upper),
        numberOfSides: getRandomIntInclusive(config.numberOfSides.lower, config.numberOfSides.upper),
        height: finalImageSize.height,
        width: finalImageSize.width,
        thickness: config.thickness,
        stroke: config.stroke,
        innerColor: getColorFromBucket(),
        center: {x: finalImageSize.width / 2, y: finalImageSize.height / 2},
        blurRange: {
            lower: getRandomIntInclusive(config.blurRange.bottom.lower, config.blurRange.bottom.upper),
            upper: getRandomIntInclusive(config.blurRange.top.lower, config.blurRange.top.upper)
        },
        blurTimes: getRandomIntInclusive(config.blurTimes.lower, config.blurTimes.upper),
        getInfo: () => {
            return `${gatesEffect.name}: ${data.numberOfGates} gates`
        }
    }

    data.gates = computeInitialInfo(data.numberOfGates, data.width);

    return data;
}


const draw = async (filename, withAccentGaston, context) => {
    for (let i = 0; i < context.data.numberOfGates; i++) {
        const loopCount = i + 1;
        const direction = loopCount % 2;
        const invert = direction <= 0;
        const theAngleGaston = findOneWayValue(0, 360 / context.data.numberOfSides, context.numberOfFrames, context.currentFrame, invert);
        const theAccentGaston = withAccentGaston ? findValue(context.data.gates[i].accentRange.lower, context.data.gates[i].accentRange.upper, context.data.gates[i].accentTimes, context.numberOfFrames, context.currentFrame) : 0;
        await context.canvas.drawPolygon2d(context.data.gates[i].radius, context.data.center, context.data.numberOfSides, theAngleGaston, context.data.thickness, context.data.innerColor, context.data.stroke + theAccentGaston, context.data.gates[i].color)
    }

    await context.canvas.toFile(filename);
}

async function compositeImage(context, layer) {
    await draw(context.drawing, false, context);
    await draw(context.underlayName, true, context);

    let tempLayer = await LayerFactory.getLayerFromFile(context.drawing);
    let underlayLayer = await LayerFactory.getLayerFromFile(context.underlayName);

    await underlayLayer.adjustLayerOpacity(0.5);

    await layer.compositeLayerOver(underlayLayer);
    await layer.compositeLayerOver(tempLayer);
}

const gates = async (data, layer, currentFrame, numberOfFrames) => {

    const context = {
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        theBlurGaston: Math.ceil(findValue(data.blurRange.lower, data.blurRange.upper, data.blurTimes, numberOfFrames, currentFrame)),
        drawing: getWorkingDirectory() + 'gate' + randomId() + '.png',
        underlayName: getWorkingDirectory() + 'gate-underlay' + randomId() + '.png',
        canvas: await Canvas2dFactory.getNewCanvas(data.width, data.height),
        data: data,
    }

    await compositeImage(context, layer);

    fs.unlinkSync(context.underlayName);
    fs.unlinkSync(context.drawing);
}

export const effect = {
    invoke: (data, layer, currentFrame, totalFrames) => gates(data, layer, currentFrame, totalFrames)
}

export const gatesEffect = {
    name: 'gates',
    generateData: generate,
    effect: effect,
    effectChance: 60,
    requiresLayer: true,
}

