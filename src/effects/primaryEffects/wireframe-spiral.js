import {getRandomIntInclusive, randomId} from "../../logic/random.js";
import {getColorFromBucket, IMAGESIZE} from "../../logic/gobals.js";
import {createCanvas} from "canvas";
import Jimp from "jimp";
import fs from "fs";
import {findPointByAngleAndCircle} from "../../logic/drawingMath.js";
import {findValue} from "../../logic/findValue.js";


const config = {
    size: IMAGESIZE * 2,
    stroke: 2,
    sparsityFactor: {lower: 5, upper: 15},
    speed: {lower: 1, upper: 5},
    counterClockwise: {lower: 0, upper: 1},
    unitLength: {lower: 5, upper: 25},
}

const generate = () => {
    const data = {
        height: config.size,
        width: config.size,
        stroke: config.stroke,
        unitLength: getRandomIntInclusive(config.unitLength.lower, config.unitLength.upper),
        sparsityFactor: getRandomIntInclusive(config.sparsityFactor.lower, config.sparsityFactor.upper),
        color1: getColorFromBucket(),
        color2: getColorFromBucket(),
        color3: getColorFromBucket(),
        center: {x: config.size / 2, y: config.size / 2},
        speed: getRandomIntInclusive(config.speed.lower, config.speed.upper),
        counterClockwise: getRandomIntInclusive(config.counterClockwise.lower, config.counterClockwise.upper),
        getInfo: () => {
            return `${wireframeSpiralEffect.name}: sparsity: ${data.sparsityFactor.toFixed(3)}, unit: ${data.unitLength}, speed: ${data.speed}, direction: ${data.counterClockwise > 0 ? 'clockwise' : 'counter'}`
        }
    }

    return data;
}

const wireframeSpiral = async (data, img, currentFrame, numberOfFrames, card) => {
    const imgName = randomId() + '-wireframe-spiral.png';
    const underlayName = randomId() + '-wireframe-spiral-underlay.png';

    const draw = async (filename, accentBoost) => {
        const canvas = createCanvas(config.size, config.size)
        const context = canvas.getContext('2d');
        let twistCount = 2;
        let n1 = 250, n2 = 250, nextTerm;
        nextTerm = n1 + n2;

        const drawRay = (stroke, angle, radius, radiusNext, twist) => {
            const start = findPointByAngleAndCircle(data.center, angle, radius)
            const end = findPointByAngleAndCircle(data.center, angle + (twist * data.sparsityFactor), radiusNext);

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

        while (nextTerm <= config.size) {

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

    await draw(imgName, 0);


    const theAccentGaston = findValue(0, 20, 1, numberOfFrames, currentFrame);
    await draw(underlayName, theAccentGaston);

    let underlayImg = await Jimp.read(underlayName);

    const theBlurGaston = Math.ceil(findValue(1, 3, 1, numberOfFrames, currentFrame));
    await underlayImg.blur(theBlurGaston);

    await underlayImg.opacity(0.5);

    let tmpImg = await Jimp.read(imgName);

    const direction = data.counterClockwise > 0 ? -1 : 1
    await tmpImg.rotate((((data.sparsityFactor * data.speed) / numberOfFrames) * currentFrame) * direction, false);
    await underlayImg.rotate((((data.sparsityFactor * data.speed) / numberOfFrames) * currentFrame) * direction, false);

    await img.composite(underlayImg, -IMAGESIZE / 2, -IMAGESIZE / 2, {
        mode: Jimp.BLEND_SOURCE_OVER,
    });

    await img.composite(tmpImg, -IMAGESIZE / 2, -IMAGESIZE / 2, {
        mode: Jimp.BLEND_SOURCE_OVER,
    });

    fs.unlinkSync(underlayName);
    fs.unlinkSync(imgName);

}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames, card) => wireframeSpiral(data, img, currentFrame, totalFrames, card)
}

export const wireframeSpiralEffect = {
    name: 'wireframe-spiral',
    generateData: generate,
    effect: effect,
    effectChance: 50,
    requiresLayer: true,
    rotatesImg: false,
    allowsRotation: false,
    rotationTotalAngle: 0,
}

