import {generate} from "./generate.js";
import {encircledSpiral} from "./invoke.js";

export const effect = {
    invoke: (layer, data, currentFrame, totalFrames) => encircledSpiral(layer, data, currentFrame, totalFrames)
}

export const encircledSpiralEffect = {
    name: 'encircled-spiral',
    generateData: generate,
    effect: effect,
    effectChance: 0,
    requiresLayer: true,
    ignoreAdditionalEffects: false,
}

