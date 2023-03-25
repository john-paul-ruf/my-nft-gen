import {getColorFromBucket, getFinalImageSize} from "../../../../core/GlobalSettings.js";
import {getRandomIntInclusive, randomNumber} from "../../../../core/math/random.js";
import {scopesEffect} from "./effect.js";

const finalImageSize = getFinalImageSize();

const config = {
    layerOpacity: 1,
    sparsityFactor: {lower: 12, upper: 12},
    gapFactor: {lower: 1, upper: 2},
    radiusFactor: {lower: 1, upper: 3},
    scaleFactor: 2.5,
    alphaRange: {bottom: {lower: 0.1, upper: 0.2}, top: {lower: 0.5, upper: 0.6}},
    alphaTimes: {lower: 1, upper: 6},
    rotationTimes: {lower: 1, upper: 6},
    numberOfScopesInALine: 30,
}

function getHexLine(sparsityFactor, info, i) {
    for (let a = 0; a < 360; a = a + sparsityFactor) {
        info.push({
            loopCount: i + 1,
            angle: a,
            alphaRange: {
                lower: randomNumber(config.alphaRange.bottom.lower, config.alphaRange.bottom.upper),
                upper: randomNumber(config.alphaRange.top.lower, config.alphaRange.top.upper)
            },
            alphaTimes: getRandomIntInclusive(config.alphaTimes.lower, config.alphaTimes.upper),
            rotationTimes: getRandomIntInclusive(config.rotationTimes.lower, config.rotationTimes.upper),
            color: getColorFromBucket(),
        });
    }
}

const computeInitialInfo = (sparsityFactor) => {
    const info = [];
    for (let i = 0; i < config.numberOfScopesInALine; i++) {
        getHexLine(sparsityFactor, info, i);
    }
    return info;
}

export const generate = () => {
    const data = {
        layerOpacity: config.layerOpacity,
        height: finalImageSize.height,
        width: finalImageSize.width,
        sparsityFactor: randomNumber(config.sparsityFactor.lower, config.sparsityFactor.upper),
        gapFactor: randomNumber(config.gapFactor.lower, config.gapFactor.upper),
        radiusFactor: randomNumber(config.radiusFactor.lower, config.radiusFactor.upper),
        scaleFactor: config.scaleFactor,
        center: {x: finalImageSize.width / 2, y: finalImageSize.height / 2},
        getInfo: () => {
            return `${scopesEffect.name}: sparsityFactor: ${data.sparsityFactor.toFixed(3)}, gapFactor: ${data.gapFactor.toFixed(3)}, radiusFactor: ${data.radiusFactor.toFixed(3)}`
        }
    }

    data.scopes = computeInitialInfo(data.sparsityFactor);

    return data;
}