import {glitchInverseEffect} from "./effect.js";

export const generate = () => {
    return {
        getInfo: () => {
            return `${glitchInverseEffect.name}`
        }
    };
}