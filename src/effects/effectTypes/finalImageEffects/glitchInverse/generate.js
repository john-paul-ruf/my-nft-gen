import {glitchInverseEffect} from "./effect.js";

const config = {
    glitchChance: 10,
}

export const generate = () => {
    return {
        glitchChance: config.glitchChance,
        getInfo: () => {
            return `${glitchInverseEffect.name} ${config.glitchChance} chance`
        }
    };
}