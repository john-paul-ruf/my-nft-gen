import {getRandomIntInclusive} from "../../../core/math/random.js";
import {eightEffect} from "./effect.js";

export const generate = async (settings) => {

    const finalImageSize = await GlobalSettings.getFinalImageSize();

    const config = {
        layerOpacity: 1,
        underLayerOpacity: 0.3,
        stroke: 1,
        thickness: 4,
        smallRadius: {lower: settings.finalImageSize.longestSide * 0.10, upper: settings.finalImageSize.longestSide * 0.15},
        smallNumberOfRings: {lower: 12, upper: 16},
        ripple: {lower: settings.finalImageSize.shortestSide * 0.05, upper: settings.finalImageSize.shortestSide * 0.10},
        times: {lower: 2, upper: 4},
        smallerRingsGroupRadius: {lower: settings.finalImageSize.shortestSide * 0.25, upper: settings.finalImageSize.shortestSide * 0.30},
        accentRange: {bottom: {lower: 0, upper: 0}, top: {lower: 4, upper: 8}},
        blurRange: {bottom: {lower: 0, upper: 0}, top: {lower: 1, upper: 1}},
        featherTimes: {lower: 2, upper: 4},
    }

    const data = {
        layerOpacity: config.layerOpacity,
        underLayerOpacity: config.underLayerOpacity,
        height: finalImageSize.height,
        width: finalImageSize.width,
        stroke: config.stroke,
        thickness: config.thickness,
        innerColor: await settings.getNeutralFromBucket(),
        outerColor: await settings.getColorFromBucket(),
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
        featherTimes: getRandomIntInclusive(config.featherTimes.lower, config.featherTimes.upper),
        getInfo: () => {
            return `${eightEffect.name}: ripple: ${data.ripple.toFixed(3)}`
        }
    }

    return data;
}