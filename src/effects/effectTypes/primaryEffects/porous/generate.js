import {fileURLToPath} from "url";
import path from "path";
import {porousEffect} from "./effect.js";

const config = {
    layerOpacity: 0.75,
}

export const generate = () => {
    return {
        filename: path.join(fileURLToPath(import.meta.url).replace('generate.js', '') + 'porous.png'),
        layerOpacity: config.layerOpacity,
        getInfo: () => {
            return `${porousEffect.name}`
        }
    };
}
