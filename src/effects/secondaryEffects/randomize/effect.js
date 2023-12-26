import {randomize} from "./invoke.js";
import {generate} from "./generate.js";

export const effect = {
    invoke: (layer, data) => randomize(layer, data)
}

export const randomizeEffect = {
    name: 'randomize',
    generateData: generate,
    effect: effect,
    requiresLayer: false,
}

