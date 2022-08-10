import {getRandomIntExclusive, getRandomIntInclusive, randomId} from "../../logic/math/random.js";
import {
    CANVASTRATEGY,
    getColorFromBucket,
    IMAGEHEIGHT,
    IMAGEWIDTH,
    LAYERSTRATEGY,
    WORKINGDIRETORY
} from "../../logic/core/gobals.js";
import fs from "fs";
import {findValue} from "../../logic/math/findValue.js";
import {LayerFactory} from "../../layer/LayerFactory.js";
import {Canvas2dFactory} from "../../draw/Canvas2dFactory.js";


const config = {
    circles: {lower: 10, upper: 20},
    stroke: 1,
    thickness: 1,
    scaleFactor: 1.01,
    accentRange: {bottom: {lower: 0, upper: 2}, top: {lower: 4, upper: 6}},
    blurRange: {bottom: {lower: 1, upper: 2}, top: {lower: 4, upper: 6}},
    accentTimes: {lower: 1, upper: 5},
    blurTimes: {lower: 1, upper: 5},
}

const generate = () => {
    const data = {
        numberOfCircles: getRandomIntInclusive(config.circles.lower, config.circles.upper),
        height: IMAGEHEIGHT,
        width: IMAGEWIDTH,
        stroke: config.stroke,
        thickness: config.thickness,
        innerColor: getColorFromBucket(),
        scaleFactor: config.scaleFactor,
        center: {x: IMAGEWIDTH / 2, y: IMAGEHEIGHT / 2},
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
    const ring = WORKINGDIRETORY + 'ring' + randomId() + '.png';
    const fuzz = WORKINGDIRETORY + 'fuzz' + randomId() + '.png';

    const draw = async (filename, withAccentGaston) => {
        const canvas = await Canvas2dFactory.getNewCanvas(CANVASTRATEGY, data.width, data.height);

        for (let i = 0; i < data.numberOfCircles; i++) {
            const loopCount = i + 1;
            const scaleBy = (data.scaleFactor * loopCount);
            const theAccentGaston = withAccentGaston ? findValue(data.gates[i].accentRange.lower, data.gates[i].accentRange.upper, data.gates[i].accentTimes, numberOfFrames, currentFrame) : 0;
            await canvas.drawRing2d(data.center, data.circles[i].radius, data.thickness * scaleBy, data.innerColor, (data.stroke + theAccentGaston) * scaleBy, data.circles[i].color)
        }

        await canvas.toFile(filename);
    }

    const theBlurGaston = Math.ceil(findValue(data.blurRange.lower, data.blurRange.upper, data.blurTimes, numberOfFrames, currentFrame));

    await draw(ring, false);
    await draw(fuzz, true);

    let fuzzLayer = await LayerFactory.getLayerFromFile(LAYERSTRATEGY, fuzz);
    let ringLayer = await LayerFactory.getLayerFromFile(LAYERSTRATEGY, ring);

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

