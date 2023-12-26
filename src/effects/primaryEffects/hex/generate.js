import {
    getRandomFromArray, getRandomIntExclusive, getRandomIntInclusive, randomNumber
} from "../../../core/math/random.js";
import {hexEffect} from "./effect.js";
import {GlobalSettings} from "../../../core/GlobalSettings.js";

export const generate = async (settings) => {
    const finalImageSize = GlobalSettings.getFinalImageSize();

    const config = {
        layerOpacity: 1,
        underLayerOpacity: 0.8,
        sparsityFactor: [12, 15, 18,/* 20, 24, 30, 36*/],
        gapFactor: {lower: 3, upper: 6},
        radiusFactor: {lower: 1, upper: 3},
        accentRange: {bottom: {lower: 0, upper: 0}, top: {lower: 0.75, upper: 1.5}},
        blurRange: {bottom: {lower: 0, upper: 1}, top: {lower: 2, upper: 3}},
        featherTimes: {lower: 2, upper: 4},
        stroke: 1,
        thickness: 0.5,
        scaleFactor: 0.5,
        numberOfHex: 12,
        strategy: ['static', 'angle', 'rotate'],
        overlayStrategy: ['flat', 'overlay'],
    }

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
        innerColor: await settings.getNeutralFromBucket(),
        color: await settings.getColorFromBucket(),
        scaleFactor: config.scaleFactor,
        sparsityFactor: getRandomFromArray(config.sparsityFactor),
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
        featherTimes: getRandomIntInclusive(config.featherTimes.lower, config.featherTimes.upper),
        center: {x: finalImageSize.width / 2, y: finalImageSize.height / 2},
        getInfo: () => {
            return `${hexEffect.name}: strategy: ${data.strategy} - ${data.overlayStrategy}, sparsity: ${data.sparsityFactor}, gap: ${data.gapFactor}, radius: ${data.radiusFactor}`
        }
    }

    return data;
}