import {glitchInverse} from "./invoke.js";
import {generate} from "./generate.js";

export const effect = {
    invoke: (layer) => glitchInverse(layer)
}

export const glitchInverseEffect = {
    name: 'glitch inverse',
    generateData: generate,
    effect: effect,
    effectChance: 0, //broken
    requiresLayer: false,
}


