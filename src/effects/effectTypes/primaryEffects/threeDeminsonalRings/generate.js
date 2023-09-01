import {getColorFromBucket, getLightFromBucket} from "../../../../core/GlobalSettings.js";
import {getRandomIntInclusive, randomNumber} from "../../../../core/math/random.js";
import {threeDimensionalRingsEffect} from "./effect.js";

const config = {
    rings: {lower: 10, upper: 15},
    ringRadius: {lower: 0.1, upper: 0.2},
    ringGap: {lower: 5, upper: 10},
    radiusConstant: 50,
    times: {lower: 1, upper: 6},
    height: {lower: 5, upper: 10},
    ringOpacity: {lower: 0.3, upper: 0.5},
}

const computeInitialInfo = (rings) => {
    const info = [];
    const color = getColorFromBucket();
    for (let i = 0; i <= rings; i++) {
        info.push({
            times: getRandomIntInclusive(config.times.lower, config.times.upper),
            height: getRandomIntInclusive(config.height.lower, config.height.upper),
            ringOpacity: randomNumber(config.ringOpacity.lower, config.ringOpacity.upper),
            initialRotation: getRandomIntInclusive(0, 360),
            color: color,
            emissive: color,
            specular: color,
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
        light1: getLightFromBucket(),
        light2: getLightFromBucket(),
        light3: getLightFromBucket(),
        getInfo: () => {
            return `${threeDimensionalRingsEffect.name}: ${data.rings} rings`
        }
    }

    data.ringsInstances = computeInitialInfo(data.rings);

    return data;
}

