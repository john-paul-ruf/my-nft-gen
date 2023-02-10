import {layeredHex} from "./invoke.js";
import {generate} from "./generate.js";

export const effect = {
    invoke: (layer, data, currentFrame, totalFrames) => layeredHex(layer, data, currentFrame, totalFrames)
}

export const layeredHexEffect = {
    name: 'layered-hex',
    generateData: generate,
    effect: effect,
    effectChance: 15,
    requiresLayer: true,
}


