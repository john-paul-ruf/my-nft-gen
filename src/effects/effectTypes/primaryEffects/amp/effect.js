import {amp} from "./invoke.js";
import {generate} from "./generate.js";

export const effect = {
    invoke: (layer, data) => amp(layer, data)
}

export const ampEffect = {
    name: 'amp',
    generateData: generate,
    effect: effect,
    effectChance: 75,
    requiresLayer: true,
}

