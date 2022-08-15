import {randomize} from "./invoke.js";
import {generate} from "./generate.js";

export const effect = {
    invoke: (layer, data) => randomize(layer, data)
}

export const randomizeEffect = {
    name: 'randomize',
    generateData: generate,
    effect: effect,
    effectChance: 10, //checking the color scheme work
    requiresLayer: false,
}
