import {glitchFractal} from "./invoke.js";
import {generate} from "./generate.js";

export const effect = {
    invoke: (layer, data) => glitchFractal(layer, data)
}

export const glitchFractalEffect = {
    name: 'glitch fractal',
    generateData: generate,
    effect: effect,
    effectChance: 5,
    requiresLayer: false,
}


