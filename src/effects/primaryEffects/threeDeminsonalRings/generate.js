import {getRandomIntInclusive, randomNumber} from "../../../core/math/random.js";
import {threeDimensionalRingsEffect} from "./effect.js";

export const generate = async (settings) => {

    const config = {
        rings: {lower: 10, upper: 15},
        ringRadius: {lower: 0.1, upper: 0.2},
        ringGap: {lower: 5, upper: 10},
        radiusConstant: 50,
        times: {lower: 1, upper: 6},
        height: {lower: 5, upper: 10},
        ringOpacity: {lower: 0.3, upper: 0.5},
    }

    const data = {
        radiusConstant: config.radiusConstant,
        ringGap: randomNumber(config.ringGap.lower, config.ringGap.upper),
        rings: getRandomIntInclusive(config.rings.lower, config.rings.upper),
        ringRadius: randomNumber(config.ringRadius.lower, config.ringRadius.upper),
        light1: settings.getLightFromBucket(),
        light2: settings.getLightFromBucket(),
        light3: settings.getLightFromBucket(),
        getInfo: () => {
            return `${threeDimensionalRingsEffect.name}: ${data.rings} rings`
        }
    }

    const computeInitialInfo = async (rings) => {
        const info = [];
        const color = await settings.getColorFromBucket();
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

    data.ringsInstances = await computeInitialInfo(data.rings);

    return data;
}

