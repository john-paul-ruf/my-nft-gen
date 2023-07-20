import {getRandomIntExclusive, getRandomIntInclusive, randomNumber} from "../../../../core/math/random.js";
import {getColorFromBucket, getFinalImageSize,} from "../../../../core/GlobalSettings.js";
import {hexEffect} from "./effect.js";

const config = {
    layerOpacity: 0.5,
    underLayerOpacity: 0.25,
    sparsityFactor: {lower: 24, upper: 24},
    gapFactor: {lower: 3, upper: 6},
    radiusFactor: {lower: 3, upper: 5},
    accentRange: {bottom: {lower: 0.05, upper: 0.15}, top: {lower: 0.25, upper: 0.5}}, //x scale factor x loop count
    blurRange: {bottom: {lower: 0, upper: 2}, top: {lower: 4, upper: 8}},
    accentTimes: {lower: 2, upper: 6},
    blurTimes: {lower: 0, upper: 0},
    stroke: 0.15,
    thickness: 0.2,
    scaleFactor: 0.9,
    numberOfHex: 12,
    strategy: ['static', 'angle', 'rotate'],
    overlayStrategy: ['flat'/*, 'overlay'*/],
}


export const generate = () => {
    const finalImageSize = getFinalImageSize();

    const data = {
        numberOfHex: config.numberOfHex,
        strategy: config.strategy[getRandomIntExclusive(0, config.strategy.length)],
        overlayStrategy: config.overlayStrategy[getRandomIntExclusive(0, config.overlayStrategy.length)],
        layerOpacity: config.layerOpacity,
        underLayerOpacity: config.underLayerOpacity,
        height: finalImageSize.height,
        width: finalImageSize.width,
        stroke: config.stroke,
        thickness: config.thickness,
        innerColor: '#00000000',
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
        color: getColorFromBucket(),
        center: {x: finalImageSize.width / 2, y: finalImageSize.height / 2},
        getInfo: () => {
            return `${hexEffect.name}: strategy: ${data.strategy} - ${data.overlayStrategy}, sparsity: ${data.sparsityFactor}, gap: ${data.gapFactor}, radius: ${data.radiusFactor}`
        }
    }

    return data;
}