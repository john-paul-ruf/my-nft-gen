import {blur} from "./invoke.js";
import {generate} from "./generate.js";

export const effect = {
    invoke: (layer, data, currentFrame, totalFrames) => blur(layer, data, currentFrame, totalFrames)
}

export const singleLayerBlurEffect = {
    name: 'single-layer-blur',
    generateData: generate,
    effect: effect,
    effectChance: 40,
    requiresLayer: false,
}


