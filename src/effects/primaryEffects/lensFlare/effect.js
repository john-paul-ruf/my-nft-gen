import {lensFlare} from "./invoke.js";
import {generate} from "./generate.js";

export const effect = {
    invoke: (layer, data, currentFrame, totalFrames) => lensFlare(layer, data, currentFrame, totalFrames)
}

export const lensFlareEffect = {
    name: 'upgraded-lens-flare', //this will make it so slow...
    generateData: generate,
    effect: effect,
    requiresLayer: true,
}


