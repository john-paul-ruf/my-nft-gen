import {getColorFromBucket, getLightFromBucket} from "../../../../core/GlobalSettings.js";
import {getRandomIntInclusive, randomNumber} from "../../../../core/math/random.js";
import {threeDimensionalRingsEffect} from "./effect.js";

const config = {
    rings: {lower: 40, upper: 60},
    ringRadius: {lower: 0.5, upper: 1.5},
    ringGap: {lower: 5, upper: 10},
    radiusConstant: 100,
    times: {lower: 1, upper: 3},
    height: {lower: 5, upper: 10},
    ringOpacity: {lower: 0.2, upper: 0.6},
}

const computeInitialInfo = (rings) => {
    const info = [];
    for (let i = 0; i <= rings; i++) {
        info.push({
            times: getRandomIntInclusive(config.times.lower, config.times.upper),
            height: getRandomIntInclusive(config.height.lower, config.height.upper),
            ringOpacity: randomNumber(config.ringOpacity.lower, config.ringOpacity.upper),
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

