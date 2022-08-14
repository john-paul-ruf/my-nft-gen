import {amp} from "./invoke.js";
import {generate} from "./generate.js";

export const effect = {
    invoke: (data, layer) => amp(data, layer)
}

export const ampEffect = {
    name: 'amp',
    generateData: generate,
    effect: effect,
    effectChance: 50,
    requiresLayer: true,
}

