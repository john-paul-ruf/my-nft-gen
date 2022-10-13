import {getColorFromBucket} from "../../../../core/GlobalSettings.js";
import {getRandomIntInclusive} from "../../../../core/math/random.js";
import {threeDimensionalShapeEffect} from "./effect.js";

const config = {
    times: {lower: 1, upper: 2},
    counterClockwise: {lower: 0, upper: 1},
}

export const generate = () => {

    const data = {
        times: getRandomIntInclusive(config.times.lower, config.times.upper),
        counterClockwise: getRandomIntInclusive(config.counterClockwise.lower, config.counterClockwise.upper),
        color: getColorFromBucket(),
        emissive: getColorFromBucket(),
        specular: getColorFromBucket(),
        light: getColorFromBucket(),
        getInfo: () => {
            return `${threeDimensionalShapeEffect.name}: ${data.times} rotation speed`
        }
    }

    return data;
}
