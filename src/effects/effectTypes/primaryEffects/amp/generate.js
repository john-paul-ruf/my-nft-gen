import {getColorFromBucket, getFinalImageSize} from "../../../../core/GlobalSettings.js";
import {getRandomIntInclusive, randomNumber} from "../../../../core/math/random.js";
import {ampEffect} from "./effect.js";

const finalImageSize = getFinalImageSize();

const config = {
    sparsityFactor: {lower: 2, upper: 5},
    stroke: 1,
    accentRange: {bottom: {lower: 0, upper: 0}, top: {lower: 4, upper: 8}},
    accentTimes: {lower: 5, upper: 10},
    speed: {lower: 15, upper: 30},
}

export const generate = () => {
    const data = {
        sparsityFactor: randomNumber(config.sparsityFactor.lower, config.sparsityFactor.upper),
        height: finalImageSize.height,
        width: finalImageSize.width,
        stroke: config.stroke,
        color: getColorFromBucket(),
        innerColor: getColorFromBucket(),
        length: 200,
        lineStart: 150,
        center: {x: finalImageSize.width / 2, y: finalImageSize.height / 2},
        accentRange: {
            lower: getRandomIntInclusive(config.accentRange.bottom.lower, config.accentRange.bottom.upper),
            upper: getRandomIntInclusive(config.accentRange.top.lower, config.accentRange.top.upper)
        },
        accentTimes: getRandomIntInclusive(config.accentTimes.lower, config.accentTimes.upper),
        speed: getRandomIntInclusive(config.speed.lower, config.speed.upper),
        getInfo: () => {
            return `${ampEffect.name}: sparsity factor: ${data.sparsityFactor.toFixed(3)}`
        }
    }

    return data;
}