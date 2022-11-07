import {getRandomIntExclusive, getRandomIntInclusive, randomNumber} from "../../../../core/math/random.js";
import {lensFlareEffect} from "./effect.js";
import {getFinalImageSize} from "../../../../core/GlobalSettings.js";

const finalImageSize = getFinalImageSize();

const config = {

    layerOpacityRange: {bottom: {lower: 0.1, upper: 0.15}, top: {lower: 0.2, upper: 0.25}},
    layerOpacityTimes: {lower: 2, upper: 4},

    elementOpacityRange: {bottom: {lower: 0.2, upper: 0.25}, top: {lower: 0.3, upper: 0.35}},
    elementOpacityTimes: {lower: 2, upper: 4},

    elementGastonRange: {bottom: {lower: 5, upper: 10}, top: {lower: 15, upper: 30}},
    elementGastonTimes: {lower: 2, upper: 4},

    numberOfFlareHex: {lower: 2, upper: 8},
    flareHexSizeRange: {lower: finalImageSize.height * 0.01, upper: finalImageSize.height * 0.07},

    angleRangeFlareHex: {bottom: {lower: 25, upper: 30}, top: {lower: 60, upper: 65}},
    angleGastonTimes: {lower: 1, upper: 4},

    numberOfFlareRings: {lower: 150, upper: 250},
    flareRingsSizeRange: {lower: finalImageSize.height * 0.1, upper: finalImageSize.height * 0.75},
    flareRingStroke: {lower: 0.25, upper: 1},

    numberOfFlareRays: {lower: 150, upper: 250},
    flareRaysSizeRange: {lower: finalImageSize.height * 0.1, upper: finalImageSize.height * 0.7},
    flareRaysStroke: {lower: 0.25, upper: 1},

    //no blur, it is bad
    blurRange: {bottom: {lower: 0, upper: 0}, top: {lower: 0, upper: 0}},
    blurTimes: {lower: 0, upper: 0},

    flareColors: [
        /*        '#d5fecc',
                '#acff99',
                '#83ff66',
                '#5aff33',
                '#31ff00',*/
        '#9db0ff',
        '#ec9dff',
        '#ffec9d',
        '#ffbb9d',
        '#ff9daf',
    ],

    getFlareColor: () => {
        return config.flareColors[getRandomIntExclusive(0, config.flareColors.length)]
    }
}

const getFlareHexArray = (num) => {
    const info = [];

    for (let i = 0; i <= num; i++) {
        info.push({
            size: getRandomIntInclusive(config.flareHexSizeRange.lower, config.flareHexSizeRange.upper),
            color: config.getFlareColor(),
            strokeColor: config.getFlareColor(),
            sides: getRandomIntInclusive(6, 6), //ended up with hex...
            angle: getRandomIntInclusive(0, 360),
            offset: getRandomIntInclusive(-finalImageSize.width * 0.15, finalImageSize.width * 0.15),
            opacity: {
                lower: randomNumber(config.elementOpacityRange.bottom.lower, config.elementOpacityRange.bottom.upper),
                upper: randomNumber(config.elementOpacityRange.top.lower, config.elementOpacityRange.top.upper)
            },
            opacityTimes: getRandomIntInclusive(config.elementOpacityTimes.lower, config.elementOpacityTimes.upper),
        });
    }

    return info;
}

const getFlareRingArray = (num) => {
    const info = [];

    for (let i = 0; i <= num; i++) {
        info.push({
            size: getRandomIntInclusive(config.flareRingsSizeRange.lower, config.flareRingsSizeRange.upper),
            stroke: getRandomIntInclusive(config.flareRingStroke.lower, config.flareRingStroke.upper),
            color: config.getFlareColor(),
            opacity: {
                lower: randomNumber(config.elementOpacityRange.bottom.lower, config.elementOpacityRange.bottom.upper),
                upper: randomNumber(config.elementOpacityRange.top.lower, config.elementOpacityRange.top.upper)
            },
            opacityTimes: getRandomIntInclusive(config.elementOpacityTimes.lower, config.elementOpacityTimes.upper),
            gastonRange: {
                lower: randomNumber(config.elementGastonRange.bottom.lower, config.elementGastonRange.bottom.upper),
                upper: randomNumber(config.elementGastonRange.top.lower, config.elementGastonRange.top.upper)
            },
            gastonTimes: getRandomIntInclusive(config.elementGastonTimes.lower, config.elementGastonTimes.upper),
            gastonInvert: getRandomIntInclusive(0, 1) > 0,
        });
    }

    return info;
}

