import {getRandomIntInclusive, randomNumber} from "../../../../core/math/random.js";
import {getColorFromBucket, getFinalImageSize, getNeutralFromBucket} from "../../../../core/GlobalSettings.js";
import {layeredHexEffect} from "./effect.js";

const finalImageSize = getFinalImageSize();

const config = {
    thickness: 2,
    stroke: 0,

    layerOpacityRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
    layerOpacityTimes: {lower: 1, upper: 6},

    indexOpacityRange: {bottom: {lower: 0.5, upper: 0.6}, top: {lower: 0.8, upper: 1}},
    indexOpacityTimes: {lower: 4, upper: 12},

    radius: {lower: 10, upper: 40},
    offsetRadius: {lower: 20, upper: 60},

    numberOfIndex: {lower: 10, upper: 20},
    startIndex: {lower: 2, upper: 4},

    startAngle: 15,

    movementGaston: {lower: 1, upper: 12},

    initialNumberOfPoints: 8,
    scaleByFactor: 1.1

}

const getHexIndexArray = (num) => {
    const info = [];

    for (let i = 0; i <= num; i++) {
        info.push({
            color: getNeutralFromBucket(),
            outline: getColorFromBucket(),
            outlineStrokeColor: getNeutralFromBucket(),
            opacity: {
                lower: randomNumber(config.indexOpacityRange.bottom.lower, config.indexOpacityRange.bottom.upper),
                upper: randomNumber(config.indexOpacityRange.top.lower, config.indexOpacityRange.top.upper)
            },
            opacityTimes: getRandomIntInclusive(config.indexOpacityTimes.lower, config.indexOpacityTimes.upper),
            movementGaston: getRandomIntInclusive(config.movementGaston.lower, config.movementGaston.upper),
            radius: getRandomIntInclusive(config.radius.lower, config.radius.upper),
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
