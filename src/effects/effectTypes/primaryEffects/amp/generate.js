import {getColorFromBucket, getFinalImageSize} from "../../../../core/GlobalSettings.js";
import {getRandomIntInclusive} from "../../../../core/math/random.js";
import {ampEffect} from "./effect.js";

const finalImageSize = getFinalImageSize();

const config = {
    layerOpacity: 0.75,
    underLayerOpacity: 0.25,
    sparsityFactor: {lower: 2, upper: 4},
    stroke: 0,
    thickness: 1,
    accentRange: {bottom: {lower: 0, upper: 0}, top: {lower: 5, upper: 15}},
    blurRange: {bottom: {lower: 0, upper: 2}, top: {lower: 6, upper: 8}},
    featherTimes: {lower: 2, upper: 8},
    speed: {lower: 12, upper: 24},
}

export const generate = () => {
    const data = {
        layerOpacity: config.layerOpacity,
        underLayerOpacity: config.underLayerOpacity,
        sparsityFactor: getRandomIntInclusive(config.sparsityFactor.lower, config.sparsityFactor.upper),
        height: finalImageSize.height,
        width: finalImageSize.width,
        stroke: config.stroke,
        thickness: config.thickness,
        innerColor: getColorFromBucket(),
        outerColor: getColorFromBucket(),
        length: 125,
        lineStart: 200,
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
        speed: getRandomIntInclusive(config.speed.lower, config.speed.upper),
        getInfo: () => {
            return `${ampEffect.name}: sparsity factor: ${data.sparsityFactor.toFixed(3)}`
        }
    }

    return data;
}