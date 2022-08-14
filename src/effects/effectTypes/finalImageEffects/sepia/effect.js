import {sepia} from "./invoke.js";
import {generate} from "./generate.js";


export const effect = {
    invoke: (layer) => sepia(layer)
}

export const sepiaEffect = {
    name: 'sepia',
    generateData: generate,
    effect: effect,
    effectChance: 0, //not a fan
    requiresLayer: false,
}


