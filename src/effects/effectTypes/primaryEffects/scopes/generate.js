import {getColorFromBucket, getFinalImageSize} from "../../../../core/GlobalSettings.js";
import {getRandomFromArray, getRandomIntInclusive, randomNumber} from "../../../../core/math/random.js";
import {scopesEffect} from "./effect.js";

const finalImageSize = getFinalImageSize();

const config = {
    layerOpacity: 1,
    sparsityFactor: [1, 2, 3, 4, 5, 6, 8, 9, 10],
    gapFactor: {lower: 0.2, upper: 0.4},
    radiusFactor: {lower: 0.1, upper: 0.2},
    scaleFactor: 1.2,
    alphaRange: {bottom: {lower: 0.8, upper: 0.85}, top: {lower: 0.95, upper: 1}},
    alphaTimes: {lower: 2, upper: 8},
    rotationTimes: {lower: 0, upper: 0},
    numberOfScopesInALine: 40,
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
        sparsityFactor: getRandomFromArray(config.sparsityFactor),
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