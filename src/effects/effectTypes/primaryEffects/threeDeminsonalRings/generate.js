import {getColorFromBucket, getLightFromBucket} from "../../../../core/GlobalSettings.js";
import {getRandomIntInclusive, randomNumber} from "../../../../core/math/random.js";
import {threeDimensionalRingsEffect} from "./effect.js";

const config = {
    rings: {lower: 5, upper: 10},
    ringRadius: {lower: 0.5, upper: 1.5},
    ringGap: {lower: 5, upper: 10},
    radiusConstant: 100,
    times: {lower: 1, upper: 4},
    height: {lower: 10, upper: 30},
}

const computeInitialInfo = (rings) => {
    const info = [];
    for (let i = 0; i <= rings; i++) {
        info.push({
            times: getRandomIntInclusive(config.times.lower, config.times.upper),
            height: getRandomIntInclusive(config.height.lower, config.height.upper),
            initialRotation: getRandomIntInclusive(0, 360),
            color: getColorFromBucket(),
            emissive: getColorFromBucket(),
            specular: getColorFromBucket(),
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
        light: getLightFromBucket(),
        getInfo: () => {
            return `${threeDimensionalRingsEffect.name}: ${data.rings} rings`
        }
    }

    data.ringsInstances = computeInitialInfo(data.rings);

    return data;
}

