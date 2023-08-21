import {generate} from "./generate.js";
import {viewport} from "./invoke.js";

export const effect = {
    invoke: (layer, data, currentFrame, totalFrames) => viewport(layer, data, currentFrame, totalFrames)
}

export const viewportEffect = {
    name: 'viewport',
    generateData: generate,
    effect: effect,
    effectChance: 25,
    requiresLayer: true,
    ignoreAdditionalEffects: false,
}

