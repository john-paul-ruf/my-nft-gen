import {getRandomIntInclusive} from "../../../../core/math/random.js";
import {getColorFromBucket, getFinalImageSize, getNeutralFromBucket,} from "../../../../core/GlobalSettings.js";
import {eightEffect} from "./effect.js";

const finalImageSize = getFinalImageSize();

const config = {
    layerOpacity: 0.25,
    underLayerOpacity: 0.25,
    stroke: 4,
    thickness: 16,
    smallRadius: {lower: finalImageSize.longestSide * 0.05, upper: finalImageSize.longestSide * 0.1},
    smallNumberOfRings: {lower: 3, upper: 6},
    ripple: {lower: finalImageSize.longestSide / 40, upper: finalImageSize.longestSide / 30},
    times: {lower: 1, upper: 6},
    smallerRingsGroupRadius: {lower: finalImageSize.longestSide * 0.1, upper: finalImageSize.longestSide * 0.15},
    accentRange: {bottom: {lower: 0, upper: 2}, top: {lower: 4, upper: 6}},
    blurRange: {bottom: {lower: 0, upper: 2}, top: {lower: 4, upper: 8}},
    accentTimes: {lower: 0, upper: 6},
    blurTimes: {lower: 0, upper: 6},
}

export const generate = () => {
    const data = {
        layerOpacity: config.layerOpacity,
        underLayerOpacity: config.underLayerOpacity,
        height: finalImageSize.height,
        width: finalImageSize.width,
        stroke: config.stroke,
        thickness: config.thickness,
        innerColor: getNeutralFromBucket(),
        outerColor: getColorFromBucket(),
        smallRadius: getRandomIntInclusive(config.smallRadius.lower, config.smallRadius.upper),
        smallNumberOfRings: getRandomIntInclusive(config.smallNumberOfRings.lower, config.smallNumberOfRings.upper),
        ripple: getRandomIntInclusive(config.ripple.lower, config.ripple.upper),
        smallerRingsGroupRadius: getRandomIntInclusive(config.smallerRingsGroupRadius.lower, config.smallerRingsGroupRadius.upper),
        times: getRandomIntInclusive(config.times.lower, config.times.upper),
        center: {x: finalImageSize.width / 2, y: finalImageSize.height / 2},
        accentRange: {
            lower: getRandomIntInclusive(config.accentRange.bottom.lower, config.accentRange.bottom.upper),
            upper: getRandomIntInclusive(config.accentRange.top.lower, config.accentRange.top.upper)
        },
        blurRange: {
            lower: getRandomIntInclusive(config.blurRange.bottom.lower, config.blurRange.bottom.upper),
            upper: getRandomIntInclusive(config.blurRange.top.lower, config.blurRange.top.upper)
        },
        accentTimes: getRandomIntInclusive(config.accentTimes.lower, config.accentTimes.upper),
        blurTimes: getRandomIntInclusive(config.blurTimes.lower, config.blurTimes.upper),
        getInfo: () => {
            return `${eightEffect.name}: ripple: ${data.ripple.toFixed(3)}`
        }
    }

    return data;
}