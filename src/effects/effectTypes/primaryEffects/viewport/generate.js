import {getColorFromBucket, getFinalImageSize, getNeutralFromBucket} from "../../../../core/GlobalSettings.js";
import {getRandomIntInclusive, randomNumber} from "../../../../core/math/random.js";
import {viewportEffect} from "./effect.js";


const config = {
    layerOpacity: 0.5,
    underLayerOpacity: 0.25,
    stroke: 4,
    thickness: 12,
    ampStroke: 1,
    ampThickness: 0,
    radius: {lower: 150, upper: 200},
    ampLength: {lower: 125, upper: 175},
    ampRadius: {lower: 25, upper: 50},
    sparsityFactor: {lower: 3, upper: 6},
    amplitude: {lower: 10, upper: 20},
    times: {lower: 2, upper: 4},
    accentRange: {bottom: {lower: 0, upper: 0}, top: {lower: 2, upper: 4}},
    blurRange: {bottom: {lower: 0, upper: 0}, top: {lower: 4, upper: 8}},
    accentTimes: {lower: 4, upper: 8},
    blurTimes: {lower: 4, upper: 8},
}

export const generate = () => {

    const finalImageSize = getFinalImageSize();

    const data = {
        layerOpacity: config.layerOpacity,
        underLayerOpacity: config.underLayerOpacity,
        height: finalImageSize.height,
        width: finalImageSize.width,
        stroke: config.stroke,
        thickness: config.thickness,
        innerColor: getNeutralFromBucket(),
        radius: getRandomIntInclusive(config.radius.lower, config.radius.upper),
        ampStroke: config.ampStroke,
        ampThickness: config.ampThickness,
        ampLength: getRandomIntInclusive(config.ampLength.lower, config.ampLength.upper),
        ampRadius: getRandomIntInclusive(config.ampRadius.lower, config.ampRadius.upper),
        sparsityFactor: randomNumber(config.sparsityFactor.lower, config.sparsityFactor.upper),
        amplitude: randomNumber(config.amplitude.lower, config.amplitude.upper),
        times: getRandomIntInclusive(config.times.lower, config.times.upper),
        color: getColorFromBucket(),
        ampInnerColor: getColorFromBucket(),
        ampOuterColor: getColorFromBucket(),
        accentTimes: getRandomIntInclusive(config.accentTimes.lower, config.accentTimes.upper),
        accentRange: {
            lower: getRandomIntInclusive(config.accentRange.bottom.lower, config.accentRange.bottom.upper),
            upper: getRandomIntInclusive(config.accentRange.top.lower, config.accentRange.top.upper)
        },
        blurRange: {
            lower: getRandomIntInclusive(config.blurRange.bottom.lower, config.blurRange.bottom.upper),
            upper: getRandomIntInclusive(config.blurRange.top.lower, config.blurRange.top.upper)
        },
        blurTimes: getRandomIntInclusive(config.blurTimes.lower, config.blurTimes.upper),
        center: {x: finalImageSize.width / 2, y: finalImageSize.height / 2},
        getInfo: () => {
            return `${viewportEffect.name}: amp length:${data.ampLength}, sparsity:${data.sparsityFactor.toFixed(3)}`
        }
    }

    return data;
}