import {getRandomIntInclusive} from "../../../../core/math/random.js";
import {getColorFromBucket, getFinalImageSize,} from "../../../../core/GlobalSettings.js";
import {fuzzyRippleEffect} from "./effect.js";

const finalImageSize = getFinalImageSize();

const config = {
    layerOpacity: 0.3,
    underLayerOpacity: 0.2,
    stroke: 2,
    thickness: 8,
    largeRadius: {lower: finalImageSize.longestSide * 0.2, upper: finalImageSize.longestSide * 0.3},
    smallRadius: {lower: finalImageSize.longestSide * 0.1, upper: finalImageSize.longestSide * 0.125},
    largeNumberOfRings: {lower: 5, upper: 10},
    smallNumberOfRings: {lower: 3, upper: 6},
    ripple: {lower: finalImageSize.shortestSide / 40, upper: finalImageSize.shortestSide / 30},
    times: {lower: 1, upper: 6},
    smallerRingsGroupRadius: {lower: finalImageSize.shortestSide * 0.15, upper: finalImageSize.shortestSide * 0.15},
    accentRange: {bottom: {lower: 0, upper: 0}, top: {lower: 10, upper: 20}},
    blurRange: {bottom: {lower: 0, upper: 2}, top: {lower: 4, upper: 8}},
    accentTimes: {lower: 4, upper: 12},
    blurTimes: {lower: 4, upper: 12},
}

export const generate = () => {
    const data = {
        layerOpacity: config.layerOpacity,
        underLayerOpacity: config.underLayerOpacity,
        height: finalImageSize.height,
        width: finalImageSize.width,
        stroke: config.stroke,
        thickness: config.thickness,
        innerColor: getColorFromBucket(),
        outerColor: getColorFromBucket(),
        largeRadius: getRandomIntInclusive(config.largeRadius.lower, config.largeRadius.upper),
        smallRadius: getRandomIntInclusive(config.smallRadius.lower, config.smallRadius.upper),
        largeNumberOfRings: getRandomIntInclusive(config.largeNumberOfRings.lower, config.largeNumberOfRings.upper),
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
            return `${fuzzyRippleEffect.name}: large rings: ${data.largeNumberOfRings}, small rings x6: ${data.smallNumberOfRings}, ripple: ${data.ripple}`
        }
    }

    return data;
}