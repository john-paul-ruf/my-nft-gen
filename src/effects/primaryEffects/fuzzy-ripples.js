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
    stroke: 3,
    thickness: 3,
    largeRadius: {lower: IMAGEHEIGHT * 0.35, upper: IMAGEHEIGHT * 0.45},
    smallRadius: {lower: IMAGEHEIGHT * 0.15, upper: IMAGEHEIGHT * 0.25},
    largeNumberOfRings: {lower: 5, upper: 10},
    smallNumberOfRings: {lower: 3, upper: 7},
    ripple: {lower: IMAGEHEIGHT / 20, upper: IMAGEHEIGHT / 30},
    times: {lower: 1, upper: 2},
    smallerRingsGroupRadius: {lower: IMAGEHEIGHT * 0.2, upper: IMAGEHEIGHT * 0.3},
    accentRange: {bottom: {lower: 0, upper: 2}, top: {lower: 4, upper: 6}},
    blurRange: {bottom: {lower: 1, upper: 2}, top: {lower: 4, upper: 6}},
    accentTimes: {lower: 1, upper: 5},
    blurTimes: {lower: 1, upper: 5},
}

const generate = () => {
    const data = {
        height: IMAGEHEIGHT,
        width: IMAGEWIDTH,
        stroke: config.stroke,
        thickness: config.thickness,
        innerColor: getColorFromBucket(),
        largeRadius: getRandomIntInclusive(config.largeRadius.lower, config.largeRadius.upper),
        smallRadius: getRandomIntInclusive(config.smallRadius.lower, config.smallRadius.upper),
        largeNumberOfRings: getRandomIntInclusive(config.largeNumberOfRings.lower, config.largeNumberOfRings.upper),
        smallNumberOfRings: getRandomIntInclusive(config.smallNumberOfRings.lower, config.smallNumberOfRings.upper),
        ripple: getRandomIntInclusive(config.ripple.lower, config.ripple.upper),
        smallerRingsGroupRadius: getRandomIntInclusive(config.smallerRingsGroupRadius.lower, config.smallerRingsGroupRadius.upper),
        times: getRandomIntInclusive(config.times.lower, config.times.upper),
        largeColor: getColorFromBucket(),
        smallColor: getColorFromBucket(),
        center: {x: IMAGEWIDTH / 2, y: IMAGEHEIGHT / 2},
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
        getInfo: () => {
            return `${fuzzyRippleEffect.name}: large rings: ${data.largeNumberOfRings}, small rings x6: ${data.smallNumberOfRings}, ripple: ${data.ripple}`
        }
    }

    return data;
}

const fuzzyRipple = async (data, layer, currentFrame, numberOfFrames) => {
    const imgName = WORKINGDIRETORY + 'fuzzy-ripples' + randomId() + '.png';
    const underlayName = WORKINGDIRETORY + 'fuzzy-ripples-underlay' + randomId() + '.png';

    const draw = async (filename, accentBoost) => {

        const canvas = await Canvas2dFactory.getNewCanvas(CANVASTRATEGY, data.width, data.height);

        const drawRing = async (pos, radius, innerStroke, innerColor, outerStroke, outerColor) => {
            const theGaston = findValue(radius, radius + data.ripple, data.times, numberOfFrames, currentFrame);
            await canvas.drawRing2d(pos, theGaston, innerStroke, innerColor, outerStroke + accentBoost, outerColor)
        }

        const drawRings = async (pos, color, radius, numberOfRings) => {
            for (let i = 0; i < numberOfRings; i++) {
                await drawRing(pos, radius / numberOfRings * i, data.thickness, data.innerColor, data.stroke, color);
            }
        }

        await drawRings(findPointByAngleAndCircle(data.center, 30, data.smallerRingsGroupRadius), data.smallColor, data.smallRadius, data.smallNumberOfRings);
        await drawRings(findPointByAngleAndCircle(data.center, 90, data.smallerRingsGroupRadius), data.smallColor, data.smallRadius, data.smallNumberOfRings);
        await drawRings(findPointByAngleAndCircle(data.center, 150, data.smallerRingsGroupRadius), data.smallColor, data.smallRadius, data.smallNumberOfRings);
        await drawRings(findPointByAngleAndCircle(data.center, 210, data.smallerRingsGroupRadius), data.smallColor, data.smallRadius, data.smallNumberOfRings);
        await drawRings(findPointByAngleAndCircle(data.center, 270, data.smallerRingsGroupRadius), data.smallColor, data.smallRadius, data.smallNumberOfRings);
        await drawRings(findPointByAngleAndCircle(data.center, 330, data.smallerRingsGroupRadius), data.smallColor, data.smallRadius, data.smallNumberOfRings);

        await drawRings(data.center, data.largeColor, data.largeRadius, data.largeNumberOfRings);

        await canvas.drawPolygon2d(data.smallerRingsGroupRadius, data.center, 6, 30, data.thickness + accentBoost, data.innerColor, data.stroke, data.smallColor)

        await canvas.toFile(filename);
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
    invoke: (data, layer, currentFrame, totalFrames) => fuzzyRipple(data, layer, currentFrame, totalFrames)
}

export const fuzzyRippleEffect = {
    name: 'fuzzy-ripples',
    generateData: generate,
    effect: effect,
    effectChance: 60,
    requiresLayer: true,
}

