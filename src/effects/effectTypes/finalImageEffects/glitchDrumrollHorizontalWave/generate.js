import {glitchDrumrollHorizontalWaveEffect} from "./effect.js";
import {getFinalImageSize} from "../../../../core/GlobalSettings.js";
import {getRandomIntInclusive} from "../../../../core/math/random.js";

const config = {
    glitchChance: 75,
    glitchOffset: {lower: 20, upper: 40},
    glitchOffsetTimes: {lower: 2, upper: 6},
}

export const generate = () => {

    const finalImageSize = getFinalImageSize();

    const getRoll = () => {

        const results = [];

        for (let x = 0; x < finalImageSize.width; x++) {
            results.push(Math.random());
        }
        return results;
    }

    const data = {
        glitchChance: config.glitchChance,
        glitchOffset: getRandomIntInclusive(config.glitchOffset.lower, config.glitchOffset.upper),
        glitchOffsetTimes: getRandomIntInclusive(config.glitchOffsetTimes.lower, config.glitchOffsetTimes.upper),
        roll: getRoll(),
        getInfo: () => {
            return `${glitchDrumrollHorizontalWaveEffect.name} ${data.glitchChance} chance, ${data.glitchModulus} modulus`
        }
    }

    return data;
}