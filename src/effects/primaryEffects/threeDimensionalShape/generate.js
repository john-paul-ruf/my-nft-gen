import {getRandomIntInclusive} from "../../../core/math/random.js";
import {threeDimensionalShapeEffect} from "./effect.js";

export const generate = async (settings) => {

    const config = {
        times: {lower: 1, upper: 2},
        counterClockwise: {lower: 0, upper: 1},
    }

    const data = {
        times: getRandomIntInclusive(config.times.lower, config.times.upper),
        counterClockwise: getRandomIntInclusive(config.counterClockwise.lower, config.counterClockwise.upper),
        color: await settings.getColorFromBucket(),
        emissive: await settings.getColorFromBucket(),
        specular: await settings.getColorFromBucket(),
        light1: await settings.getLightFromBucket(),
        light2: await settings.getLightFromBucket(),
        light3: await settings.getLightFromBucket(),
        getInfo: () => {
            return `${threeDimensionalShapeEffect.name}: ${data.times} rotation speed`
        }
    }

    return data;
}
