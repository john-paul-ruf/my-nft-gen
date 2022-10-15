import {getColorFromBucket, getFinalImageSize} from "../../../../core/GlobalSettings.js";
import {getRandomIntInclusive, randomNumber} from "../../../../core/math/random.js";
import {wireframeSpiralEffect} from "./effect.js";

const config = {
    layerOpacity: 0.5,
    underLayerOpacityRange: {bottom: {lower: 0.1, upper: 0.2}, top: {lower: 0.3, upper: 0.4}},
    underLayerOpacityTimes: {lower: 1, upper: 6},
    stroke: 1,
    sparsityFactor: {lower: 1, upper: 3},
    speed: {lower: 5, upper: 10},
    counterClockwise: {lower: 0, upper: 1},
    unitLength: {lower: 10, upper: 30},
    radiusConstant: 75,
    accentRange: {bottom: {lower: 0, upper: 0}, top: {lower: 3, upper: 5}},
    accentTimes: {lower: 2, upper: 4},
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
        height: finalImageSize.height * 1.3,
        width: finalImageSize.width * 1.3,
        stroke: config.stroke,
        unitLength: getRandomIntInclusive(config.unitLength.lower, config.unitLength.upper),
        sparsityFactor: getRandomIntInclusive(config.sparsityFactor.lower, config.sparsityFactor.upper),
        color1: getColorFromBucket(),
        color2: getColorFromBucket(),
        center: {x: finalImageSize.width * 1.3 / 2, y: finalImageSize.height * 1.3 / 2},
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
