import {lensFlare} from "./invoke.js";
import {generate} from "./generate.js";

export const effect = {
    invoke: (layer, data, currentFrame, totalFrames) => lensFlare(layer, data, currentFrame, totalFrames)
}

export const lensFlareEffect = {
    name: 'lens-flare',
    generateData: generate,
    effect: effect,
    effectChance: 25,
    requiresLayer: true,
}


