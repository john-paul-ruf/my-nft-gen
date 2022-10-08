import {glitchDrumrollHorizontalWaveEffect} from "./effect.js";

const config = {
    glitchChance: 25,
}

export const generate = () => {
    return {
        glitchChance: config.glitchChance,
        getInfo: () => {
            return `${glitchDrumrollHorizontalWaveEffect.name}`
        }
    }
}