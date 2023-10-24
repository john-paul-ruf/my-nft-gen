import {getColorFromBucket, getFinalImageSize, getNeutralFromBucket} from "../../../../core/GlobalSettings.js";
import {getRandomFromArray, getRandomIntInclusive, randomNumber} from "../../../../core/math/random.js";
import {viewportEffect} from "./effect.js";


const config = {
    layerOpacity: 0.5,
    underLayerOpacity: 0.25,
    stroke: 8,
    thickness: 24,
    ampStroke: 0,
    ampThickness: 1,
    radius: [225, 250, 275],
    startAngle: [210, 270],
    ampLength: [20, 30, 40, 50],
    ampRadius: [50, 75, 100],
    sparsityFactor: [3, 4, 5, 6,],
    amplitude: {lower: 10, upper: 20},
    times: {lower: 2, upper: 4},
    accentRange: {bottom: {lower: 0, upper: 0}, top: {lower: 10, upper: 20}},
    blurRange: {bottom: {lower: 0, upper: 0}, top: {lower: 1, upper: 3}},
    featherTimes: {lower: 4, upper: 8},
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
        radius: getRandomFromArray(config.radius),
        startAngle: getRandomFromArray(config.startAngle),
        ampStroke: config.ampStroke,
        ampThickness: config.ampThickness,
        ampLength: getRandomFromArray(config.ampLength),
        ampRadius: getRandomFromArray(config.ampRadius),
        sparsityFactor: getRandomFromArray(config.sparsityFactor),
        amplitude: randomNumber(config.amplitude.lower, config.amplitude.upper),
        times: getRandomIntInclusive(config.times.lower, config.times.upper),
        color: getColorFromBucket(),
        ampInnerColor: getColorFromBucket(),
        ampOuterColor: getColorFromBucket(),
        featherTimes: getRandomIntInclusive(config.featherTimes.lower, config.featherTimes.upper),
        accentRange: {
            lower: getRandomIntInclusive(config.accentRange.bottom.lower, config.accentRange.bottom.upper),
            upper: getRandomIntInclusive(config.accentRange.top.lower, config.accentRange.top.upper)
        },
        blurRange: {
            lower: getRandomIntInclusive(config.blurRange.bottom.lower, config.blurRange.bottom.upper),
            upper: getRandomIntInclusive(config.blurRange.top.lower, config.blurRange.top.upper)
        },
        center: {x: finalImageSize.width / 2, y: finalImageSize.height / 2},
        getInfo: () => {
            return `${viewportEffect.name}: amp length:${data.ampLength}, sparsity:${data.sparsityFactor.toFixed(3)}`
        }
    }

    return data;
}