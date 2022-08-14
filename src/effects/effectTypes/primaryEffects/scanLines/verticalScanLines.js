import {generate} from "./generate.js";
import {verticalScanLines} from "./invoke.js";

export const effect = {
    invoke: (data, layer, currentFrame, totalFrames) => verticalScanLines(data, layer, currentFrame, totalFrames)
}

export const verticalScanLinesEffect = {
    name: 'scan lines', generateData: generate, effect: effect, effectChance: 50, requiresLayer: true,
}

