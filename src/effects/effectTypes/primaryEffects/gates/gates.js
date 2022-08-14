import {generate} from "./generate.js";
import {gates} from "./invoke.js";

export const effect = {
    invoke: (data, layer, currentFrame, totalFrames) => gates(data, layer, currentFrame, totalFrames)
}

export const gatesEffect = {
    name: 'gates',
    generateData: generate,
    effect: effect,
    effectChance: 50,
    requiresLayer: true,
}

