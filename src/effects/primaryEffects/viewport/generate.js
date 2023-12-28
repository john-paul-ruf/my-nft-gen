import {getRandomFromArray, getRandomIntInclusive, randomNumber} from "../../../core/math/random.js";
import {viewportEffect} from "./effect.js";
import {GlobalSettings} from "../../../core/GlobalSettings.js";

export const generate = async (settings) => {

    const finalImageSize = GlobalSettings.getFinalImageSize();

    const config = {
        invertLayers: true,
        layerOpacity: 1,
        underLayerOpacity: 0.8,
        stroke: 2,
        thickness: 18,
        ampStroke: 0,
        ampThickness: 1,
        radius: [350],
        startAngle: [270],
        ampLength: [/*20, 30, 40,*/ 50, 75, 100],
        ampRadius: [50, 75, 100],
        sparsityFactor: [3, 4, 5, 6,],
        amplitude: {lower: 210, upper: 210},
        times: {lower: 2, upper: 4},
        accentRange: {bottom: {lower: 0, upper: 0}, top: {lower: 20, upper: 30}},
        blurRange: {bottom: {lower: 2, upper: 3}, top: {lower: 5, upper: 8}},
        featherTimes: {lower: 2, upper: 4},
    }

    const data = {
        invertLayers: config.invertLayers,
        layerOpacity: config.layerOpacity,
        underLayerOpacity: config.underLayerOpacity,
        height: finalImageSize.height,
        width: finalImageSize.width,
        stroke: config.stroke,
        thickness: config.thickness,
        innerColor: await settings.getNeutralFromBucket(),
        radius: getRandomFromArray(config.radius),
        startAngle: getRandomFromArray(config.startAngle),
        ampStroke: config.ampStroke,
        ampThickness: config.ampThickness,
        ampLength: getRandomFromArray(config.ampLength),
        ampRadius: getRandomFromArray(config.ampRadius),
        sparsityFactor: getRandomFromArray(config.sparsityFactor),
        amplitude: randomNumber(config.amplitude.lower, config.amplitude.upper),
        times: getRandomIntInclusive(config.times.lower, config.times.upper),
        color: await settings.getColorFromBucket(),
        ampInnerColor: await settings.getColorFromBucket(),
        ampOuterColor: await settings.getColorFromBucket(),
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
            return `${viewportEffect.name}: start angle ${data.startAngle}`
        }
    }

    return data;
}