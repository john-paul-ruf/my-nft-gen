import {imageOverlay} from "./invoke.js";
import {generate} from "./generate.js";

export const effect = {
    invoke: (layer, data) => imageOverlay(layer, data)
}

export const imageOverlayEffect = {
    name: 'image-overlay',
    generateData: generate,
    effect: effect,
    effectChance: 75,
    requiresLayer: true,
    ignoreAdditionalEffects: false,
}
