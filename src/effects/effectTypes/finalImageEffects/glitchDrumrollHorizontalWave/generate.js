import {glitchDrumrollHorizontalWaveEffect} from "./effect.js";

const config = {
    glitchChance: 10,
}

export const generate = () => {
    return {
        glitchChance: config.glitchChance,
        getInfo: () => {
            return `${glitchDrumrollHorizontalWaveEffect.name} ${config.glitchChance} chance`
        }
    }
}