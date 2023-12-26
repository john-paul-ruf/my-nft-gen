import {fileURLToPath} from "url";
import path from "path";
import {porousEffect} from "./effect.js";

export const generate = async (settings) => {

    const config = {
        layerOpacity: 0.5,
    }

    return {
        filename: path.join(fileURLToPath(import.meta.url).replace('generate.js', '') + 'porous.png'),
        layerOpacity: config.layerOpacity,
        getInfo: () => {
            return `${porousEffect.name}`
        }
    };
}
