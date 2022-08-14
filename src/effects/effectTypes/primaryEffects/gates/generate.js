import {getRandomIntExclusive, getRandomIntInclusive} from "../../../../core/math/random.js";
import {getColorFromBucket, getFinalImageSize,} from "../../../../core/GlobalSettings.js";
import {gatesEffect} from "./gates.js";

const config = {
    gates: {lower: 5, upper: 11},
    numberOfSides: {lower: 4, upper: 8},
    thickness: 2,
    stroke: 0.5,
    accentRange: {bottom: {lower: 0, upper: 2}, top: {lower: 4, upper: 6}},
    blurRange: {bottom: {lower: 1, upper: 2}, top: {lower: 4, upper: 6}},
    accentTimes: {lower: 3, upper: 6},
    blurTimes: {lower: 3, upper: 6},
}

const finalImageSize = getFinalImageSize();

const computeInitialInfo = (num, width) => {
    const info = [];
    for (let i = 0; i <= num; i++) {
        info.push({
            radius: getRandomIntExclusive(0, width / 2),
            color: getColorFromBucket(),
            accentRange: {
                lower: getRandomIntInclusive(config.accentRange.bottom.lower, config.accentRange.bottom.upper),
                upper: getRandomIntInclusive(config.accentRange.top.lower, config.accentRange.top.upper)
            },
            accentTimes: getRandomIntInclusive(config.accentTimes.lower, config.accentTimes.upper),
        });
    }
    return info;
}

export const generate = () => {
    const data = {
        numberOfGates: getRandomIntInclusive(config.gates.lower, config.gates.upper),
        numberOfSides: getRandomIntInclusive(config.numberOfSides.lower, config.numberOfSides.upper),
        height: finalImageSize.height,
        width: finalImageSize.width,
        thickness: config.thickness,
        stroke: config.stroke,
        innerColor: getColorFromBucket(),
        center: {x: finalImageSize.width / 2, y: finalImageSize.height / 2},
        blurRange: {
            lower: getRandomIntInclusive(config.blurRange.bottom.lower, config.blurRange.bottom.upper),
            upper: getRandomIntInclusive(config.blurRange.top.lower, config.blurRange.top.upper)
        },
        blurTimes: getRandomIntInclusive(config.blurTimes.lower, config.blurTimes.upper),
        getInfo: () => {
            return `${gatesEffect.name}: ${data.numberOfGates} gates`
        }
    }

    data.gates = computeInitialInfo(data.numberOfGates, data.width);

    return data;
}