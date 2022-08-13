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
import {findOneWayValue} from "../../logic/math/findOneWayValue.js";
import {LayerFactory} from "../../layer/LayerFactory.js";
import {Canvas2dFactory} from "../../draw/Canvas2dFactory.js";


const config = {
    gates: {lower: 5, upper: 11},
    numberOfSides: {lower: 4, upper: 8},
    thickness: 2,
    stroke: 0.5,
    accentRange: {bottom: {lower: 0, upper: 2}, top: {lower: 4, upper: 6}},
    blurRange: {bottom: {lower: 1, upper: 2}, top: {lower: 4, upper: 6}},
    accentTimes: {lower: 3, upper: 6},
    blurTimes: {lower: 3, upper: 6},
}

const finalImageSize = getFinalImageSize();

const generate = () => {
    const data = {
        numberOfGates: getRandomIntInclusive(config.gates.lower, config.gates.upper),
        numberOfSides: getRandomIntInclusive(config.numberOfSides.lower, config.numberOfSides.upper),
        height: finalImageSize.height,
        width: finalImageSize.width,
        thickness: config.thickness,
        stroke: config.stroke,
        innerColor: getColorFromBucket(),
        center: {x: finalImageSize.width / 2, y: finalImageSize.height / 2},
        blurRange: {
            lower: getRandomIntInclusive(config.blurRange.bottom.lower, config.blurRange.bottom.upper),
            upper: getRandomIntInclusive(config.blurRange.top.lower, config.blurRange.top.upper)
        },
        blurTimes: getRandomIntInclusive(config.blurTimes.lower, config.blurTimes.upper),
        getInfo: () => {
            return `${gatesEffect.name}: ${data.numberOfGates} gates`
        }
    }

    const computeInitialInfo = (num) => {
        const info = [];
        for (let i = 0; i <= num; i++) {
            info.push({
                radius: getRandomIntExclusive(0, data.width / 2),
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

    data.gates = computeInitialInfo(data.numberOfGates);

    return data;
}

const gates = async (data, layer, currentFrame, numberOfFrames) => {
    const drawing = getWorkingDirectory() + 'gate' + randomId() + '.png';
    const underlayName = getWorkingDirectory() + 'gate-underlay' + randomId() + '.png';

    const draw = async (filename, withAccentGaston) => {

        const canvas = await Canvas2dFactory.getNewCanvas(getCanvasStrategy(), data.width, data.height);

        for (let i = 0; i < data.numberOfGates; i++) {
            const loopCount = i + 1;
            const direction = loopCount % 2;
            const invert = direction <= 0;
            const theAngleGaston = findOneWayValue(0, 360 / data.numberOfSides, numberOfFrames, currentFrame, invert);
            const theAccentGaston = withAccentGaston ? findValue(data.gates[i].accentRange.lower, data.gates[i].accentRange.upper, data.gates[i].accentTimes, numberOfFrames, currentFrame) : 0;
            await canvas.drawPolygon2d(data.gates[i].radius, data.center, data.numberOfSides, theAngleGaston, data.thickness, data.innerColor, data.stroke + theAccentGaston, data.gates[i].color)
        }

        await canvas.toFile(filename);
    }

    const theBlurGaston = Math.ceil(findValue(data.blurRange.lower, data.blurRange.upper, data.blurTimes, numberOfFrames, currentFrame));

    await draw(drawing, false);
    await draw(underlayName, true);

    let tempLayer = await LayerFactory.getLayerFromFile(getLayerStrategy(), drawing);
    let underlayLayer = await LayerFactory.getLayerFromFile(getLayerStrategy(), underlayName);

    await underlayLayer.blur(theBlurGaston);
    await underlayLayer.adjustLayerOpacity(0.5);

    await layer.compositeLayerOver(underlayLayer);
    await layer.compositeLayerOver(tempLayer);

    fs.unlinkSync(underlayName);
    fs.unlinkSync(drawing);
}

export const effect = {
    invoke: (data, layer, currentFrame, totalFrames) => gates(data, layer, currentFrame, totalFrames)
}

export const gatesEffect = {
    name: 'gates',
    generateData: generate,
    effect: effect,
    effectChance: 60,
    requiresLayer: true,
}

