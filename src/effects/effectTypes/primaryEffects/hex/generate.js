import {getRandomIntExclusive, getRandomIntInclusive, randomNumber} from "../../../../core/math/random.js";
import {getFinalImageSize, getNeutralFromBucket,} from "../../../../core/GlobalSettings.js";
import {hexEffect} from "./effect.js";

const config = {
    layerOpacity: 0.5,
    underLayerOpacity: 0.3,
    sparsityFactor: {lower: 12, upper: 18},
    gapFactor: {lower: 4, upper: 8},
    radiusFactor: {lower: 4, upper: 8},
    accentRange: {bottom: {lower: 0.05, upper: 0.15}, top: {lower: 0.25, upper: 0.5}}, //x scale factor x loop count
    blurRange: {bottom: {lower: 0, upper: 0}, top: {lower: 0, upper: 0}},
    accentTimes: {lower: 0, upper: 0},
    blurTimes: {lower: 0, upper: 0},
    stroke: 0,
    thickness: 0.05,
    scaleFactor: 2,
    numberOfHex: 30,
    strategy: ['static',/* 'angle', 'rotate'*/],
}


export const generate = () => {
    const finalImageSize = getFinalImageSize();

    const data = {
        numberOfHex: config.numberOfHex,
        strategy: config.strategy[getRandomIntExclusive(0, config.strategy.length)],
        layerOpacity: config.layerOpacity,
        underLayerOpacity: config.underLayerOpacity,
        height: finalImageSize.height,
        width: finalImageSize.width,
        stroke: config.stroke,
        thickness: config.thickness,
        innerColor: getNeutralFromBucket(),
        scaleFactor: config.scaleFactor,
        sparsityFactor: getRandomIntInclusive(config.sparsityFactor.lower, config.sparsityFactor.upper),
        gapFactor: getRandomIntInclusive(config.gapFactor.lower, config.gapFactor.upper),
        radiusFactor: getRandomIntInclusive(config.radiusFactor.lower, config.radiusFactor.upper),
        accentRange: {
            lower: randomNumber(config.accentRange.bottom.lower, config.accentRange.bottom.upper),
            upper: randomNumber(config.accentRange.top.lower, config.accentRange.top.upper)
        },
        blurRange: {
            lower: getRandomIntInclusive(config.blurRange.bottom.lower, config.blurRange.bottom.upper),
            upper: getRandomIntInclusive(config.blurRange.top.lower, config.blurRange.top.upper)
        },
        accentTimes: getRandomIntInclusive(config.accentTimes.lower, config.accentTimes.upper),
        blurTimes: getRandomIntInclusive(config.blurTimes.lower, config.blurTimes.upper),
        color: getNeutralFromBucket(),
        center: {x: finalImageSize.width / 2, y: finalImageSize.height / 2},
        getInfo: () => {
            return `${hexEffect.name}: strategy: ${data.strategy}, sparsity: ${data.sparsityFactor}, gap: ${data.gapFactor}, radius: ${data.radiusFactor}`
        }
    }

    return data;
}