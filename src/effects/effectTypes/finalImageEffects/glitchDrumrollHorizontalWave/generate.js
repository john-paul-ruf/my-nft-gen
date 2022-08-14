import {glitchDrumrollHorizontalWaveEffect} from "./effect.js";

const config = {
    glitchChance: 50,
    glitchFactor: {lower: 0.5, upper: 0.1}
}

export const generate = () => {

    const data = {
        glitchChance: config.glitchChance,
        getInfo: () => {
            return `${glitchDrumrollHorizontalWaveEffect.name}`
        }
    }
    return data;
}