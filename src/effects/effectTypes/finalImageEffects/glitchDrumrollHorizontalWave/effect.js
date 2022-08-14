import {glitchDrumrollHorizontalWave} from "./invoke.js";
import {generate} from "./generate.js";

export const effect = {
    invoke: (layer) => glitchDrumrollHorizontalWave(layer)
}

export const glitchDrumrollHorizontalWaveEffect = {
    name: 'glitch drumroll horizontal wave',
    generateData: generate,
    effect: effect,
    effectChance: 0,
    requiresLayer: false,
}


