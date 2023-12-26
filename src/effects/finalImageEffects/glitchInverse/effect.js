import {glitchInverse} from "./invoke.js";
import {generate} from "./generate.js";

export const effect = {
    invoke: (layer, data) => glitchInverse(layer, data)
}

export const glitchInverseEffect = {
    name: 'glitch inverse',
    generateData: generate,
    effect: effect,
    requiresLayer: false,
}

