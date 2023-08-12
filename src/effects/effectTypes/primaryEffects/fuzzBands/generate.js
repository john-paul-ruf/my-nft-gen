import {getRandomIntInclusive} from "../../../../core/math/random.js";
import {getColorFromBucket, getFinalImageSize, getNeutralFromBucket} from "../../../../core/GlobalSettings.js";
import {fuzzBandsEffect} from "./effect.js";

const finalImageSize = getFinalImageSize();

const config = {
    layerOpacity: 0.6,
    underLayerOpacity: 0.4,
    circles: {lower: 5, upper: 10},
    stroke: 5,
    thickness: 3,
    radius: {lower: finalImageSize.shortestSide * 0.10, upper: finalImageSize.longestSide * 0.45},
    accentRange: {bottom: {lower: 0, upper: 0}, top: {lower: 15, upper: 40}},
    blurRange: {bottom: {lower: 0, upper: 6}, top: {lower: 8, upper: 12}},
    featherTimes: {lower: 8, upper: 8},
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
        });
    }
    return info;
}

export const generate = () => {
    const data = {
        layerOpacity: config.layerOpacity,
        underLayerOpacity: config.underLayerOpacity,
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