const getFlareRayArray = (num) => {
    const info = [];

    for (let i = 0; i <= num; i++) {
        info.push({
            size: getRandomIntInclusive(config.flareRaysSizeRange.lower, config.flareRaysSizeRange.upper),
            stroke: getRandomIntInclusive(config.flareRaysStroke.lower, config.flareRaysStroke.upper),
            angle: getRandomIntInclusive(0, 360),
            color: config.getFlareColor(),
            opacity: {
                lower: randomNumber(config.elementOpacityRange.bottom.lower, config.elementOpacityRange.bottom.upper),
                upper: randomNumber(config.elementOpacityRange.top.lower, config.elementOpacityRange.top.upper)
            },
            opacityTimes: getRandomIntInclusive(config.elementOpacityTimes.lower, config.elementOpacityTimes.upper),
            offset: getRandomIntInclusive(finalImageSize.width * 0.1, finalImageSize.width * 0.15,),
            gastonRange: {
                lower: randomNumber(config.elementGastonRange.bottom.lower, config.elementGastonRange.bottom.upper),
                upper: randomNumber(config.elementGastonRange.top.lower, config.elementGastonRange.top.upper)
            },
            gastonTimes: getRandomIntInclusive(config.elementGastonTimes.lower, config.elementGastonTimes.upper),
            gastonInvert: getRandomIntInclusive(0, 1) > 0,
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

            numberOfFlareHex: getRandomIntInclusive(config.numberOfFlareHex.lower, config.numberOfFlareHex.upper),
            numberOfFlareRings: getRandomIntInclusive(config.numberOfFlareRings.lower, config.numberOfFlareRings.upper),
            numberOfFlareRays: getRandomIntInclusive(config.numberOfFlareRays.lower, config.numberOfFlareRays.upper),

            layerOpacityRange: {
                lower: randomNumber(config.layerOpacityRange.bottom.lower, config.layerOpacityRange.bottom.upper),
                upper: randomNumber(config.layerOpacityRange.top.lower, config.layerOpacityRange.top.upper)
            },
            layerOpacityTimes: getRandomIntInclusive(config.layerOpacityTimes.lower, config.layerOpacityTimes.upper),

            blurRange: {
                lower: getRandomIntInclusive(config.blurRange.bottom.lower, config.blurRange.bottom.upper),
                upper: getRandomIntInclusive(config.blurRange.top.lower, config.blurRange.top.upper)
            },
            blurTimes: getRandomIntInclusive(config.blurTimes.lower, config.blurTimes.upper),

            angleRangeFlareHex: {
                lower: randomNumber(config.angleRangeFlareHex.bottom.lower, config.angleRangeFlareHex.bottom.upper),
                upper: randomNumber(config.angleRangeFlareHex.top.lower, config.angleRangeFlareHex.top.upper)
            },
            angleGastonTimes: getRandomIntInclusive(config.angleGastonTimes.lower, config.angleGastonTimes.upper),

            getInfo: () => {
                return `${lensFlareEffect.name}: ${data.numberOfFlareHex} polygons, ${data.numberOfFlareRings} rings, ${data.numberOfFlareRays} rays`
            }
        };

    data.hexArray = getFlareHexArray(data.numberOfFlareHex);
    data.ringArray = getFlareRingArray(data.numberOfFlareRings);
    data.rayArray = getFlareRayArray(data.numberOfFlareRays);

    return data;
}
