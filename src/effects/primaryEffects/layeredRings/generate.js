import {getRandomIntInclusive, randomNumber} from "../../../core/math/random.js";
import {layeredRingsEffect} from "./effect.js";
import {GlobalSettings} from "../../../core/GlobalSettings.js";

export const generate = async (settings) => {

    const finalImageSize = GlobalSettings.getFinalImageSize();

    const config = {
        thickness: 4,
        stroke: 0,

        layerOpacityRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
        layerOpacityTimes: {lower: 2, upper: 4},

        indexOpacityRange: {bottom: {lower: 0.3, upper: 0.5}, top: {lower: 0.9, upper: 1}},
        indexOpacityTimes: {lower: 2, upper: 4},

        radius: {lower: 40, upper: 60},
        offsetRadius: {lower: 30, upper: 60},

        numberOfIndex: {lower: 20, upper: 40},
        startIndex: {lower: 8, upper: 12},

        startAngle: 0,

        movementGaston: {lower: 1, upper: 12},

        initialNumberOfPoints: 4,
        scaleByFactor: 1.1
    }

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
                return `${layeredRingsEffect.name}: ${data.offsetRadius} offset radius, ${data.numberOfIndex} layers, ${data.startIndex} offset`
            }
        };


    const getRingsIndexArray = async (num) => {
        const info = [];

        for (let i = 0; i <= num; i++) {
            info.push({
                color: await settings.getColorFromBucket(),
                outline: await settings.getNeutralFromBucket(),
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

    data.ringArray = await getRingsIndexArray(data.numberOfIndex);

    return data;
}

