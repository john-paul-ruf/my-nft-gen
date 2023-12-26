import {getRandomFromArray, getRandomIntInclusive} from "../../../core/math/random.js";
import {nthRings} from "./invoke.js";

export const generate = async (settings) => {

    const finalImageSize = await GlobalSettings.getFinalImageSize();

    const config = {
        invertLayers: true,
        totalRingCount: {lower: 12, upper: 16},
        layerOpacity: 0.5,
        underLayerOpacity: 0.4,
        stroke: 2,
        thickness: 2,
        smallRadius: [finalImageSize.longestSide * 0.10, finalImageSize.longestSide * 0.1/*5, finalImageSize.longestSide * 0.2*/],
        smallNumberOfRings: {lower: 8, upper: 12},
        ripple: [finalImageSize.shortestSide * 0.05, finalImageSize.shortestSide * 0.10,/* finalImageSize.shortestSide * 0.15, finalImageSize.shortestSide * 0.20*/],
        times: {lower: 2, upper: 4},
        smallerRingsGroupRadius: [finalImageSize.shortestSide * 0.45, finalImageSize.shortestSide * 0.50, finalImageSize.shortestSide * 0.55,],
        accentRange: {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 5}},
        blurRange: {bottom: {lower: 1, upper: 1}, top: {lower: 2, upper: 4}},
        featherTimes: {lower: 2, upper: 4},
    }

    const data = {
        invertLayers: config.invertLayers,
        totalRingCount: getRandomIntInclusive(config.totalRingCount.lower, config.totalRingCount.upper),
        layerOpacity: config.layerOpacity,
        underLayerOpacity: config.underLayerOpacity,
        height: finalImageSize.height,
        width: finalImageSize.width,
        stroke: config.stroke,
        thickness: config.thickness,
        innerColor: await GlobalSettings.getFinalImageSize(),
        outerColor: await settings.getColorFromBucket(),
        smallRadius: getRandomFromArray(config.smallRadius),
        smallNumberOfRings: getRandomIntInclusive(config.smallNumberOfRings.lower, config.smallNumberOfRings.upper),
        ripple: getRandomFromArray(config.ripple),
        smallerRingsGroupRadius: getRandomFromArray(config.smallerRingsGroupRadius),
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
            return `${nthRings.name}: ${data.totalRingCount} ring groups, ripple: ${data.ripple.toFixed(2)}`
        }
    }

    return data;
}