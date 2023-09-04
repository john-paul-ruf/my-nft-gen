import {generate} from "./generate.js";
import {layeredRings} from "./invoke.js";

export const effect = {
    invoke: (layer, data, currentFrame, totalFrames) => layeredRings(layer, data, currentFrame, totalFrames)
}

export const layeredRingsEffect = {
    name: 'layered-rings',
    generateData: generate,
    effect: effect,
    effectChance: 70,
    requiresLayer: true,
    ignoreAdditionalEffects: false,
}


