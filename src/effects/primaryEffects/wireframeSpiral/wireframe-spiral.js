import {generate} from "./generate.js";
import {wireframeSpiral} from "./invoke.js";

export const effect = {
    invoke: (data, layer, currentFrame, totalFrames) => wireframeSpiral(data, layer, currentFrame, totalFrames)
}

export const wireframeSpiralEffect = {
    name: 'wireframe-spiral',
    generateData: generate,
    effect: effect,
    effectChance: 30,
    requiresLayer: true,
}

