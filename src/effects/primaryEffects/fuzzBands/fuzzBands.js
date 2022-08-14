import {generate} from "./generate.js";
import {fuzzBands} from "./invoke.js";

export const effect = {
    invoke: (data, layer, currentFrame, totalFrames) => fuzzBands(data, layer, currentFrame, totalFrames)
}

export const fuzzBandsEffect = {
    name: 'fuzz-bands',
    generateData: generate,
    effect: effect,
    effectChance: 70,
    requiresLayer: true,
}

