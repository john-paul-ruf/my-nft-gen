import {getRandomIntInclusive, randomId, randomNumber} from "../../logic/math/random.js";
import {
    getCanvasStrategy,
    getColorFromBucket,
    getFinalImageSize,
    getLayerStrategy,
    getWorkingDirectory,
} from "../../logic/core/gobals.js";
import fs from "fs";
import {findValue} from "../../logic/math/findValue.js";
import {LayerFactory} from "../../layer/LayerFactory.js";
import {Canvas2dFactory} from "../../draw/Canvas2dFactory.js";

const finalImageSize = getFinalImageSize();

const config = {
    circles: {lower: 20, upper: 30},
    radiusGap: 40,
    stroke: 1,
    thickness: 1,
    scaleFactor: 1.01,
    densityFactor: 0.90,
    accentRange: {bottom: {lower: 0, upper: 2}, top: {lower: 4, upper: 6}},
    blurRange: {bottom: {lower: 1, upper: 2}, top: {lower: 4, upper: 6}},
    accentTimes: {lower: 3, upper: 6},
    blurTimes: {lower: 3, upper: 6},
    lengthRange: {bottom: {lower: 0, upper: 0}, top: {lower: 30, upper: 120}},
    lengthTimes: {lower: 3, upper: 12},
    sparsityFactor: {lower: 5, upper: 15},
}

const generate = () => {
    const data = {
        numberOfCircles: getRandomIntInclusive(config.circles.lower, config.circles.upper),
        height: finalImageSize.height,
        width: finalImageSize.width,
        stroke: config.stroke,
        thickness: config.thickness,
        innerColor: getColorFromBucket(),
        scaleFactor: config.scaleFactor,
        center: {x: finalImageSize.width / 2, y: finalImageSize.height / 2},
        blurRange: {
            lower: getRandomIntInclusive(config.blurRange.bottom.lower, config.blurRange.bottom.upper),
            upper: getRandomIntInclusive(config.blurRange.top.lower, config.blurRange.top.upper)
        },
        blurTimes: getRandomIntInclusive(config.blurTimes.lower, config.blurTimes.upper),
        getInfo: () => {
            return `${rayRingEffect.name}: ${data.numberOfCircles} ray rings`
        }
    }

    const computeInitialInfo = (num) => {
        const info = [];
        for (let i = 0; i <= num; i++) {
            info.push({
                radius: config.radiusGap * (i + 1),
                color: getColorFromBucket(),
                accentTimes: getRandomIntInclusive(config.accentTimes.lower, config.accentTimes.upper),
                accentRange: {
                    lower: getRandomIntInclusive(config.accentRange.bottom.lower, config.accentRange.bottom.upper),
                    upper: getRandomIntInclusive(config.accentRange.top.lower, config.accentRange.top.upper)
                },
                sparsityFactor: randomNumber(config.sparsityFactor.lower, config.sparsityFactor.upper) * (config.densityFactor / (i + 1)),
            });
        }

        const getRays = (sparsityFactor) => {
            const rays = [];

            for (let i = 0; i < 360; i = i + sparsityFactor) {
                rays.push({
                    length: {
                        lower: getRandomIntInclusive(config.lengthRange.bottom.lower, config.lengthRange.bottom.upper),
                        upper: getRandomIntInclusive(config.lengthRange.top.lower, config.lengthRange.top.upper)
                    },
                    lengthTimes: getRandomIntInclusive(config.lengthTimes.lower, config.lengthTimes.upper)
                });
            }

            return rays;
        }

        for (let c = 0; c < info.length; c++) {
            info[c].rays = getRays(info[c].sparsityFactor);
        }

        return info;
    }

    data.circles = computeInitialInfo(data.numberOfCircles);

    return data;
}

const rayRing = async (data, layer, currentFrame, numberOfFrames) => {
    const ring = getWorkingDirectory() + 'ray-ring' + randomId() + '.png';
    const fuzz = getWorkingDirectory() + 'ray-ring-fuzz' + randomId() + '.png';

    const draw = async (filename, withAccentGaston) => {
        const canvas = await Canvas2dFactory.getNewCanvas(getCanvasStrategy(), data.width, data.height);

        for (let i = 0; i < data.numberOfCircles; i++) {
            const theAccentGaston = withAccentGaston ? findValue(data.circles[i].accentRange.lower, data.circles[i].accentRange.upper, data.circles[i].accentTimes, numberOfFrames, currentFrame) : 0;
            await canvas.drawRing2d(data.center, data.circles[i].radius, data.thickness, data.innerColor, (data.stroke + theAccentGaston), data.circles[i].color)

            let rayIndex = 0;
            for (let a = 0; a < 360; a = a + data.circles[i].sparsityFactor) {
                const theLengthGaston = findValue(data.circles[i].rays[rayIndex].length.lower, data.circles[i].rays[rayIndex].length.upper, data.circles[i].rays[rayIndex].lengthTimes, numberOfFrames, currentFrame);
                await canvas.drawRay2d(data.center, data.stroke, data.circles[i].color, data.circles[i].color, a, data.circles[i].radius, theLengthGaston);
                rayIndex++;
            }
        }

        await canvas.toFile(filename);
    }

    const theBlurGaston = Math.ceil(findValue(data.blurRange.lower, data.blurRange.upper, data.blurTimes, numberOfFrames, currentFrame));

    await draw(ring, false);
    await draw(fuzz, true);

    let fuzzLayer = await LayerFactory.getLayerFromFile(getLayerStrategy(), fuzz);
    let ringLayer = await LayerFactory.getLayerFromFile(getLayerStrategy(), ring);

    await fuzzLayer.blur(theBlurGaston);
    await fuzzLayer.adjustLayerOpacity(0.5);

    await layer.compositeLayerOver(fuzzLayer);
    await layer.compositeLayerOver(ringLayer);

    fs.unlinkSync(ring);
    fs.unlinkSync(fuzz);

}

export const effect = {
    invoke: (data, layer, currentFrame, totalFrames) => rayRing(data, layer, currentFrame, totalFrames)
}

export const rayRingEffect = {
    name: 'ray-rings', generateData: generate, effect: effect, effectChance: 100, requiresLayer: true,
}

