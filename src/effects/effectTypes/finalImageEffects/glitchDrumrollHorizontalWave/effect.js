import {glitchDrumrollHorizontalWave} from "./invoke.js";
import {generate} from "./generate.js";

export const effect = {
    invoke: (layer, data, currentFrame) => glitchDrumrollHorizontalWave(layer, data, currentFrame)
}

export const glitchDrumrollHorizontalWaveEffect = {
    name: 'glitch drumroll horizontal wave',
    generateData: generate,
    effect: effect,
    effectChance: 100,
    requiresLayer: false,
}


