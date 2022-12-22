import {getRandomIntInclusive} from "../../../../core/math/random.js";
import {getColorFromBucket, getFinalImageSize,} from "../../../../core/GlobalSettings.js";
import {fuzzyRippleEffect} from "./effect.js";

const finalImageSize = getFinalImageSize();

const config = {
    layerOpacity: 1,
    underLayerOpacity: 0.25,
    stroke: 3,
    thickness: 5,
    largeRadius: {lower: finalImageSize.width * 0.35, upper: finalImageSize.width * 0.45},
    smallRadius: {lower: finalImageSize.width * 0.15, upper: finalImageSize.width * 0.2},
    largeNumberOfRings: {lower: 7, upper: 14},
    smallNumberOfRings: {lower: 3, upper: 6},
    ripple: {lower: finalImageSize.width / 15, upper: finalImageSize.width / 25},
    times: {lower: 1, upper: 2},
    smallerRingsGroupRadius: {lower: finalImageSize.width * 0.25, upper: finalImageSize.width * 0.35},
    accentRange: {bottom: {lower: 0, upper: 0}, top: {lower: 2, upper: 4}},
    blurRange: {bottom: {lower: 0, upper: 0}, top: {lower: 0, upper: 0}},
    accentTimes: {lower: 0, upper: 0},
    blurTimes: {lower: 0, upper: 0},
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
        largeRadius: getRandomIntInclusive(config.largeRadius.lower, config.largeRadius.upper),
        smallRadius: getRandomIntInclusive(config.smallRadius.lower, config.smallRadius.upper),
        largeNumberOfRings: getRandomIntInclusive(config.largeNumberOfRings.lower, config.largeNumberOfRings.upper),
        smallNumberOfRings: getRandomIntInclusive(config.smallNumberOfRings.lower, config.smallNumberOfRings.upper),
        ripple: getRandomIntInclusive(config.ripple.lower, config.ripple.upper),
        smallerRingsGroupRadius: getRandomIntInclusive(config.smallerRingsGroupRadius.lower, config.smallerRingsGroupRadius.upper),
        times: getRandomIntInclusive(config.times.lower, config.times.upper),
        largeColor: getColorFromBucket(),
        smallColor: getColorFromBucket(),
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