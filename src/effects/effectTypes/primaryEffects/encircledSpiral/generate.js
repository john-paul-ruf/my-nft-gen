import {getColorFromBucket, getFinalImageSize, getNeutralFromBucket} from "../../../../core/GlobalSettings.js";
import {getRandomIntInclusive, randomNumber} from "../../../../core/math/random.js";
import {encircledSpiralEffect} from "./effect.js";


const finalImageSize = getFinalImageSize();

const config = {
    layerOpacity: 0.5,
    numberOfRings: {lower: 2, upper: 6},
    radiusRange: {lower: finalImageSize.height * 0.2, upper: finalImageSize.height * 0.6},
    elementOpacityRange: {bottom: {lower: 0.2, upper: 0.3}, top: {lower: 0.4, upper: 0.5}},
    elementOpacityTimes: {lower: 1, upper: 6},
    stroke: 0,
    thickness: 0.5,
    ringStroke: 0,
    ringThickness: 12,
    sparsityFactor: {lower: 10, upper: 15},
    numberOfSegments: {lower: 10, upper: 15},
    speed: {lower: 1, upper: 6},
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
            innerColor: getColorFromBucket(),
            outerColor: getNeutralFromBucket(),
            opacity: {
                lower: randomNumber(config.elementOpacityRange.bottom.lower, config.elementOpacityRange.bottom.upper),
                upper: randomNumber(config.elementOpacityRange.top.lower, config.elementOpacityRange.top.upper)
            },
            opacityTimes: getRandomIntInclusive(config.elementOpacityTimes.lower, config.elementOpacityTimes.upper),
        });
    }

    return info;
}

export const generate = () => {
    const data = {
        numberOfRings: getRandomIntInclusive(config.numberOfRings.lower, config.numberOfRings.upper),
        layerOpacity: config.layerOpacity,
        height: finalImageSize.height * 2,
        width: finalImageSize.width * 2,
        center: {x: finalImageSize.width * 2 / 2, y: finalImageSize.height * 2 / 2},
        getInfo: () => {
            return `${encircledSpiralEffect.name}: ${data.numberOfRings} rings`
        }
    }

    data.ringArray = getRingArray(data.numberOfRings);

    return data;
}
