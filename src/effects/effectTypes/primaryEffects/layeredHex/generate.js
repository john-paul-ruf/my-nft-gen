import {getRandomIntInclusive, randomNumber} from "../../../../core/math/random.js";
import {getColorFromBucket, getFinalImageSize} from "../../../../core/GlobalSettings.js";
import {layeredHexEffect} from "./effect.js";

const finalImageSize = getFinalImageSize();

const config = {
    thickness: 2,
    stroke: 1,

    layerOpacityRange: {bottom: {lower: 0.7, upper: 0.8}, top: {lower: 0.9, upper: 1}},
    layerOpacityTimes: {lower: 1, upper: 3},

    indexOpacityRange: {bottom: {lower: 0.05, upper: 0.1}, top: {lower: 0.2, upper: 0.4}},
    indexOpacityTimes: {lower: 1, upper: 6},

    radius: {lower: 20, upper: 30},

    numberOfIndex: {lower: 6, upper: 10},
    startIndex: {lower: 2, upper: 4},

    startAngle: 0,

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

            radius: getRandomIntInclusive(config.radius.lower, config.radius.upper),
            numberOfIndex: getRandomIntInclusive(config.numberOfIndex.lower, config.numberOfIndex.upper),
            startIndex: getRandomIntInclusive(config.startIndex.lower, config.startIndex.upper),

            layerOpacityRange: {
                lower: randomNumber(config.layerOpacityRange.bottom.lower, config.layerOpacityRange.bottom.upper),
                upper: randomNumber(config.layerOpacityRange.top.lower, config.layerOpacityRange.top.upper)
            },
            layerOpacityTimes: getRandomIntInclusive(config.layerOpacityTimes.lower, config.layerOpacityTimes.upper),

            getInfo: () => {
                return `${layeredHexEffect.name}: ${data.radius} radius, ${data.numberOfIndex} layers, ${data.startIndex} offset`
            }
        };

    data.hexArray = getHexIndexArray(data.numberOfIndex);

    return data;
}