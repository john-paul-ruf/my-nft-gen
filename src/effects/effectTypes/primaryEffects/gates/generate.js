import {getRandomIntExclusive, getRandomIntInclusive} from "../../../../core/math/random.js";
import {getColorFromBucket, getFinalImageSize, getNeutralFromBucket,} from "../../../../core/GlobalSettings.js";
import {gatesEffect} from "./effect.js";

const config = {
    layerOpacity: 0.5,
    underLayerOpacity: 0.25,
    gates: {lower: 5, upper: 10},
    numberOfSides: {lower: 8, upper: 8},
    thickness: 16,
    stroke: 3,
    accentRange: {bottom: {lower: 0, upper: 0}, top: {lower: 5, upper: 10}},
    blurRange: {bottom: {lower: 0, upper: 0}, top: {lower: 4, upper: 8}},
    accentTimes: {lower: 4, upper: 12},
    blurTimes: {lower: 4, upper: 12},
}

const finalImageSize = getFinalImageSize();

const computeInitialInfo = (num) => {
    const info = [];
    for (let i = 0; i <= num; i++) {
        info.push({
            radius: getRandomIntExclusive(finalImageSize.longestSide * 0.05, finalImageSize.longestSide * 0.6),
            color: getColorFromBucket(),
            accentRange: {
                lower: getRandomIntInclusive(config.accentRange.bottom.lower, config.accentRange.bottom.upper),
                upper: getRandomIntInclusive(config.accentRange.top.lower, config.accentRange.top.upper)
            },
            accentTimes: getRandomIntInclusive(config.accentTimes.lower, config.accentTimes.upper),
            startingAngle: ((360 / num) * i),
        });
    }
    return info;
}

export const generate = () => {
    const data = {
        layerOpacity: config.layerOpacity,
        underLayerOpacity: config.underLayerOpacity,
        numberOfGates: getRandomIntInclusive(config.gates.lower, config.gates.upper),
        numberOfSides: getRandomIntInclusive(config.numberOfSides.lower, config.numberOfSides.upper),
        height: finalImageSize.height,
        width: finalImageSize.width,
        thickness: config.thickness,
        stroke: config.stroke,
        innerColor: getNeutralFromBucket(),
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

    data.gates = computeInitialInfo(data.numberOfGates);

    return data;
}