import {generate} from "./generate.js";
import {viewport} from "./invoke.js";

export const effect = {
    invoke: (data, layer, currentFrame, totalFrames) => viewport(data, layer, currentFrame, totalFrames)
}

export const viewportEffect = {
    name: 'viewport',
    generateData: generate,
    effect: effect,
    effectChance: 100,
    requiresLayer: true,
}

