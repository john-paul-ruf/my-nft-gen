import {getColorFromBucket} from "../../../../core/GlobalSettings.js";
import {getRandomIntInclusive, randomNumber} from "../../../../core/math/random.js";
import {threeDimensionalRingsEffect} from "./effect.js";

const config = {
    rings: {lower: 10, upper: 20},
    ringRadius: {lower: 0.5, upper: 1.5},
    ringGap: {lower: 5, upper: 10},
    radiusConstant: 100,
    times: {lower: 1, upper: 3},
    counterClockwise: {lower: 0, upper: 1},
}

const computeInitialInfo = (rings) => {
    const info = [];
    for (let i = 0; i <= rings; i++) {
        info.push({
            times: getRandomIntInclusive(config.times.lower, config.times.upper),
            initialRotation: getRandomIntInclusive(0, 360),
        });
    }
    return info;
}

export const generate = () => {

    const data = {
        radiusConstant: config.radiusConstant,
        ringGap: randomNumber(config.ringGap.lower, config.ringGap.upper),
        rings: getRandomIntInclusive(config.rings.lower, config.rings.upper),
        ringRadius: randomNumber(config.ringRadius.lower, config.ringRadius.upper),
        counterClockwise: getRandomIntInclusive(config.counterClockwise.lower, config.counterClockwise.upper),
        color: getColorFromBucket(),
        emissive: getColorFromBucket(),
        specular: getColorFromBucket(),
        light: getColorFromBucket(),
        getInfo: () => {
            return `${threeDimensionalRingsEffect.name}: ${data.rings} rings`
        }
    }

    data.ringsInstances = computeInitialInfo(data.rings);

    return data;
}

