import {getRandomIntInclusive, randomNumber} from "../../../../core/math/random.js";
import {getColorFromBucket, getFinalImageSize} from "../../../../core/GlobalSettings.js";
import {layeredHexEffect} from "./effect.js";

const finalImageSize = getFinalImageSize();

const config = {
    thickness: 1,
    stroke: 0,

    layerOpacityRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
    layerOpacityTimes: {lower: 1, upper: 6},

    indexOpacityRange: {bottom: {lower: 0.05, upper: 0.1}, top: {lower: 0.15, upper: 0.2}},
    indexOpacityTimes: {lower: 1, upper: 6},

    radius: {lower: 15, upper: 25},
    offsetRadius: {lower: 20, upper: 23},

    numberOfIndex: {lower: 30, upper: 40},
    startIndex: {lower: 13, upper: 15},

    startAngle: 30,

    movementGaston: {lower: 1, upper: 3},

    initialNumberOfPoints: 8,
    scaleByFactor: 1.08

}

const getHexIndexArray = (num) => {
    const info = [];

    for (let i = 0; i <= num; i++) {
        info.push({
            color: getColorFromBucket(),
            outline: getColorFromBucket(),
            outlineStrokeColor: getColorFromBucket(),
            opacity: {
                lower: randomNumber(config.indexOpacityRange.bottom.lower, config.indexOpacityRange.bottom.upper),
                upper: randomNumber(config.indexOpacityRange.top.lower, config.indexOpacityRange.top.upper)
            },
            opacityTimes: getRandomIntInclusive(config.indexOpacityTimes.lower, config.indexOpacityTimes.upper),
            movementGaston: getRandomIntInclusive(config.movementGaston.lower, config.movementGaston.upper),
            radius: getRandomIntInclusive(config.offsetRadius.lower, config.radius.upper),
        });
    }

    return info;
}

export const generate = () => {

    const data =
        {
            height: finalImageSize.height,
            width: finalImageSize.width,
            center: {x: finalImageSize.width / 2, y: finalImageSize.height / 2},

            startAngle: config.startAngle,
            thickness: config.thickness,
            stroke: config.stroke,

            initialNumberOfPoints: config.initialNumberOfPoints,
            scaleByFactor: config.scaleByFactor,

            numberOfIndex: getRandomIntInclusive(config.numberOfIndex.lower, config.numberOfIndex.upper),
            startIndex: getRandomIntInclusive(config.startIndex.lower, config.startIndex.upper),

            layerOpacityRange: {
                lower: randomNumber(config.layerOpacityRange.bottom.lower, config.layerOpacityRange.bottom.upper),
                upper: randomNumber(config.layerOpacityRange.top.lower, config.layerOpacityRange.top.upper)
            },
            layerOpacityTimes: getRandomIntInclusive(config.layerOpacityTimes.lower, config.layerOpacityTimes.upper),

            offsetRadius: getRandomIntInclusive(config.offsetRadius.lower, config.offsetRadius.upper),

            getInfo: () => {
                return `${layeredHexEffect.name}: ${data.offsetRadius} offset radius, ${data.numberOfIndex} layers, ${data.startIndex} offset`
            }
        };

    data.hexArray = getHexIndexArray(data.numberOfIndex);

    return data;
}
