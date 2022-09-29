import {generate} from "./generate.js";
import {wireframeSpiral} from "./invoke.js";

export const effect = {
    invoke: (layer, data, currentFrame, totalFrames) => wireframeSpiral(layer, data, currentFrame, totalFrames)
}

export const wireframeSpiralEffect = {
    name: 'wireframe-spiral',
    generateData: generate,
    effect: effect,
    effectChance: 55,
    requiresLayer: true,
}

