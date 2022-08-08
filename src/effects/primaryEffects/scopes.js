import {getRandomIntInclusive, randomId, randomNumber} from "../../logic/math/random.js";
import {getColorFromBucket, IMAGEHEIGHT, IMAGEWIDTH, LAYERSTRATEGY, WORKINGDIRETORY} from "../../logic/core/gobals.js";
import {createCanvas} from "canvas";
import fs from "fs";
import {findPointByAngleAndCircle} from "../../logic/math/drawingMath.js";
import {findOneWayValue} from "../../logic/math/findOneWayValue.js";
import {LayerFactory} from "../../layer/LayerFactory.js";
import {drawFilledPolygon2d} from "../../draw/drawFilledPolygon2d.js";
import {findValue} from "../../logic/math/findValue.js";


const config = {
    sparsityFactor: {lower: 10, upper: 20},
    gapFactor: {lower: 3, upper: 5},
    radiusFactor: {lower: 10, upper: 20},
    stroke: 3,
    thickness: 3,
    scaleFactor: 1.05,
    alphaRange: {bottom: {lower: 0.4, upper: 0.6}, top: {lower: 0.7, upper: 0.9}},
}

const generate = () => {
    const data = {
        height: IMAGEHEIGHT,
        width: IMAGEWIDTH,
        sparsityFactor: getRandomIntInclusive(config.sparsityFactor.lower, config.sparsityFactor.upper),
        gapFactor: getRandomIntInclusive(config.gapFactor.lower, config.gapFactor.upper),
        radiusFactor: getRandomIntInclusive(config.radiusFactor.lower, config.radiusFactor.upper),
        scaleFactor: 1.02,
        center: {x: IMAGEWIDTH / 2, y: IMAGEHEIGHT / 2},
        getInfo: () => {
            return `${scopesEffect.name}: sparsityFactor: ${data.sparsityFactor}, gapFactor: ${data.gapFactor}, radiusFactor: ${data.radiusFactor}`
        }
    }

    const computeInitialInfo = () => {
        const info = [];
        for (let i = 0; i < 20; i++) {
            for (let a = 0; a < 360; a = a + data.sparsityFactor) {
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
        return info;
    }

    data.scopes = computeInitialInfo();

    return data;
}

const scopes = async (data, layer, currentFrame, numberOfFrames) => {
    const imgName = WORKINGDIRETORY + 'scopes' + randomId() + '.png';

    const draw = async (filename) => {
        const canvas = createCanvas(data.width, data.height)
        const context = canvas.getContext('2d');

        const drawHexLine = (angle, index, color, alphaRange) => {
            const loopCount = index + 1;
            const direction = loopCount % 2;
            const invert = direction <= 0;

            const theRotateGaston = findOneWayValue(angle, angle + 120, numberOfFrames, currentFrame, invert);
            const theAlphaGaston = findValue(alphaRange.lower, alphaRange.upper, 5, numberOfFrames, currentFrame);

            const scaleBy = (data.scaleFactor * loopCount);
            const radius = data.radiusFactor * scaleBy;
            const gapRadius = ((IMAGEHEIGHT * .05) + radius + (data.gapFactor * scaleBy) * loopCount)
            const pos = findPointByAngleAndCircle(data.center, angle, gapRadius)

            drawFilledPolygon2d(context, radius, pos, 6, theRotateGaston, color, theAlphaGaston)

        }

        for (let s = 0; s < data.scopes.length; s++) {
            drawHexLine(data.scopes[s].angle, data.scopes[s].loopCount, data.scopes[s].color, data.scopes[s].alphaRange)
        }

        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filename, buffer);
    }

    await draw(imgName);

    let tempLayer = await LayerFactory.getLayerFromFile(LAYERSTRATEGY, imgName);
    await layer.compositeLayerOver(tempLayer)

    fs.unlinkSync(imgName);
}

export const effect = {
    invoke: (data, layer, currentFrame, totalFrames) => scopes(data, layer, currentFrame, totalFrames)
}

export const scopesEffect = {
    name: 'scopes',
    generateData: generate,
    effect: effect,
    effectChance: 60,
    requiresLayer: true,
}

