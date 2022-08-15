import {getColorFromBucket, getFinalImageSize} from "../../../../core/GlobalSettings.js";
import {getRandomIntInclusive, randomNumber} from "../../../../core/math/random.js";
import {rayRingEffect} from "./effect.js";

const finalImageSize = getFinalImageSize();

const config = {
    circles: {lower: 20, upper: 30},
    radiusGap: 40,
    stroke: 1,
    thickness: 1,
    scaleFactor: 1.01,
    densityFactor: 0.90,
    accentRange: {bottom: {lower: 0, upper: 2}, top: {lower: 4, upper: 6}},
    blurRange: {bottom: {lower: 1, upper: 2}, top: {lower: 4, upper: 6}},
    accentTimes: {lower: 2, upper: 4},
    blurTimes: {lower: 2, upper: 4},
    lengthRange: {bottom: {lower: 0, upper: 0}, top: {lower: 15, upper: 60}},
    lengthTimes: {lower: 4, upper: 8},
    sparsityFactor: {lower: 5, upper: 15},
}

const getRays = (sparsityFactor) => {
    const rays = [];

    for (let i = 0; i < 360; i = i + sparsityFactor) {
        rays.push({
            length: {
                lower: getRandomIntInclusive(config.lengthRange.bottom.lower, config.lengthRange.bottom.upper),
                upper: getRandomIntInclusive(config.lengthRange.top.lower, config.lengthRange.top.upper)
            },
            lengthTimes: getRandomIntInclusive(config.lengthTimes.lower, config.lengthTimes.upper)
        });
    }

    return rays;
}

const computeInitialInfo = (num) => {
    const info = [];
    for (let i = 0; i <= num; i++) {
        info.push({
            radius: config.radiusGap * (i + 1),
            color: getColorFromBucket(),
            accentTimes: getRandomIntInclusive(config.accentTimes.lower, config.accentTimes.upper),
            accentRange: {
                lower: getRandomIntInclusive(config.accentRange.bottom.lower, config.accentRange.bottom.upper),
                upper: getRandomIntInclusive(config.accentRange.top.lower, config.accentRange.top.upper)
            },
            sparsityFactor: randomNumber(config.sparsityFactor.lower, config.sparsityFactor.upper) * (config.densityFactor / (i + 1)),
        });
    }

    for (let c = 0; c < info.length; c++) {
        info[c].rays = getRays(info[c].sparsityFactor);
    }

    return info;
}

export const generate = () => {
    const data = {
        numberOfCircles: getRandomIntInclusive(config.circles.lower, config.circles.upper),
        height: finalImageSize.height,
        width: finalImageSize.width,
        stroke: config.stroke,
        thickness: config.thickness,
        innerColor: getColorFromBucket(),
        scaleFactor: config.scaleFactor,
        center: {x: finalImageSize.width / 2, y: finalImageSize.height / 2},
        blurRange: {
            lower: getRandomIntInclusive(config.blurRange.bottom.lower, config.blurRange.bottom.upper),
            upper: getRandomIntInclusive(config.blurRange.top.lower, config.blurRange.top.upper)
        },
        blurTimes: getRandomIntInclusive(config.blurTimes.lower, config.blurTimes.upper),
        getInfo: () => {
            return `${rayRingEffect.name}: ${data.numberOfCircles} ray rings`
        }
    }

    data.circles = computeInitialInfo(data.numberOfCircles);

    return data;
}