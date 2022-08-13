import {getRandomIntExclusive, getRandomIntInclusive, randomId} from "../../logic/math/random.js";
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
    circles: {lower: 10, upper: 20},
    stroke: 0.5,
    thickness: 0.25,
    scaleFactor: 1.02,
    accentRange: {bottom: {lower: 0, upper: 2}, top: {lower: 4, upper: 6}},
    blurRange: {bottom: {lower: 1, upper: 2}, top: {lower: 4, upper: 6}},
    accentTimes: {lower: 3, upper: 6},
    blurTimes: {lower: 3, upper: 6},
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
            return `${fuzzBandsEffect.name}: ${data.numberOfCircles} fuzzy bands`
        }
    }

    const computeInitialInfo = (num) => {
        const info = [];
        for (let i = 0; i <= num; i++) {
            info.push({
                radius: getRandomIntExclusive(0, data.width * 0.75),
                color: getColorFromBucket(),
                accentRange: {
                    lower: getRandomIntInclusive(config.accentRange.bottom.lower, config.accentRange.bottom.upper),
                    upper: getRandomIntInclusive(config.accentRange.top.lower, config.accentRange.top.upper)
                },
                accentTimes: getRandomIntInclusive(config.accentTimes.lower, config.accentTimes.upper),
            });
        }
        return info;
    }

    data.circles = computeInitialInfo(data.numberOfCircles);

    return data;
}

const fuzzBands = async (data, layer, currentFrame, numberOfFrames) => {
    const ring = getWorkingDirectory() + 'ring' + randomId() + '.png';
    const fuzz = getWorkingDirectory() + 'fuzz' + randomId() + '.png';

    const draw = async (filename, withAccentGaston) => {
        const canvas = await Canvas2dFactory.getNewCanvas(getCanvasStrategy(), data.width, data.height);

        for (let i = 0; i < data.numberOfCircles; i++) {
            const loopCount = i + 1;
            const scaleBy = (data.scaleFactor * loopCount);
            const theAccentGaston = withAccentGaston ? findValue(data.circles[i].accentRange.lower, data.circles[i].accentRange.upper, data.circles[i].accentTimes, numberOfFrames, currentFrame) : 0;
            await canvas.drawRing2d(data.center, data.circles[i].radius, data.thickness * scaleBy, data.innerColor, (data.stroke + theAccentGaston) * scaleBy, data.circles[i].color)
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
    invoke: (data, layer, currentFrame, totalFrames) => fuzzBands(data, layer, currentFrame, totalFrames)
}

export const fuzzBandsEffect = {
    name: 'fuzz-bands',
    generateData: generate,
    effect: effect,
    effectChance: 70,
    requiresLayer: true,
}

