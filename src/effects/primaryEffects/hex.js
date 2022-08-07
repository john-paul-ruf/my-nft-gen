import {getRandomIntInclusive, randomId} from "../../logic/math/random.js";
import {getColorFromBucket, IMAGEHEIGHT, IMAGEWIDTH, LAYERSTRATEGY, WORKINGDIRETORY} from "../../logic/core/gobals.js";
import {createCanvas} from "canvas";
import fs from "fs";
import {findPointByAngleAndCircle} from "../../logic/math/drawingMath.js";
import {findValue} from "../../logic/math/findValue.js";
import {drawPolygon2d} from "../../draw/drawPolygon2d.js";
import {findOneWayValue} from "../../logic/math/findOneWayValue.js";
import {LayerFactory} from "../../layer/LayerFactory.js";


const config = {
    sparsityFactor: {lower: 24, upper: 24},
    gapFactor: {lower: 15, upper: 25},
    radiusFactor: {lower: 30, upper: 55},
    accentRange: {bottom: {lower: 0, upper: 2}, top: {lower: 4, upper: 6}},
    blurRange: {bottom: {lower: 1, upper: 2}, top: {lower: 4, upper: 6}},
    accentTimes: {lower: 1, upper: 5},
    blurTimes: {lower: 1, upper: 5},
    stroke: 3,
    thickness: 3,
    scaleFactor: 1.05,
}

const generate = () => {
    const data = {
        height: IMAGEHEIGHT,
        width: IMAGEWIDTH,
        stroke: config.stroke,
        thickness: config.thickness,
        innerColor: getColorFromBucket(),
        scaleFactor: config.scaleFactor,
        sparsityFactor: getRandomIntInclusive(config.sparsityFactor.lower, config.sparsityFactor.upper),
        gapFactor: getRandomIntInclusive(config.gapFactor.lower, config.gapFactor.upper),
        radiusFactor: getRandomIntInclusive(config.radiusFactor.lower, config.radiusFactor.upper),
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
        color: getColorFromBucket(),
        center: {x: IMAGEWIDTH / 2, y: IMAGEHEIGHT / 2},
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
        const canvas = createCanvas(data.width, data.height)
        const context = canvas.getContext('2d');

        const drawHexLine = (angle, index) => {
            const loopCount = index + 1;
            const direction = loopCount % 2;
            const invert = direction <= 0;

            const theAngleGaston = findOneWayValue(angle, angle + data.sparsityFactor, numberOfFrames, currentFrame, invert);
            const theRotateGaston = findOneWayValue(theAngleGaston, theAngleGaston + 60, numberOfFrames, currentFrame, invert)

            const scaleBy = (data.scaleFactor * loopCount);
            const radius = data.radiusFactor * scaleBy;
            const gapRadius = ((IMAGEHEIGHT * .05) + radius + (data.gapFactor * scaleBy) * loopCount)
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
    
    const theAccentGaston = findValue(data.accentRange.lower, data.accentRange.upper, data.accentTimes, numberOfFrames, currentFrame);
    const theBlurGaston = Math.ceil(findValue(data.blurRange.lower, data.blurRange.upper, data.blurTimes, numberOfFrames, currentFrame));

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

