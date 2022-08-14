import {animateBackground} from "./invoke.js";
import {generate} from "./generate.js";

export const effect = {
    invoke: (data, layer) => animateBackground(data, layer)
}

export const animateBackgroundEffect = {
    name: 'static background',
    generateData: generate,
    effect: effect,
    effectChance: 50,
    requiresLayer: true,
}

