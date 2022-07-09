import {imageSize} from "./gobals.js";

export const composeInfo = (config, effects) => {

    const getEffectInfo = (effect) => {
        let results = '';
        for (let i = 0; i < effect.length; i++) {
            let data = `\n  ` + effect[i].getInfo()

            if (effect[i].additionalEffects.length > 0) {
                data = data + `\n    with additional effects: `
                for (let a = 0; a < effect[i].additionalEffects.length; a++) {
                    data = data + `\n      ` + effect[i].additionalEffects[a].getInfo();
                }
            }

            results = results + data;
        }
        return results;
    }

    const info =
        `Title: ${config.finalFileName}\nRun: ${config.runName}\nArtist: ${config._INVOKER_}\nImage Size: ${imageSize}x${imageSize} pixels\nNumber of Frames: ${config.numberOfFrame}\n\nEffects: ${getEffectInfo(effects)}`

    return info;

}