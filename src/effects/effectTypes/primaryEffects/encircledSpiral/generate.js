import {getColorFromBucket, getFinalImageSize, getNeutralFromBucket} from "../../../../core/GlobalSettings.js";
import {getRandomFromArray, getRandomIntInclusive} from "../../../../core/math/random.js";
import {encircledSpiralEffect} from "./effect.js";


const finalImageSize = getFinalImageSize();

const config = {
    invertLayers: true,
    layerOpacity: 1,
    underLayerOpacity: 0.8,
    numberOfRings: {lower: 2, upper: 4},
    radiusRange: {lower: finalImageSize.shortestSide * 0.3, upper: finalImageSize.longestSide * 0.45},
    stroke: 1,
    thickness: 1,
    /*
    ringStroke: 0, the ring draws with the wrong weight - instead of fixing decided that the ring is NOT pretty - commented out in invoke function
    ringThickness: 4,
    */
    sparsityFactor: [30, 36],
    startSegment: [6, 7, 8],
    numberOfSegments: [10, 11, 12],
    speed: {lower: 4, upper: 8},
    accentRange: {bottom: {lower: 0, upper: 0}, top: {lower: 3, upper: 5}},
    blurRange: {bottom: {lower: 1, upper: 1}, top: {lower: 2, upper: 4}},
    featherTimes: {lower: 2, upper: 4},
}

const getRingArray = (num) => {
    const info = [];

    for (let i = 0; i < num; i++) {
        info.push({
            radius: getRandomIntInclusive(config.radiusRange.lower, config.radiusRange.upper),
            speed: getRandomIntInclusive(config.speed.lower, config.speed.upper),
            stroke: config.stroke,
            thickness: config.thickness,
            ringStroke: config.ringStroke,
            ringThickness: config.ringThickness,
            numberOfSegments: getRandomFromArray(config.numberOfSegments),
            sparsityFactor: getRandomFromArray(config.sparsityFactor),
            innerColor: getNeutralFromBucket(),
            outerColor: getColorFromBucket(),
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

export const generate = () => {
    const data = {
        invertLayers: config.invertLayers,
        numberOfRings: getRandomIntInclusive(config.numberOfRings.lower, config.numberOfRings.upper),
        startSegment: getRandomFromArray(config.startSegment),
        layerOpacity: config.layerOpacity,
        underLayerOpacity: config.underLayerOpacity,
        height: finalImageSize.height,
        width: finalImageSize.width,
        center: {x: finalImageSize.width / 2, y: finalImageSize.height / 2},
        getInfo: () => {
            return `${encircledSpiralEffect.name}: ${data.numberOfRings} rings`
        }
    }

    data.ringArray = getRingArray(data.numberOfRings);

    return data;
}
