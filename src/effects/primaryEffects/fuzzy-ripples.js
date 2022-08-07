import {getRandomIntInclusive, randomId} from "../../logic/math/random.js";
import {getColorFromBucket, IMAGEHEIGHT, IMAGEWIDTH, LAYERSTRATEGY, WORKINGDIRETORY} from "../../logic/core/gobals.js";
import {createCanvas} from "canvas";
import fs from "fs";
import {findPointByAngleAndCircle} from "../../logic/math/drawingMath.js";
import {findValue} from "../../logic/math/findValue.js";
import {drawRing2d} from "../../draw/drawRing2d.js";
import {drawPolygon2d} from "../../draw/drawPolygon2d.js";
import {LayerFactory} from "../../layer/LayerFactory.js";


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
        const canvas = createCanvas(data.width, data.height)
        const context = canvas.getContext('2d');

        const drawRing = (pos, radius, innerStroke, innerColor, outerStroke, outerColor) => {
            const theGaston = findValue(radius, radius + data.ripple, data.times, numberOfFrames, currentFrame);
            drawRing2d(context, pos, theGaston, innerStroke, innerColor, outerStroke + accentBoost, outerColor)
        }

        const drawRings = (pos, color, radius, numberOfRings) => {
            for (let i = 0; i < numberOfRings; i++) {
                drawRing(pos, radius / numberOfRings * i, data.thickness, data.innerColor, data.stroke, color);
            }
        }

        drawRings(findPointByAngleAndCircle(data.center, 30, data.smallerRingsGroupRadius), data.smallColor, data.smallRadius, data.smallNumberOfRings);
        drawRings(findPointByAngleAndCircle(data.center, 90, data.smallerRingsGroupRadius), data.smallColor, data.smallRadius, data.smallNumberOfRings);
        drawRings(findPointByAngleAndCircle(data.center, 150, data.smallerRingsGroupRadius), data.smallColor, data.smallRadius, data.smallNumberOfRings);
        drawRings(findPointByAngleAndCircle(data.center, 210, data.smallerRingsGroupRadius), data.smallColor, data.smallRadius, data.smallNumberOfRings);
        drawRings(findPointByAngleAndCircle(data.center, 270, data.smallerRingsGroupRadius), data.smallColor, data.smallRadius, data.smallNumberOfRings);
        drawRings(findPointByAngleAndCircle(data.center, 330, data.smallerRingsGroupRadius), data.smallColor, data.smallRadius, data.smallNumberOfRings);

        drawRings(data.center, data.largeColor, data.largeRadius, data.largeNumberOfRings);

        drawPolygon2d(context, data.smallerRingsGroupRadius, data.center, 6, 30, data.thickness + accentBoost, data.innerColor, data.stroke, data.smallColor)

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

