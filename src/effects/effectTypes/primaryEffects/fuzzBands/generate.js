import {getRandomIntInclusive} from "../../../../core/math/random.js";
import {getColorFromBucket, getFinalImageSize, getNeutralFromBucket} from "../../../../core/GlobalSettings.js";
import {fuzzBandsEffect} from "./effect.js";

const finalImageSize = getFinalImageSize();

const config = {
    layerOpacity: 0.5,
    underLayerOpacity: 0.25,
    circles: {lower: 3, upper: 6},
    stroke: 10,
    thickness: 5,
    radius: {lower: finalImageSize.shortestSide * 0.10, upper: finalImageSize.longestSide * 0.45},
    accentRange: {bottom: {lower: 0, upper: 10}, top: {lower: 25, upper: 75}},
    blurRange: {bottom: {lower: 0, upper: 2}, top: {lower: 4, upper: 6}},
    featherTimes: {lower: 4, upper: 12},
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