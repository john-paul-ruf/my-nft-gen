import {generate} from "./generate.js";
import {mappedFrames} from "./invoke.js";

export const effect = {
    invoke: (layer, data, currentFrame, numberOfFrames) => mappedFrames(layer, data, currentFrame, numberOfFrames)
}

export const mappedFramesEffect = {
    name: 'mapped-frames',
    generateData: generate,
    effect: effect,
    effectChance: 75,
    requiresLayer: true,
    baseLayer: true,
}
