import {scopes} from "./invoke.js";
import {generate} from "./generate.js";

export const effect = {
    invoke: (data, layer, currentFrame, totalFrames) => scopes(data, layer, currentFrame, totalFrames)
}

export const scopesEffect = {
    name: 'scopes',
    generateData: generate,
    effect: effect,
    effectChance: 50,
    requiresLayer: true,
}

