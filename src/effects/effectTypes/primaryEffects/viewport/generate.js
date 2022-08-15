import {getColorFromBucket, getFinalImageSize} from "../../../../core/GlobalSettings.js";
import {getRandomIntInclusive, randomNumber} from "../../../../core/math/random.js";
import {viewportEffect} from "./effect.js";


const config = {
    stroke: 0.5,
    thickness: 1,
    ampStroke: 0.5,
    ampThickness: 1,
    radius: {lower: 150, upper: 300},
    ampLength: {lower: 75, upper: 150},
    ampRadius: {lower: 50, upper: 150},
    sparsityFactor: {lower: 2, upper: 5},
    amplitude: {lower: 20, upper: 50},
    times: {lower: 2, upper: 4},
    accentRange: {bottom: {lower: 0, upper: 1}, top: {lower: 2, upper: 3}},
    blurRange: {bottom: {lower: 0, upper: 1}, top: {lower: 2, upper: 3}},
    accentTimes: {lower: 2, upper: 4},
    blurTimes: {lower: 2, upper: 4},
}

export const generate = () => {

    const finalImageSize = getFinalImageSize();

    const data = {
        height: finalImageSize.height,
        width: finalImageSize.width,
        stroke: config.stroke,
        thickness: config.thickness,
        innerColor: getColorFromBucket(),
        radius: getRandomIntInclusive(config.radius.lower, config.radius.upper),
        ampStroke: config.ampStroke,
        ampThickness: config.ampThickness,
        ampLength: getRandomIntInclusive(config.ampLength.lower, config.ampLength.upper),
        ampRadius: getRandomIntInclusive(config.ampRadius.lower, config.ampRadius.upper),
        sparsityFactor: randomNumber(config.sparsityFactor.lower, config.sparsityFactor.upper),
        amplitude: randomNumber(config.amplitude.lower, config.amplitude.upper),
        times: getRandomIntInclusive(config.times.lower, config.times.upper),
        color: getColorFromBucket(),
        ampInnerColor: getColorFromBucket(),
        ampOuterColor: getColorFromBucket(),
        accentTimes: getRandomIntInclusive(config.accentTimes.lower, config.accentTimes.upper),
        accentRange: {
            lower: getRandomIntInclusive(config.accentRange.bottom.lower, config.accentRange.bottom.upper),
            upper: getRandomIntInclusive(config.accentRange.top.lower, config.accentRange.top.upper)
        },
        blurRange: {
            lower: getRandomIntInclusive(config.blurRange.bottom.lower, config.blurRange.bottom.upper),
            upper: getRandomIntInclusive(config.blurRange.top.lower, config.blurRange.top.upper)
        },
        blurTimes: getRandomIntInclusive(config.blurTimes.lower, config.blurTimes.upper),
        center: {x: finalImageSize.width / 2, y: finalImageSize.height / 2},
        getInfo: () => {
            return `${viewportEffect.name}: amp length:${data.ampLength}, sparsity:${data.sparsityFactor.toFixed(3)}`
        }
    }

    return data;
}