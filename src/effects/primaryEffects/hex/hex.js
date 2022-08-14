import {generate} from "./generate.js";
import {hex} from "./invoke.js";

export const effect = {
    invoke: (data, layer, currentFrame, totalFrames) => hex(data, layer, currentFrame, totalFrames)
}

export const hexEffect = {
    name: 'hex',
    generateData: generate,
    effect: effect,
    effectChance: 70,
    requiresLayer: true,
}

