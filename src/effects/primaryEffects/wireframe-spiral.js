import {getRandomIntInclusive, randomId} from "../../logic/math/random.js";
import {
    CANVASTRATEGY,
    getColorFromBucket,
    IMAGEHEIGHT,
    IMAGEWIDTH,
    LAYERSTRATEGY,
    WORKINGDIRETORY
} from "../../logic/core/gobals.js";
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
    const data = {
        height: IMAGEHEIGHT * 1.3,
        width: IMAGEWIDTH * 1.3,
        stroke: config.stroke,
        unitLength: getRandomIntInclusive(config.unitLength.lower, config.unitLength.upper),
        sparsityFactor: getRandomIntInclusive(config.sparsityFactor.lower, config.sparsityFactor.upper),
        color1: getColorFromBucket(),
        color2: getColorFromBucket(),
        center: {x: IMAGEWIDTH * 1.3 / 2, y: IMAGEHEIGHT * 1.3 / 2},
        speed: getRandomIntInclusive(config.speed.lower, config.speed.upper),
        counterClockwise: getRandomIntInclusive(config.counterClockwise.lower, config.counterClockwise.upper),
        getInfo: () => {
            return `${wireframeSpiralEffect.name}: sparsity: ${data.sparsityFactor.toFixed(3)}, unit: ${data.unitLength}, speed: ${data.speed}, direction: ${data.counterClockwise > 0 ? 'clockwise' : 'counter'}`
        }
    }

    return data;
}

const wireframeSpiral = async (data, layer, currentFrame, numberOfFrames) => {
    const imgName = WORKINGDIRETORY + 'wireframe-spiral' + randomId() + '.png';
    const underlayName = WORKINGDIRETORY + 'wireframe-spiral-underlay' + randomId() + '.png';
    const direction = data.counterClockwise > 0 ? -1 : 1

    const draw = async (filename, accentBoost) => {

        const canvas = await Canvas2dFactory.getNewCanvas(CANVASTRATEGY, data.width, data.height);

        let twistCount = 2;
        let n1 = data.unitLength, n2 = data.unitLength;
        let nextTerm = n1 + n2;

        const drawRay = async (stroke, angle, radius, radiusNext, twist) => {

            angle = angle + (((data.sparsityFactor * data.speed) / numberOfFrames) * currentFrame) * direction;

            const start = findPointByAngleAndCircle(data.center, angle, radius + config.radiusConstant)
            const end = findPointByAngleAndCircle(data.center, angle + (twist * data.sparsityFactor), radiusNext + config.radiusConstant);

            await canvas.drawGradientLine2d(start, end, stroke, data.color1, data.color2);
        }

        while (nextTerm <= data.width) {

            for (let i = 0; i < 360; i = i + data.sparsityFactor) {
                await drawRay(data.stroke + accentBoost, i, n2, nextTerm, twistCount)
                await drawRay(data.stroke + accentBoost, i, n2, nextTerm, -twistCount)
            }

            //assignment for next loop
            twistCount++;
            n1 = n2;
            n2 = nextTerm;
            nextTerm = n1 + n2;
        }

        await canvas.toFile(filename)
    }

    const theAccentGaston = findValue(0, 20, 1, numberOfFrames, currentFrame);
    const theBlurGaston = Math.ceil(findValue(1, 3, 1, numberOfFrames, currentFrame));

    await draw(imgName, 0);
    await draw(underlayName, theAccentGaston);

    let tempLayer = await LayerFactory.getLayerFromFile(LAYERSTRATEGY, imgName);
    let underlayLayer = await LayerFactory.getLayerFromFile(LAYERSTRATEGY, underlayName);

    await underlayLayer.blur(theBlurGaston);
    await underlayLayer.adjustLayerOpacity(0.5);
    await layer.compositeLayerOver(underlayLayer);

    await layer.compositeLayerOver(tempLayer);

    fs.unlinkSync(underlayName);
    fs.unlinkSync(imgName);

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

