import {getColorFromBucket, getFinalImageSize, getNeutralFromBucket} from "../../../../core/GlobalSettings.js";
import {getRandomIntInclusive} from "../../../../core/math/random.js";
import {encircledSpiralEffect} from "./effect.js";


const finalImageSize = getFinalImageSize();

const config = {
    layerOpacity: 0.25,
    numberOfRings: {lower: 1, upper: 3},
    radiusRange: {lower: finalImageSize.longestSide * 0.2, upper: finalImageSize.longestSide * 0.45},
    stroke: 1,
    thickness: 1,
    ringStroke: 1,
    ringThickness: 1,
    sparsityFactor: {lower: 1, upper: 1},
    numberOfSegments: {lower: 8, upper: 12},
    speed: {lower: 3, upper: 6},
}

const getRingArray = (num) => {
    const info = [];

    for (let i = 0; i < num; i++) {
        info.push({
            size: getRandomIntInclusive(config.radiusRange.lower, config.radiusRange.upper),
            speed: getRandomIntInclusive(config.speed.lower, config.speed.upper),
            stroke: config.stroke,
            thickness: config.thickness,
            ringStroke: config.ringStroke,
            ringThickness: config.ringThickness,
            numberOfSegments: getRandomIntInclusive(config.numberOfSegments.lower, config.numberOfSegments.upper),
            sparsityFactor: getRandomIntInclusive(config.sparsityFactor.lower, config.sparsityFactor.upper),
            innerColor: getNeutralFromBucket(),
            outerColor: getColorFromBucket(),
        });
    }

    return info;
}

export const generate = () => {
    const data = {
        numberOfRings: getRandomIntInclusive(config.numberOfRings.lower, config.numberOfRings.upper),
        layerOpacity: config.layerOpacity,
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
