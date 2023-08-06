import {generate} from "./generate.js";
import {nthRings} from "./invoke.js";

export const effect = {
    invoke: (layer, data, currentFrame, totalFrames) => nthRings(layer, data, currentFrame, totalFrames)
}

export const nthRingsEffect = {
    name: 'nth-rings',
    generateData: generate,
    effect: effect,
    effectChance: 70,
    requiresLayer: true,
}

