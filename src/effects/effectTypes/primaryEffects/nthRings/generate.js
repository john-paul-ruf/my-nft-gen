import {getRandomIntInclusive} from "../../../../core/math/random.js";
import {getColorFromBucket, getFinalImageSize,} from "../../../../core/GlobalSettings.js";
import {nthRings} from "./invoke.js";

const finalImageSize = getFinalImageSize();

const config = {
    totalRingCount: {lower: 12, upper: 12},
    layerOpacity: 0.5,
    underLayerOpacity: 0.3,
    stroke: 1,
    thickness: 2,
    smallRadius: {lower: finalImageSize.longestSide * 0.10, upper: finalImageSize.longestSide * 0.15},
    smallNumberOfRings: {lower: 5, upper: 10},
    ripple: {lower: finalImageSize.shortestSide * 0.05, upper: finalImageSize.shortestSide * 0.10},
    times: {lower: 2, upper: 4},
    smallerRingsGroupRadius: {lower: finalImageSize.shortestSide * 0.30, upper: finalImageSize.shortestSide * 0.35},
    accentRange: {bottom: {lower: 0, upper: 10}, top: {lower: 25, upper: 50}},
    blurRange: {bottom: {lower: 0, upper: 4}, top: {lower: 6, upper: 12}},
    featherTimes: {lower: 2, upper: 8},
}

export const generate = () => {
    const data = {
        totalRingCount: getRandomIntInclusive(config.totalRingCount.lower, config.totalRingCount.upper),
        layerOpacity: config.layerOpacity,
        underLayerOpacity: config.underLayerOpacity,
        height: finalImageSize.height,
        width: finalImageSize.width,
        stroke: config.stroke,
        thickness: config.thickness,
        innerColor: getColorFromBucket(),
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
        featherTimes: getRandomIntInclusive(config.featherTimes.lower, config.featherTimes.upper),
        getInfo: () => {
            return `${nthRings.name}: ${data.totalRingCount} ring groups, ripple: ${data.ripple.toFixed(2)}`
        }
    }

    return data;
}