import {getRandomIntInclusive, randomNumber} from "../../../../core/math/random.js";
import {getColorFromBucket, getFinalImageSize} from "../../../../core/GlobalSettings.js";
import {layeredHexEffect} from "./effect.js";

const finalImageSize = getFinalImageSize();

const config = {
    thickness: 6,
    stroke: 0,

    layerOpacityRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
    layerOpacityTimes: {lower: 1, upper: 6},

    indexOpacityRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
    indexOpacityTimes: {lower: 1, upper: 6},

    radius: {lower: 40, upper: 60},
    offsetRadius: {lower: 30, upper: 50},

    numberOfIndex: {lower: 30, upper: 40},
    startIndex: {lower: 8, upper: 10},

    startAngle: 30,

    movementGaston: {lower: 1, upper: 12},

    initialNumberOfPoints: 15,
    scaleByFactor: 1.05

}

const getHexIndexArray = (num) => {
    const info = [];

    for (let i = 0; i <= num; i++) {
        info.push({
            color: '#00000000',
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
