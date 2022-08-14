import {randomId, randomNumber} from "../../logic/math/random.js";
import {getColorFromBucket, getFinalImageSize, getWorkingDirectory,} from "../../logic/core/gobals.js";
import fs from "fs";
import {findPointByAngleAndCircle} from "../../logic/math/drawingMath.js";
import {findOneWayValue} from "../../logic/math/findOneWayValue.js";
import {LayerFactory} from "../../layer/LayerFactory.js";
import {findValue} from "../../logic/math/findValue.js";
import {Canvas2dFactory} from "../../draw/Canvas2dFactory.js";

const config = {
    sparsityFactor: {lower: 0.5, upper: 1.5},
    gapFactor: {lower: 0.5, upper: 1.5},
    radiusFactor: {lower: 0.5, upper: 1.5},
    scaleFactor: 1.5,
    alphaRange: {bottom: {lower: 0.3, upper: 0.5}, top: {lower: 0.6, upper: 0.8}},
    numberOfScopesInALine: 150,
}

const finalImageSize = getFinalImageSize();

function getHexLine(sparsityFactor, info, i) {
    for (let a = 0; a < 360; a = a + sparsityFactor) {
        info.push({
            loopCount: i + 1,
            angle: a,
            alphaRange: {
                lower: randomNumber(config.alphaRange.bottom.lower, config.alphaRange.bottom.upper),
                upper: randomNumber(config.alphaRange.top.lower, config.alphaRange.top.upper)
            },
            color: getColorFromBucket(),
        });
    }
}

const computeInitialInfo = (sparsityFactor) => {
    const info = [];
    for (let i = 0; i < config.numberOfScopesInALine; i++) {
        getHexLine(sparsityFactor, info, i);
    }
    return info;
}

const generate = () => {
    const data = {
        height: finalImageSize.height,
        width: finalImageSize.width,
        sparsityFactor: randomNumber(config.sparsityFactor.lower, config.sparsityFactor.upper),
        gapFactor: randomNumber(config.gapFactor.lower, config.gapFactor.upper),
        radiusFactor: randomNumber(config.radiusFactor.lower, config.radiusFactor.upper),
        scaleFactor: config.scaleFactor,
        center: {x: finalImageSize.width / 2, y: finalImageSize.height / 2},
        getInfo: () => {
            return `${scopesEffect.name}: sparsityFactor: ${data.sparsityFactor.toFixed(3)}, gapFactor: ${data.gapFactor.toFixed(3)}, radiusFactor: ${data.radiusFactor.toFixed(3)}`
        }
    }

    data.scopes = computeInitialInfo(data.sparsityFactor);

    return data;
}

const drawHexLine = async (angle, index, color, alphaRange, context) => {
    const loopCount = index + 1;
    const direction = loopCount % 2;
    const invert = direction <= 0;

    const theRotateGaston = findOneWayValue(angle, angle + 720, context.numberOfFrames, context.currentFrame, invert);
    const theAlphaGaston = findValue(alphaRange.lower, alphaRange.upper, 5, context.numberOfFrames, context.currentFrame);

    const scaleBy = (context.data.scaleFactor * loopCount);
    const radius = context.data.radiusFactor * scaleBy;
    const gapRadius = ((finalImageSize.height * .05) + radius + (context.data.gapFactor * scaleBy) * loopCount)
    const pos = findPointByAngleAndCircle(context.data.center, angle, gapRadius)

    await context.canvas.drawFilledPolygon2d(radius, pos, 6, theRotateGaston, color, theAlphaGaston)
}

const draw = async (filename, context) => {
    for (let s = 0; s < context.data.scopes.length; s++) {
        await drawHexLine(context.data.scopes[s].angle, context.data.scopes[s].loopCount, context.data.scopes[s].color, context.data.scopes[s].alphaRange, context)
    }
    await context.canvas.toFile(filename);
}

const scopes = async (data, layer, currentFrame, numberOfFrames) => {
    const context = {
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        drawing: getWorkingDirectory() + 'scopes' + randomId() + '.png',
        canvas: await Canvas2dFactory.getNewCanvas(data.width, data.height),
        data: data
    }

    await draw(context.drawing, context);

    let tempLayer = await LayerFactory.getLayerFromFile(context.drawing);
    await layer.compositeLayerOver(tempLayer)

    fs.unlinkSync(context.drawing);
}

export const effect = {
    invoke: (data, layer, currentFrame, totalFrames) => scopes(data, layer, currentFrame, totalFrames)
}

export const scopesEffect = {
    name: 'scopes',
    generateData: generate,
    effect: effect,
    effectChance: 100,
    requiresLayer: true,
}

