import {getRandomFromArray, getRandomIntInclusive, randomNumber} from "../../../core/math/random.js";
import {encircledSpiralEffect} from "./effect.js";
import {GlobalSettings} from "../../../core/GlobalSettings.js";

export const generate = async (settings) => {

    const finalImageSize = GlobalSettings.getFinalImageSize();

    const config = {
        invertLayers: true,
        layerOpacity: 0.55,
        underLayerOpacity: 0.5,
        startAngle: {lower: 0, upper: 360},
        numberOfRings: {lower: 5, upper: 10},
        stroke: 1,
        thickness: 1,
        sparsityFactor: [60],
        sequencePixelConstant: {lower: finalImageSize.shortestSide * 0.001, upper: finalImageSize.shortestSide * 0.001},
        sequence: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181],
        minSequenceIndex: [12],
        numberOfSequenceElements: [3],
        speed: {lower: 3, upper: 3},
        accentRange: {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 6}},
        blurRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
        featherTimes: {lower: 2, upper: 4},
    }

    const data = {
        invertLayers: config.invertLayers,
        sequence: config.sequence,
        numberOfRings: getRandomIntInclusive(config.numberOfRings.lower, config.numberOfRings.upper),
        layerOpacity: config.layerOpacity,
        underLayerOpacity: config.underLayerOpacity,
        height: finalImageSize.height,
        width: finalImageSize.width,
        center: {x: finalImageSize.width / 2, y: finalImageSize.height / 2},
        getInfo: () => {
            return `${encircledSpiralEffect.name}: ${data.numberOfRings} rings`
        }
    }

    const getRingArray = async (num) => {
        const info = [];

        for (let i = 0; i < num; i++) {
            info.push({
                //startAngle: getRandomIntInclusive(config.startAngle.lower, config.startAngle.upper),
                startAngle: i, //hard coded, for effect //sparsity factor divided by number of rings - even distribution.
                speed: getRandomIntInclusive(config.speed.lower, config.speed.upper),
                stroke: config.stroke,
                thickness: config.thickness,
                sequence: getRandomFromArray(config.minSequenceIndex),
                minSequenceIndex: getRandomFromArray(config.minSequenceIndex),
                numberOfSequenceElements: getRandomFromArray(config.numberOfSequenceElements),
                sequencePixelConstant: randomNumber(config.sequencePixelConstant.lower, config.sequencePixelConstant.upper),
                sparsityFactor: getRandomFromArray(config.sparsityFactor),
                innerColor: await settings.getNeutralFromBucket(),
                outerColor: await settings.getColorFromBucket(),
                accentRange: {
                    lower: getRandomIntInclusive(config.accentRange.bottom.lower, config.accentRange.bottom.upper),
                    upper: getRandomIntInclusive(config.accentRange.top.lower, config.accentRange.top.upper)
                },
                blurRange: {
                    lower: getRandomIntInclusive(config.blurRange.bottom.lower, config.blurRange.bottom.upper),
                    upper: getRandomIntInclusive(config.blurRange.top.lower, config.blurRange.top.upper)
                },
                featherTimes: getRandomIntInclusive(config.featherTimes.lower, config.featherTimes.upper),
            });
        }

        return info;
    }

    data.ringArray = await getRingArray(data.numberOfRings);

    return data;
}
