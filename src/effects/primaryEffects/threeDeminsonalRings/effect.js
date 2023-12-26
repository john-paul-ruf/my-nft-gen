import {generate} from "./generate.js";
import {threeDimensionalRings} from "./invoke.js";

export const effect = {
    invoke: (layer, data, currentFrame, totalFrames) => threeDimensionalRings(layer, data, currentFrame, totalFrames)
}

export const threeDimensionalRingsEffect = {
    name: 'three-dimensional-rings',
    generateData: generate,
    effect: effect,
    requiresLayer: true,
}

