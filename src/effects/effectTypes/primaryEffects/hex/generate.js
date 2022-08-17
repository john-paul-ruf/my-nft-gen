import {getRandomIntInclusive} from "../../../../core/math/random.js";
import {getColorFromBucket, getFinalImageSize,} from "../../../../core/GlobalSettings.js";
import {hexEffect} from "./effect.js";

const config = {
    sparsityFactor: {lower: 36, upper: 36},
    gapFactor: {lower: 2, upper: 5},
    radiusFactor: {lower: 8, upper: 15},
    accentRange: {bottom: {lower: 0, upper: 0}, top: {lower: 1, upper: 2}},
    blurRange: {bottom: {lower: 0, upper: 0}, top: {lower: 1, upper: 2}},
    accentTimes: {lower: 2, upper: 4},
    blurTimes: {lower: 2, upper: 4},
    stroke: 0.05,
    thickness: 0.25,
    scaleFactor: 1.001,
}

const finalImageSize = getFinalImageSize();

export const generate = () => {
    const data = {
        height: finalImageSize.height,
        width: finalImageSize.width,
        stroke: config.stroke,
        thickness: config.thickness,
        innerColor: getColorFromBucket(),
        scaleFactor: config.scaleFactor,
        sparsityFactor: getRandomIntInclusive(config.sparsityFactor.lower, config.sparsityFactor.upper),
        gapFactor: getRandomIntInclusive(config.gapFactor.lower, config.gapFactor.upper),
        radiusFactor: getRandomIntInclusive(config.radiusFactor.lower, config.radiusFactor.upper),
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
        color: getColorFromBucket(),
        center: {x: finalImageSize.width / 2, y: finalImageSize.height / 2},
        getInfo: () => {
            return `${hexEffect.name}: sparsityFactor: ${data.sparsityFactor}, gapFactor: ${data.gapFactor}, radiusFactor: ${data.radiusFactor}`
        }
    }

    return data;
}