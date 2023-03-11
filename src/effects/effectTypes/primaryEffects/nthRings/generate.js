import {getRandomIntInclusive} from "../../../../core/math/random.js";
import {getColorFromBucket, getFinalImageSize, getNeutralFromBucket,} from "../../../../core/GlobalSettings.js";
import {nthRings} from "./invoke.js";

const finalImageSize = getFinalImageSize();

const config = {
    totalRingCount: {lower: 10, upper: 20},
    layerOpacity: 0.5,
    underLayerOpacity: 0.25,
    stroke: 12,
    thickness: 12,
    smallRadius: {lower: finalImageSize.longestSide * 0.2, upper: finalImageSize.longestSide * 0.3},
    smallNumberOfRings: {lower: 3, upper: 6},
    ripple: {lower: finalImageSize.longestSide / 15, upper: finalImageSize.longestSide / 10},
    times: {lower: 1, upper: 6},
    smallerRingsGroupRadius: {lower: finalImageSize.longestSide * 0.3, upper: finalImageSize.longestSide * 0.35},
    accentRange: {bottom: {lower: 0, upper: 0}, top: {lower: 0, upper: 0}},
    blurRange: {bottom: {lower: 0, upper: 0}, top: {lower: 0, upper: 0}},
    accentTimes: {lower: 0, upper: 0},
    blurTimes: {lower: 0, upper: 0},
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
            return `${nthRings.name}: ${data.totalRingCount} ring groups, ripple: ${data.ripple.toFixed(2)}`
        }
    }

    return data;
}