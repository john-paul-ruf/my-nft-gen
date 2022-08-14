import {getColorFromBucket, getFinalImageSize} from "../../../logic/core/gobals.js";
import {getRandomIntInclusive} from "../../../logic/math/random.js";
import {wireframeSpiralEffect} from "./wireframe-spiral.js";

const config = {
    stroke: 0.5,
    sparsityFactor: {lower: 1, upper: 3},
    speed: {lower: 2, upper: 5},
    counterClockwise: {lower: 0, upper: 1},
    unitLength: {lower: 1, upper: 5},
    radiusConstant: 75,
}

export const generate = () => {
    const finalImageSize = getFinalImageSize();

    const data = {
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
        getInfo: () => {
            return `${wireframeSpiralEffect.name}: sparsity: ${data.sparsityFactor.toFixed(3)}, unit: ${data.unitLength}, speed: ${data.speed}, direction: ${data.counterClockwise > 0 ? 'clockwise' : 'counter'}`
        }
    }

    return data;
}
