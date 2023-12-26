import {layeredHex} from "./invoke.js";
import {generate} from "./generate.js";

export const effect = {
    invoke: (layer, data, currentFrame, totalFrames) => layeredHex(layer, data, currentFrame, totalFrames)
}

export const layeredHexEffect = {
    name: 'layered-hex-now-with-fuzz',
    generateData: generate,
    effect: effect,
    requiresLayer: true,
}


