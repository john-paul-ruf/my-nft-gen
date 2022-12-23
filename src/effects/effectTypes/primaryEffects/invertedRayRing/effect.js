import {generate} from "./generate.js";
import {invertedRayRing} from "./invoke.js";

export const effect = {
    invoke: (layer, data, currentFrame, totalFrames) => invertedRayRing(layer, data, currentFrame, totalFrames)
}

export const invertedRayRingEffect = {
    name: 'inverted-ray-rings', generateData: generate, effect: effect, effectChance: 25, requiresLayer: true,
}

