import {glitchDrumrollHorizontalWaveEffect} from "./effect.js";

const config = {
    glitchChance: 50,
    glitchFactor: {lower: 0.5, upper: 0.1}
}

export const generate = () => {
    return {
        glitchChance: config.glitchChance,
        glitchFactor: config.glitchFactor,
        getInfo: () => {
            return `${glitchDrumrollHorizontalWaveEffect.name}`
        }
    }
}