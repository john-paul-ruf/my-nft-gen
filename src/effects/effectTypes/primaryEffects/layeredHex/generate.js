import {getRandomIntInclusive, randomNumber} from "../../../../core/math/random.js";
import {getColorFromBucket, getFinalImageSize} from "../../../../core/GlobalSettings.js";
import {layeredHexEffect} from "./effect.js";

const finalImageSize = getFinalImageSize();

const config = {
    thickness: 2,
    stroke: 1,

    layerOpacityRange: {bottom: {lower: 0.7, upper: 0.8}, top: {lower: 0.9, upper: 1}},
    layerOpacityTimes: {lower: 1, upper: 12},

    indexOpacityRange: {bottom: {lower: 0.1, upper: 0.2}, top: {lower: 0.3, upper: 0.4}},
    indexOpacityTimes: {lower: 1, upper: 12},

    radius: {lower: 10, upper: 50},

    numberOfIndex: {lower: 4, upper: 12},
    startIndex: {lower: 1, upper: 4},

    startAngle: 30,

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
