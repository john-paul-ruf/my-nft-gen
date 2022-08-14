import {generate} from "./generate.js";
import {rayRing} from "./invoke.js";

export const effect = {
    invoke: (data, layer, currentFrame, totalFrames) => rayRing(data, layer, currentFrame, totalFrames)
}

export const rayRingEffect = {
    name: 'ray-rings', generateData: generate, effect: effect, effectChance: 50, requiresLayer: true,
}

