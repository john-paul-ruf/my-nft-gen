import {getRandomIntExclusive, getRandomIntInclusive, randomNumber} from "../../../../core/math/random.js";
import {lensFlareEffect} from "./effect.js";
import {getFinalImageSize} from "../../../../core/GlobalSettings.js";

const finalImageSize = getFinalImageSize();

const config = {

    layerOpacityRange: {bottom: {lower: 0.7, upper: 0.8}, top: {lower: 0.9, upper: 0.1}},
    layerOpacityTimes: {lower: 4, upper: 8},

    elementOpacity: {lower: 0.1, upper: 0.25},

    numberOfFlareHex: {lower: 2, upper: 6},
    flareHexSizeRange: {lower: finalImageSize.height * 0.05, upper: finalImageSize.height * 0.2},

    numberOfFlareRings: {lower: 15, upper: 30},
    flareRingsSizeRange: {lower: finalImageSize.height * 0.1, upper: finalImageSize.height * 0.4},
    flareRingStroke: {lower: 0.25, upper: 1},

    numberOfFlareRays: {lower: 40, upper: 80},
    flareRaysSizeRange: {lower: finalImageSize.height * 0.1, upper: finalImageSize.height * 0.5},
    flareRaysStroke: {lower: 0.25, upper: 1},

    blurRange: {bottom: {lower: 0, upper: 1}, top: {lower: 3, upper: 10}},
    blurTimes: {lower: 1, upper: 6},

    flareColors: [
        '#d5fecc',
        '#acff99',
        '#83ff66',
        '#5aff33',
        '#31ff00',
        '#27cc00',
        '#1d9900',
        '#136600',
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
            sides: getRandomIntInclusive(5, 12),
            opacity: randomNumber(config.elementOpacity.lower, config.elementOpacity.upper),
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
            opacity: randomNumber(config.elementOpacity.lower, config.elementOpacity.upper),
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
            radius: getRandomIntInclusive(0, 360),
            color: config.getFlareColor(),
            opacity: randomNumber(config.elementOpacity.lower, config.elementOpacity.upper),
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
            getInfo: () => {
                return `${lensFlareEffect.name}: ${data.numberOfFlareHex} polygons, ${data.numberOfFlareRings} rings, ${data.numberOfFlareRays} rays`
            }
        };

    data.hexArray = getFlareHexArray(data.numberOfFlareHex);
    data.ringArray = getFlareRingArray(data.numberOfFlareRings);
    data.rayArray = getFlareRayArray(data.numberOfFlareRays);

    return data;
}
