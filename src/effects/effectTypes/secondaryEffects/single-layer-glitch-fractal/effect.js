import {glitchFractal} from "./invoke.js";
import {generate} from "./generate.js";

export const effect = {
    invoke: (layer, data) => glitchFractal(layer, data)
}

export const singleLayerGlitchFractalEffect = {
    name: 'single-layer-glitch-fractal',
    generateData: generate,
    effect: effect,
    effectChance: 100,
    requiresLayer: false,
}


