import {getRandomIntInclusive, randomNumber} from "../../../../core/math/random.js";
import {getColorFromBucket, getFinalImageSize, getNeutralFromBucket} from "../../../../core/GlobalSettings.js";
import {fuzzBandsEffect} from "./effect.js";

const finalImageSize = getFinalImageSize();

const config = {
    invertLayers: true,
    layerOpacity: 1,
    underLayerOpacityRange: {bottom: {lower: 0.7, upper: 0.8}, top: {lower: 0.9, upper: 0.95}},
    underLayerOpacityTimes: {lower: 2, upper: 6},
    circles: {lower: 3, upper: 6},
    stroke: 0,
    thickness: 12,
    radius: {lower: finalImageSize.shortestSide * 0.10, upper: finalImageSize.longestSide * 0.45},
    accentRange: {bottom: {lower: 6, upper: 12}, top: {lower: 25, upper: 45}},
    blurRange: {bottom: {lower: 1, upper: 3}, top: {lower: 8, upper: 12}},
    featherTimes: {lower: 2, upper: 6},
}

const computeInitialInfo = (num) => {
    const info = [];
    for (let i = 0; i <= num; i++) {
        info.push({
            radius: getRandomIntInclusive(config.radius.lower, config.radius.upper),
            color: getColorFromBucket(),
            innerColor: getNeutralFromBucket(),
            accentRange: {
                lower: getRandomIntInclusive(config.accentRange.bottom.lower, config.accentRange.bottom.upper),
                upper: getRandomIntInclusive(config.accentRange.top.lower, config.accentRange.top.upper)
            },
            blurRange: {
                lower: getRandomIntInclusive(config.blurRange.bottom.lower, config.blurRange.bottom.upper),
                upper: getRandomIntInclusive(config.blurRange.top.lower, config.blurRange.top.upper)
            },
            featherTimes: getRandomIntInclusive(config.featherTimes.lower, config.featherTimes.upper),
            underLayerOpacityRange: {
                lower: randomNumber(config.underLayerOpacityRange.bottom.lower, config.underLayerOpacityRange.bottom.upper),
                upper: randomNumber(config.underLayerOpacityRange.top.lower, config.underLayerOpacityRange.top.upper)
            },
            underLayerOpacityTimes: getRandomIntInclusive(config.underLayerOpacityTimes.lower, config.underLayerOpacityTimes.upper),
        });
    }
    return info;
}

export const generate = () => {
    const data = {
        invertLayers: config.invertLayers,
        layerOpacity: config.layerOpacity,
        numberOfCircles: getRandomIntInclusive(config.circles.lower, config.circles.upper),
        height: finalImageSize.height,
        width: finalImageSize.width,
        stroke: config.stroke,
        thickness: config.thickness,
        center: {x: finalImageSize.width / 2, y: finalImageSize.height / 2},
        getInfo: () => {
            return `${fuzzBandsEffect.name}: ${data.numberOfCircles} fuzzy bands`
        }
    }

    data.circles = computeInitialInfo(data.numberOfCircles);

    return data;
}