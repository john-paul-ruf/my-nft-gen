import {DISTANCE, HUE, IMAGESIZE, SCHEME, VARIATION} from "./gobals.js";


/*
 * @param config - for the art card
 * @param effects - we call get info to get their part of the art card
 * @returns {string} - the final art card
 */
export const composeInfo = (config, effects, finalImageEffects) => {

    //This function makes use of the newline character \n and spaces for formatting
    //https://stackoverflow.com/questions/1155678/what-is-the-javascript-string-newline-character
    const getEffectInfo = (effectList) => {
        let results = '';
        for (let i = 0; i < effectList.length; i++) { //for each effect in the effectList
            let data = `\n  ` + effectList[i].getInfo() //start new string with effect info

            if (effectList[i].additionalEffects.length > 0) {  // if this effect has additional effects
                data = data + `\n    with additional effects: ` //append additional effects to the string we started above
                for (let a = 0; a < effectList[i].additionalEffects.length; a++) {
                    data = data + `\n      ` + effectList[i].additionalEffects[a].getInfo(); //Append additional info
                }
            }

            results = results + data; //Append this effects total info to the final result
        }
        return results; //returns the result, which is appended to the info string.
    }

    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
    return `Title: ${config.finalFileName}\nArtist: ${config._INVOKER_}\n\nRun: ${config.runName}\nHue: ${HUE}\nScheme: ${SCHEME}\nVariation: ${VARIATION}\nDistance: ${DISTANCE.toFixed(2)}\nImage Size: ${IMAGESIZE}x${IMAGESIZE} pixels\nNumber of Frames: ${config.numberOfFrame}\n\nEffects: ${getEffectInfo(effects)}\n\nFinal Image Effects: ${getEffectInfo(finalImageEffects)}`

}