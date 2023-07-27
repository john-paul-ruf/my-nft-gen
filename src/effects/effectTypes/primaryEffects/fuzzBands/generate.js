import {getRandomIntExclusive, getRandomIntInclusive} from "../../../../core/math/random.js";
import {getColorFromBucket, getFinalImageSize, getNeutralFromBucket} from "../../../../core/GlobalSettings.js";
import {fuzzBandsEffect} from "./effect.js";

const finalImageSize = getFinalImageSize();

const config = {
    layerOpacity: 0.4,
    underLayerOpacity: 0.2,
    circles: {lower: 10, upper: 20},
    stroke: 1,
    thickness: 4,
    scaleFactor: 1.2,
    accentRange: {bottom: {lower: 0, upper: 0}, top: {lower: 5, upper: 15}},
    blurRange: {bottom: {lower: 0, upper: 1}, top: {lower: 3, upper: 4}},
    accentTimes: {lower: 4, upper: 12},
    blurTimes: {lower: 4, upper: 12},
}

const computeInitialInfo = (num, width) => {
    const info = [];
    for (let i = 0; i <= num; i++) {
        info.push({
            radius: getRandomIntExclusive(0, width * 0.95),
            color: getColorFromBucket(),
            accentRange: {
                lower: getRandomIntInclusive(config.accentRange.bottom.lower, config.accentRange.bottom.upper),
                upper: getRandomIntInclusive(config.accentRange.top.lower, config.accentRange.top.upper)
            },
            accentTimes: getRandomIntInclusive(config.accentTimes.lower, config.accentTimes.upper),
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
        innerColor: getNeutralFromBucket(),
        scaleFactor: config.scaleFactor,
        center: {x: finalImageSize.width / 2, y: finalImageSize.height / 2},
        blurRange: {
            lower: getRandomIntInclusive(config.blurRange.bottom.lower, config.blurRange.bottom.upper),
            upper: getRandomIntInclusive(config.blurRange.top.lower, config.blurRange.top.upper)
        },
        blurTimes: getRandomIntInclusive(config.blurTimes.lower, config.blurTimes.upper),
        getInfo: () => {
            return `${fuzzBandsEffect.name}: ${data.numberOfCircles} fuzzy bands`
        }
    }

    data.circles = computeInitialInfo(data.numberOfCircles, data.width);

    return data;
}