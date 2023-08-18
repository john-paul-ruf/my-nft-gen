import {generate} from "./generate.js";
import {fuzzBands} from "./invoke.js";

export const effect = {
    invoke: (layer, data, currentFrame, totalFrames) => fuzzBands(layer, data, currentFrame, totalFrames)
}

export const fuzzBandsEffect = {
    name: 'fuzz-bands-mark-two',
    generateData: generate,
    effect: effect,
    effectChance: 40,
    requiresLayer: true,
    ignoreAdditionalEffects: false,
}

