import {getRandomIntInclusive, randomId} from "../../logic/math/random.js";
import {getColorFromBucket, IMAGEHEIGHT, IMAGEWIDTH, LAYERSTRATEGY, WORKINGDIRETORY} from "../../logic/core/gobals.js";
import {createCanvas} from "canvas";
import fs from "fs";
import {findPointByAngleAndCircle} from "../../logic/math/drawingMath.js";
import {findValue} from "../../logic/math/findValue.js";
import {LayerFactory} from "../../layer/LayerFactory.js";


const config = {
    stroke: 1,
    sparsityFactor: {lower: 1, upper: 3},
    speed: {lower: 1, upper: 5},
    counterClockwise: {lower: 0, upper: 1},
    unitLength: {lower: 5, upper: 15},
    radiusConstant: 150,
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
        color3: getColorFromBucket(),
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

    const draw = async (filename, accentBoost) => {
        const canvas = createCanvas(data.width, data.height)
        const context = canvas.getContext('2d');
        let twistCount = 2;
        let n1 = data.unitLength, n2 = data.unitLength;
        let nextTerm = n1 + n2;

        const drawRay = (stroke, angle, radius, radiusNext, twist) => {
            const start = findPointByAngleAndCircle(data.center, angle, radius + config.radiusConstant)
            const end = findPointByAngleAndCircle(data.center, angle + (twist * data.sparsityFactor), radiusNext + config.radiusConstant);

            context.beginPath();

            const grad = context.createLinearGradient(start.x, start.y, end.x, end.y);
            grad.addColorStop(0, data.color1);
            grad.addColorStop(0.5, data.color2);
            grad.addColorStop(1, data.color3);

            context.lineWidth = stroke;
            context.strokeStyle = grad;

            context.moveTo(start.x, start.y);
            context.lineTo(end.x, end.y);

            context.stroke();
            context.closePath();
        }

        while (nextTerm <= data.width) {

            for (let i = 0; i < 360; i = i + data.sparsityFactor) {
                drawRay(data.stroke + accentBoost, i, n2, nextTerm, twistCount)
                drawRay(data.stroke + accentBoost, i, n2, nextTerm, -twistCount)
            }

            //assignment for next loop
            twistCount++;
            n1 = n2;
            n2 = nextTerm;
            nextTerm = n1 + n2;
        }

        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filename, buffer);
    }

    const theAccentGaston = findValue(0, 20, 1, numberOfFrames, currentFrame);
    const theBlurGaston = Math.ceil(findValue(1, 3, 1, numberOfFrames, currentFrame));

    await draw(imgName, 0);
    await draw(underlayName, theAccentGaston);

    let tempLayer = await LayerFactory.getLayerFromFile(LAYERSTRATEGY, imgName);
    let underlayLayer = await LayerFactory.getLayerFromFile(LAYERSTRATEGY, underlayName);

    await underlayLayer.blur(theBlurGaston);
    await underlayLayer.adjustLayerOpacity(0.5);

    const direction = data.counterClockwise > 0 ? -1 : 1
    await underlayLayer.rotate((((data.sparsityFactor * data.speed) / numberOfFrames) * currentFrame) * direction);
    await tempLayer.rotate((((data.sparsityFactor * data.speed) / numberOfFrames) * currentFrame) * direction);

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

