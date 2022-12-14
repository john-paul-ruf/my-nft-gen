import {getRandomIntInclusive} from "../../../../core/math/random.js";
import {getColorFromBucket, getFinalImageSize, getNeutralFromBucket,} from "../../../../core/GlobalSettings.js";
import {eightEffect} from "./effect.js";

const finalImageSize = getFinalImageSize();

const config = {
    layerOpacity: 0.7,
    underLayerOpacity: 0.25,
    stroke: 4,
    thickness: 20,
    smallRadius: {lower: finalImageSize.width * 0.15, upper: finalImageSize.width * 0.2},
    smallNumberOfRings: {lower: 3, upper: 6},
    ripple: {lower: finalImageSize.width / 15, upper: finalImageSize.width / 25},
    times: {lower: 1, upper: 2},
    smallerRingsGroupRadius: {lower: finalImageSize.width * 0.2, upper: finalImageSize.width * 0.3},
    accentRange: {bottom: {lower: 0, upper: 0}, top: {lower: 4, upper: 8}},
    blurRange: {bottom: {lower: 0, upper: 0}, top: {lower: 1, upper: 2}},
    accentTimes: {lower: 6, upper: 12},
    blurTimes: {lower: 2, upper: 8},
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
        outerColor: getNeutralFromBucket(),
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
            return `${eightEffect.name}: ripple: ${data.ripple}`
        }
    }

    return data;
}