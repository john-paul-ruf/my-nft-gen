import {getColorFromBucket, getFinalImageSize} from "../../../../core/GlobalSettings.js";
import {GetRandomFromArray, getRandomIntInclusive, randomNumber} from "../../../../core/math/random.js";
import {wireframeSpiralEffect} from "./effect.js";

const config = {
    layerOpacity: 0.4,
    underLayerOpacityRange: {bottom: {lower: 0.2, upper: 0.25}, top: {lower: 0.3, upper: 0.35}},
    underLayerOpacityTimes: {lower: 1, upper: 6},
    startTwistCount: {lower: 1, upper: 1},
    stroke: 0,
    thickness: 1,
    sparsityFactor: [1, 2, 3, 4, 5, 6, 8, 9, 10],
    speed: {lower: 1, upper: 8},
    counterClockwise: {lower: 0, upper: 1},
    unitLength: {lower: 1, upper: 3},
    unitLengthChangeConstant: 5,
    radiusConstant: 50,
    accentRange: {bottom: {lower: 0, upper: 0}, top: {lower: 1, upper: 5}},
    blurRange: {bottom: {lower: 0, upper: 0}, top: {lower: 1, upper: 2}},
    featherTimes: {lower: 1, upper: 4},
}

export const generate = () => {
    const finalImageSize = getFinalImageSize();

    const data = {
        layerOpacity: config.layerOpacity,
        underLayerOpacityRange: {
            lower: randomNumber(config.underLayerOpacityRange.bottom.lower, config.underLayerOpacityRange.bottom.upper),
            upper: randomNumber(config.underLayerOpacityRange.top.lower, config.underLayerOpacityRange.top.upper)
        },
        underLayerOpacityTimes: getRandomIntInclusive(config.underLayerOpacityTimes.lower, config.underLayerOpacityTimes.upper),
        startTwistCount: getRandomIntInclusive(config.startTwistCount.lower, config.startTwistCount.upper),
        height: finalImageSize.height * 2,
        width: finalImageSize.width * 2,
        stroke: config.stroke,
        thickness: config.thickness,
        unitLength: getRandomIntInclusive(config.unitLength.lower, config.unitLength.upper),
        unitLengthChangeConstant: config.unitLengthChangeConstant,
        sparsityFactor: GetRandomFromArray(config.sparsityFactor),
        innerColor: getColorFromBucket(),
        outerColor: getColorFromBucket(),
        center: {x: finalImageSize.width * 2 / 2, y: finalImageSize.height * 2 / 2},
        speed: getRandomIntInclusive(config.speed.lower, config.speed.upper),
        counterClockwise: getRandomIntInclusive(config.counterClockwise.lower, config.counterClockwise.upper),
        radiusConstant: config.radiusConstant,
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
