import {getRandomFromArray, getRandomIntInclusive, randomNumber} from "../../../core/math/random.js";
import {wireframeSpiralEffect} from "./effect.js";

export const generate = async (settings) => {
    const finalImageSize = await GlobalSettings.getFinalImageSize();

    const config = {
        layerOpacity: 0.4,
        underLayerOpacityRange: {bottom: {lower: 0.3, upper: 0.35}, top: {lower: 0.4, upper: 0.45}},
        underLayerOpacityTimes: {lower: 1, upper: 6},
        startTwistCount: {lower: 1, upper: 2},
        stroke: [0],
        thickness: [1, 2, 3],
        sparsityFactor: [30, 36, 40, 45, 60],
        speed: {lower: 4, upper: 8},
        counterClockwise: {lower: 0, upper: 1},
        unitLength: {lower: 2, upper: 6},
        unitLengthChangeConstant: [2, 4, 8],
        radiusConstant: [50, 75, 150],
        accentRange: {bottom: {lower: 0, upper: 1}, top: {lower: 0, upper: 0}},
        blurRange: {bottom: {lower: 0, upper: 0}, top: {lower: 0, upper: 0}},
        featherTimes: {lower: 0, upper: 0},
    }

    const data = {
        layerOpacity: config.layerOpacity,
        underLayerOpacityRange: {
            lower: randomNumber(config.underLayerOpacityRange.bottom.lower, config.underLayerOpacityRange.bottom.upper),
            upper: randomNumber(config.underLayerOpacityRange.top.lower, config.underLayerOpacityRange.top.upper)
        },
        underLayerOpacityTimes: getRandomIntInclusive(config.underLayerOpacityTimes.lower, config.underLayerOpacityTimes.upper),
        startTwistCount: getRandomIntInclusive(config.startTwistCount.lower, config.startTwistCount.upper),
        drawHeight: finalImageSize.height * 4,
        height: finalImageSize.height * 2,
        width: finalImageSize.width * 2,
        stroke: getRandomFromArray(config.stroke),
        thickness: getRandomFromArray(config.thickness),
        unitLength: getRandomIntInclusive(config.unitLength.lower, config.unitLength.upper),
        unitLengthChangeConstant: getRandomFromArray(config.unitLengthChangeConstant),
        sparsityFactor: getRandomFromArray(config.sparsityFactor),
        innerColor: await settings.getColorFromBucket(),
        outerColor: await settings.getColorFromBucket(),
        center: {x: finalImageSize.width * 2 / 2, y: finalImageSize.height * 2 / 2},
        speed: getRandomIntInclusive(config.speed.lower, config.speed.upper),
        counterClockwise: getRandomIntInclusive(config.counterClockwise.lower, config.counterClockwise.upper),
        radiusConstant: getRandomFromArray(config.radiusConstant),
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
            return `${wireframeSpiralEffect.name}: sparsity: ${data.sparsityFactor.toFixed(3)}, unit: ${data.unitLength}, speed: ${data.speed}, direction: ${data.counterClockwise > 0 ? 'clockwise' : 'counter'}`
        }
    }

    data.direction = data.counterClockwise ? -1 : 1;

    return data;
}
