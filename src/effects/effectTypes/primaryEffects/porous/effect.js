import {generate} from "./generate.js";
import {porousOverlay} from "./invoke.js";

export const effect = {
    invoke: (layer, data, currentFrame, totalFrames) => porousOverlay(layer, data, currentFrame, totalFrames)
}

export const porousEffect = {
    name: 'porous.png',
    generateData: generate,
    effect: effect,
    effectChance: 100,
    requiresLayer: true,
    ignoreAdditionalEffects: true,
}
