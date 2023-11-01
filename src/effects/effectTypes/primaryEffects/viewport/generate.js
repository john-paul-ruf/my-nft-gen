import {getColorFromBucket, getFinalImageSize, getNeutralFromBucket} from "../../../../core/GlobalSettings.js";
import {getRandomFromArray, getRandomIntInclusive, randomNumber} from "../../../../core/math/random.js";
import {viewportEffect} from "./effect.js";


const config = {
    invertLayers: true,
    layerOpacity: 1,
    underLayerOpacity: 0.8,
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
    accentRange: {bottom: {lower: 0, upper: 0}, top: {lower: 40, upper: 70}},
    blurRange: {bottom: {lower: 1, upper: 3}, top: {lower: 6, upper: 9}},
    featherTimes: {lower: 2, upper: 6},
}

export const generate = () => {

    const finalImageSize = getFinalImageSize();

    const data = {
        invertLayers: config.invertLayers,
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