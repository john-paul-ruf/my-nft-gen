import {getColorFromBucket, getFinalImageSize} from "../../../../core/GlobalSettings.js";
import {GetRandomFromArray, getRandomIntInclusive} from "../../../../core/math/random.js";
import {encircledSpiralEffect} from "./effect.js";


const finalImageSize = getFinalImageSize();

const config = {
    layerOpacity: 0.4,
    underLayerOpacity: 0.3,
    numberOfRings: {lower: 3, upper: 6},
    radiusRange: {lower: finalImageSize.shortestSide * 0.1, upper: finalImageSize.longestSide * 0.4},
    stroke: 0,
    thickness: 2,
    ringStroke: 0,
    ringThickness: 2,
    sparsityFactor: [12, 15, 18, 20, 24, 30, 36],
    startSegment: 8,
    numberOfSegments: {lower: 12, upper: 24},
    speed: {lower: 3, upper: 12},
    accentRange: {bottom: {lower: 0, upper: 0}, top: {lower: 3, upper: 6}},
    blurRange: {bottom: {lower: 0, upper: 0}, top: {lower: 1, upper: 2}},
    featherTimes: {lower: 2, upper: 6},
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
            numberOfSegments: getRandomIntInclusive(config.numberOfSegments.lower, config.numberOfSegments.upper),
            sparsityFactor: GetRandomFromArray(config.sparsityFactor),
            innerColor: getColorFromBucket(),
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
        numberOfRings: getRandomIntInclusive(config.numberOfRings.lower, config.numberOfRings.upper),
        startSegment: config.startSegment,
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
