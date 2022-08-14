import {sepiaEffect} from "./effect.js";

export const generate = () => {
    return {
        getInfo: () => {
            return `${sepiaEffect.name}`
        }
    };
}