import {getFinalImageSize, getNeutralFromBucket} from "../../../../core/GlobalSettings.js";
import {getRandomIntInclusive, randomNumber} from "../../../../core/math/random.js";
import {wireframeSpiralEffect} from "./effect.js";

const config = {
    layerOpacity: 0.5,
    underLayerOpacityRange: {bottom: {lower: 0.3, upper: 0.4}, top: {lower: 0.6, upper: 0.8}},
    underLayerOpacityTimes: {lower: 1, upper: 6},
    startTwistCount: {lower: 1, upper: 1},
    stroke: 0,
    thickness: 0.25,
    sparsityFactor: {lower: 5, upper: 10},
    speed: {lower: 1, upper: 2},
    counterClockwise: {lower: 0, upper: 1},
    unitLength: {lower: 10, upper: 10},
    unitLengthChangeConstant: 5,
    radiusConstant: 125,
    accentRange: {bottom: {lower: 0, upper: 0}, top: {lower: 1, upper: 5}},
    accentTimes: {lower: 1, upper: 4},
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
        sparsityFactor: getRandomIntInclusive(config.sparsityFactor.lower, config.sparsityFactor.upper),
        innerColor: getNeutralFromBucket(),
        outerColor: getNeutralFromBucket(),
        center: {x: finalImageSize.width * 2 / 2, y: finalImageSize.height * 2 / 2},
        speed: getRandomIntInclusive(config.speed.lower, config.speed.upper),
        counterClockwise: getRandomIntInclusive(config.counterClockwise.lower, config.counterClockwise.upper),
        radiusConstant: config.radiusConstant,
        accentRange: {
            lower: getRandomIntInclusive(config.accentRange.bottom.lower, config.accentRange.bottom.upper),
            upper: getRandomIntInclusive(config.accentRange.top.lower, config.accentRange.top.upper)
        },
        accentTimes: getRandomIntInclusive(config.accentTimes.lower, config.accentTimes.upper),
        getInfo: () => {
            return `${wireframeSpiralEffect.name}: sparsity: ${data.sparsityFactor.toFixed(3)}, unit: ${data.unitLength}, speed: ${data.speed}, direction: ${data.counterClockwise > 0 ? 'clockwise' : 'counter'}`
        }
    }

    data.direction = data.counterClockwise ? -1 : 1;

    return data;
}
