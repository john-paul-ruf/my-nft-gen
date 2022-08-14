import {fuzzyRipple} from "./invoke.js";
import {generate} from "./generate.js";

export const effect = {
    invoke: (data, layer, currentFrame, totalFrames) => fuzzyRipple(data, layer, currentFrame, totalFrames)
}

export const fuzzyRippleEffect = {
    name: 'fuzzy-ripples',
    generateData: generate,
    effect: effect,
    effectChance: 60,
    requiresLayer: true,
}

