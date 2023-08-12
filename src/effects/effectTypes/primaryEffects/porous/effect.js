import {generate} from "./generate.js";
import {porousOverlay} from "./invoke.js";

export const effect = {
    invoke: (layer, data) => porousOverlay(layer, data)
}

export const porousEffect = {
    name: 'porous.png',
    generateData: generate,
    effect: effect,
    effectChance: 0,
    requiresLayer: true,
    ignoreAdditionalEffects: true,
}
