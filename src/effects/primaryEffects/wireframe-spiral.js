import {getRandomIntInclusive, randomId} from "../../logic/math/random.js";
import {getColorFromBucket, getFinalImageSize, getWorkingDirectory,} from "../../logic/core/gobals.js";
import fs from "fs";
import {findPointByAngleAndCircle} from "../../logic/math/drawingMath.js";
import {findValue} from "../../logic/math/findValue.js";
import {LayerFactory} from "../../layer/LayerFactory.js";
import {Canvas2dFactory} from "../../draw/Canvas2dFactory.js";


const config = {
    stroke: 0.5,
    sparsityFactor: {lower: 1, upper: 3},
    speed: {lower: 2, upper: 5},
    counterClockwise: {lower: 0, upper: 1},
    unitLength: {lower: 1, upper: 5},
    radiusConstant: 75,
}

const generate = () => {
    const finalImageSize = getFinalImageSize();

    const data = {
        height: finalImageSize.height * 1.3,
        width: finalImageSize.width * 1.3,
        stroke: config.stroke,
        unitLength: getRandomIntInclusive(config.unitLength.lower, config.unitLength.upper),
        sparsityFactor: getRandomIntInclusive(config.sparsityFactor.lower, config.sparsityFactor.upper),
        color1: getColorFromBucket(),
        color2: getColorFromBucket(),
        center: {x: finalImageSize.width * 1.3 / 2, y: finalImageSize.height * 1.3 / 2},
        speed: getRandomIntInclusive(config.speed.lower, config.speed.upper),
        counterClockwise: getRandomIntInclusive(config.counterClockwise.lower, config.counterClockwise.upper),
        getInfo: () => {
            return `${wireframeSpiralEffect.name}: sparsity: ${data.sparsityFactor.toFixed(3)}, unit: ${data.unitLength}, speed: ${data.speed}, direction: ${data.counterClockwise > 0 ? 'clockwise' : 'counter'}`
        }
    }

    return data;
}


//n2, nextTerm, -twistCount
const drawRay = async (stroke, angle, loopControl, context) => {
    angle = angle + (((context.data.sparsityFactor * context.data.speed) / context.numberOfFrames) * context.currentFrame) * context.direction;

    const start = findPointByAngleAndCircle(context.data.center, angle, loopControl.n2 + config.radiusConstant)
    const end = findPointByAngleAndCircle(context.data.center, angle + (loopControl.twistCount * context.data.sparsityFactor), loopControl.nextTerm + config.radiusConstant);

    await context.canvas.drawGradientLine2d(start, end, stroke, context.data.color1, context.data.color2);
}

const draw = async (filename, accentBoost, context) => {
    const loopControl = {
        twistCount: 2,
        n1: context.data.unitLength,
        n2: context.data.unitLength,
        nextTerm: context.data.unitLength + context.data.unitLength
    }

    while (loopControl.nextTerm <= context.data.width) {

        for (let i = 0; i < 360; i = i + context.data.sparsityFactor) {
            await drawRay(context.data.stroke + accentBoost, i, loopControl, context)
            await drawRay(context.data.stroke + accentBoost, i, loopControl, context)
        }

        //assignment for next loop
        loopControl.twistCount++;
        loopControl.n1 = loopControl.n2;
        loopControl.n2 = loopControl.nextTerm;
        loopControl.nextTerm = loopControl.n1 + loopControl.n2;
    }

    await context.canvas.toFile(filename)
}

async function compositeImage(context, layer) {
    await draw(context.drawing, 0, context);
    await draw(context.underlayName, context.theAccentGaston, context);

    let tempLayer = await LayerFactory.getLayerFromFile();
    let underlayLayer = await LayerFactory.getLayerFromFile();

    await underlayLayer.blur(context.theBlurGaston);
    await underlayLayer.adjustLayerOpacity(0.5);

    await layer.compositeLayerOver(underlayLayer);
    await layer.compositeLayerOver(tempLayer);
}

const wireframeSpiral = async (data, layer, currentFrame, numberOfFrames) => {

    const context = {
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        theAccentGaston: findValue(0, 20, 1, numberOfFrames, currentFrame),
        drawing: getWorkingDirectory() + 'wireframe-spiral' + randomId() + '.png',
        underlayName: getWorkingDirectory() + 'wireframe-spiral-underlay' + randomId() + '.png',
        canvas: await Canvas2dFactory.getNewCanvas(data.width, data.height),
        data: data,
    }

    await compositeImage(context, layer);

    fs.unlinkSync(context.underlayName);
    fs.unlinkSync(context.drawing);
}

export const effect = {
    invoke: (data, layer, currentFrame, totalFrames) => wireframeSpiral(data, layer, currentFrame, totalFrames)
}

export const wireframeSpiralEffect = {
    name: 'wireframe-spiral',
    generateData: generate,
    effect: effect,
    effectChance: 30,
    requiresLayer: true,
}

