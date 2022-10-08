import {glitchDrumrollHorizontalWave} from "./invoke.js";
import {generate} from "./generate.js";

export const effect = {
    invoke: (layer, data) => glitchDrumrollHorizontalWave(layer, data)
}

export const glitchDrumrollHorizontalWaveEffect = {
    name: 'glitch drumroll horizontal wave',
    generateData: generate,
    effect: effect,
    effectChance: 15,
    requiresLayer: false,
}


