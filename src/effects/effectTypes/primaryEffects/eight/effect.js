import {generate} from "./generate.js";
import {eight} from "./invoke.js";

export const effect = {
    invoke: (layer, data, currentFrame, totalFrames) => eight(layer, data, currentFrame, totalFrames)
}

export const eightEffect = {
    name: 'eight',
    generateData: generate,
    effect: effect,
    effectChance: 5,
    requiresLayer: true,
}

