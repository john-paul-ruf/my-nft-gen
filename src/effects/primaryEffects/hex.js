import {getRandomIntInclusive, randomId} from "../../logic/random.js";
import {getColorFromBucket, IMAGESIZE, LAYERSTRATEGY, WORKINGDIRETORY} from "../../logic/gobals.js";
import {createCanvas} from "canvas";
import fs from "fs";
import {findPointByAngleAndCircle} from "../../logic/drawingMath.js";
import {findValue} from "../../logic/findValue.js";
import {drawPolygon2d} from "../../draw/drawPolygon2d.js";
import {findOneWayValue} from "../../logic/findOneWayValue.js";
import {LayerFactory} from "../../layer/LayerFactory.js";


const config = {
    size: IMAGESIZE,
    sparsityFactor: {lower: 24, upper: 24},
    gapFactor: {lower: 15, upper: 25},
    radiusFactor: {lower: 30, upper: 55},
    stroke: 3,
    thickness: 3,
    scaleFactor: 1.05,
}

const generate = () => {
    const data = {
        height: config.size,
        width: config.size,
        stroke: config.stroke,
        thickness: config.thickness,
        innerColor: getColorFromBucket(),
        scaleFactor: config.scaleFactor,
        sparsityFactor: getRandomIntInclusive(config.sparsityFactor.lower, config.sparsityFactor.upper),
        gapFactor: getRandomIntInclusive(config.gapFactor.lower, config.gapFactor.upper),
        radiusFactor: getRandomIntInclusive(config.radiusFactor.lower, config.radiusFactor.upper),
        color: getColorFromBucket(),
        center: {x: config.size / 2, y: config.size / 2},
        getInfo: () => {
            return `${hexEffect.name}: sparsityFactor: ${data.sparsityFactor}, gapFactor: ${data.gapFactor}, radiusFactor: ${data.radiusFactor}`
        }
    }

    return data;
}

const hex = async (data, layer, currentFrame, numberOfFrames) => {
    const imgName = WORKINGDIRETORY + 'hex' + randomId() + '.png';
    const underlayName = WORKINGDIRETORY + 'hex-under' + randomId() + '.png';

    const draw = async (filename, accentBoost) => {
        const canvas = createCanvas(config.size, config.size)
        const context = canvas.getContext('2d');

        const drawHexLine = (angle, index) => {
            const loopCount = index + 1;
            const direction = loopCount % 2;
            const invert = direction <= 0;

            const theAngleGaston = findOneWayValue(angle, angle + data.sparsityFactor, numberOfFrames, currentFrame, invert);
            const theRotateGaston = findOneWayValue(theAngleGaston, theAngleGaston + 60, numberOfFrames, currentFrame, invert)

            const scaleBy = (data.scaleFactor * loopCount);
            const radius = data.radiusFactor * scaleBy;
            const gapRadius = ((IMAGESIZE * .05) + radius + (data.gapFactor * scaleBy) * loopCount)
            const pos = findPointByAngleAndCircle(data.center, theAngleGaston, gapRadius)

            drawPolygon2d(context, radius, pos, 6, theRotateGaston, data.thickness * scaleBy, data.innerColor, (data.stroke + accentBoost) * scaleBy, data.color)
        }

        for (let i = 0; i < 20; i++) {
            for (let a = 0; a < 360; a = a + data.sparsityFactor) {
                drawHexLine(a, i)
            }
        }

        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filename, buffer);
    }
    const theAccentGaston = findValue(0, 3, 1, numberOfFrames, currentFrame);
    const theBlurGaston = Math.ceil(findValue(1, 3, 1, numberOfFrames, currentFrame));

    await draw(imgName, 0);
    await draw(underlayName, theAccentGaston);

    let tempLayer = await LayerFactory.getLayerFromFile(LAYERSTRATEGY, imgName);
    let underlayLayer = await LayerFactory.getLayerFromFile(LAYERSTRATEGY, underlayName);

    await underlayLayer.blur(theBlurGaston);
    await underlayLayer.adjustLayerOpacity(0.5);

    await layer.compositeLayerOver(underlayLayer)
    await layer.compositeLayerOver(tempLayer)

    fs.unlinkSync(imgName);
    fs.unlinkSync(underlayName);
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

