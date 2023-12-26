import {getRandomIntInclusive} from "../../../core/math/random.js";
import {fuzzyRippleEffect} from "./effect.js";


export const generate = async (settings) => {

    const finalImageSize = await GlobalSettings.getFinalImageSize();

    const config = {
        invertLayers: true,
        layerOpacity: 1,
        underLayerOpacity: 0.8,
        stroke: 1,
        thickness: 2,
        largeRadius: {lower: finalImageSize.longestSide * 0.15, upper: finalImageSize.longestSide * 0.15},
        smallRadius: {lower: finalImageSize.longestSide * 0.25, upper: finalImageSize.longestSide * 0.25},
        largeNumberOfRings: {lower: 8, upper: 8},
        smallNumberOfRings: {lower: 8, upper: 8},
        ripple: {lower: finalImageSize.shortestSide * 0.10, upper: finalImageSize.shortestSide * 0.10},
        times: {lower: 2, upper: 4},
        smallerRingsGroupRadius: {lower: finalImageSize.shortestSide * 0.3, upper: finalImageSize.shortestSide * 0.3},
        accentRange: {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 6}},
        blurRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
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
        outerColor: await settings.getColorFromBucket(),
        largeRadius: getRandomIntInclusive(config.largeRadius.lower, config.largeRadius.upper),
        smallRadius: getRandomIntInclusive(config.smallRadius.lower, config.smallRadius.upper),
        largeNumberOfRings: getRandomIntInclusive(config.largeNumberOfRings.lower, config.largeNumberOfRings.upper),
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
            return `${fuzzyRippleEffect.name}: large rings: ${data.largeNumberOfRings}, small rings x6: ${data.smallNumberOfRings}, ripple: ${data.ripple}`
        }
    }

    return data;
}