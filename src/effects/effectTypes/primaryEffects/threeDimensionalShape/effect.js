import {generate} from "./generate.js";
import {threeDimensionalShape} from "./invoke.js";

export const effect = {
    invoke: (layer, data, currentFrame, totalFrames) => threeDimensionalShape(layer, data, currentFrame, totalFrames)
}

export const threeDimensionalShapeEffect = {
    name: 'three-dimensional-shape',
    generateData: generate,
    effect: effect,
    effectChance: 40,
    requiresLayer: true,
}

