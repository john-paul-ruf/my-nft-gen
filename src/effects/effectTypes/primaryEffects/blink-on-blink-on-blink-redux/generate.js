import {fileURLToPath} from "url";
import path from "path";
import {blinkOnEffect} from "./effect.js";
import {getFinalImageSize} from "../../../../core/GlobalSettings.js";
import {getRandomIntInclusive} from "../../../../core/math/random.js";

const finalImageSize = getFinalImageSize();

const config = {
    layerOpacity: 0.75,
    numberOfBlinks: {lower: 2, upper: 4},
    rotationSpeedRange: {lower: 0, upper: 2},
    counterClockwise: {lower: 0, upper: 1},
    diameterRange: {lower: finalImageSize.longestSide * 0.1, upper: finalImageSize.longestSide * 0.9},
    glowLowerRange: {lower: -24, upper: -6},
    glowUpperRange: {lower: 6, upper: 24},
    glowTimes: {lower: 1, upper: 6},
}

const computeInitialInfo = (num) => {
    const info = [];
    for (let i = 0; i <= num; i++) {
        info.push({
            rotationSpeedRange: getRandomIntInclusive(config.rotationSpeedRange.lower, config.rotationSpeedRange.upper),
            counterClockwise: getRandomIntInclusive(config.counterClockwise.lower, config.counterClockwise.upper),
            diameter: getRandomIntInclusive(config.diameterRange.lower, config.diameterRange.upper),
            glowLowerRange: getRandomIntInclusive(config.glowLowerRange.lower, config.glowLowerRange.upper),
            glowUpperRange: getRandomIntInclusive(config.glowUpperRange.lower, config.glowUpperRange.upper),
            glowTimes: getRandomIntInclusive(config.glowTimes.lower, config.glowTimes.upper),
        });
    }
    return info;
}

export const generate = () => {
    const data = {
        blinkFile: path.join(fileURLToPath(import.meta.url).replace('generate.js', '') + 'blink.png'),
        layerOpacity: config.layerOpacity,
        numberOfBlinks: getRandomIntInclusive(config.numberOfBlinks.lower, config.numberOfBlinks.upper),
        getInfo: () => {
            return `${blinkOnEffect.name}: ${data.numberOfBlinks} blinks`
        }
    }

    data.blinkArray = computeInitialInfo(data.numberOfBlinks);

    return data;
}
