import {blinkOnOverlay} from "./invoke.js";
import {generate} from "./generate.js";

export const effect = {
    invoke: (layer, data, currentFrame, totalFrames) => blinkOnOverlay(layer, data, currentFrame, totalFrames)
}

export const blinkOnEffect = {
    name: 'blink-on-blink-on-blink-redux',
    generateData: generate,
    effect: effect,
    effectChance: 100,
    requiresLayer: true,
    baseLayer: true,
}
