import {generate} from "./generate.js";
import {animatedImageOverlay} from "./invoke.js";

export const effect = {
    invoke: (layer, data, currentFrame, numberOfFrames) => animatedImageOverlay(layer, data, currentFrame, numberOfFrames)
}

export const animatedImageOverlayEffect = {
    name: 'animated-image-overlay',
    generateData: generate,
    effect: effect,
    effectChance: 0,
    requiresLayer: true,
    ignoreAdditionalEffects: false,
}
