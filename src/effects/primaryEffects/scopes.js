import {getRandomIntInclusive, randomId, randomNumber} from "../../logic/math/random.js";
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
import {findOneWayValue} from "../../logic/math/findOneWayValue.js";
import {LayerFactory} from "../../layer/LayerFactory.js";
import {findValue} from "../../logic/math/findValue.js";
import {Canvas2dFactory} from "../../draw/Canvas2dFactory.js";


const config = {
    sparsityFactor: {lower: 0.2, upper: 0.5},
    gapFactor: {lower: 0.1, upper: 1},
    radiusFactor: {lower: 0.1, upper: 1},
    scaleFactor: 1.015,
    alphaRange: {bottom: {lower: 0.3, upper: 0.5}, top: {lower: 0.6, upper: 0.8}},
}

const generate = () => {
    const data = {
        height: IMAGEHEIGHT,
        width: IMAGEWIDTH,
        sparsityFactor: getRandomIntInclusive(config.sparsityFactor.lower, config.sparsityFactor.upper),
        gapFactor: getRandomIntInclusive(config.gapFactor.lower, config.gapFactor.upper),
        radiusFactor: getRandomIntInclusive(config.radiusFactor.lower, config.radiusFactor.upper),
        scaleFactor: config.scaleFactor,
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

        const canvas = await Canvas2dFactory.getNewCanvas(CANVASTRATEGY, data.width, data.height);

        const drawHexLine = async (angle, index, color, alphaRange) => {
            const loopCount = index + 1;
            const direction = loopCount % 2;
            const invert = direction <= 0;

            const theRotateGaston = findOneWayValue(angle, angle + 120, numberOfFrames, currentFrame, invert);
            const theAlphaGaston = findValue(alphaRange.lower, alphaRange.upper, 5, numberOfFrames, currentFrame);

            const scaleBy = (data.scaleFactor * loopCount);
            const radius = data.radiusFactor * scaleBy;
            const gapRadius = ((IMAGEHEIGHT * .05) + radius + (data.gapFactor * scaleBy) * loopCount)
            const pos = findPointByAngleAndCircle(data.center, angle, gapRadius)

            await canvas.drawFilledPolygon2d(radius, pos, 6, theRotateGaston, color, theAlphaGaston)

        }

        for (let x = 0; x < data.width; x++) {
            await drawHexLine(data.scopes[x].angle, data.scopes[x].loopCount, data.scopes[x].color, data.scopes[x].alphaRange)
        }

        await canvas.toFile(filename);
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
    effectChance: 80,
    requiresLayer: true,
}

