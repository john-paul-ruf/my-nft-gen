import {getFinalImageSize, getSchemeInfo} from "../GlobalSettings.js";

//This function makes use of the newline character <br> and spaces for formatting
//https://stackoverflow.com/questions/1155678/what-is-the-javascript-string-newline-character
const getEffectInfo = (effectList) => {
    let results = '';
    for (let i = 0; i < effectList.length; i++) { //for each effect in the effectList
        let data = `<br>  ` + effectList[i].getInfo() //start new string with effect info

        if (effectList[i].additionalEffects.length > 0) {  // if this effect has additional effects
            data = data + `<br>    with additional effects: ` //append additional effects to the string we started above
            for (let a = 0; a < effectList[i].additionalEffects.length; a++) {
                data = data + `<br>      ` + effectList[i].additionalEffects[a].getInfo(); //Append additional info
            }
        }

        results = results + data; //Append this effects total info to the final result
    }
    return results; //returns the result, which is appended to the info string.
}


export const composeInfo = (config, effects, finalImageEffects) => {

    const schemeInfo = getSchemeInfo();
    const finalImageSize = getFinalImageSize();

    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
    return `Title: ${config.finalFileName}<br>Artist: ${config._INVOKER_}<br>[Source Code](https://github.com/john-paul-ruf/my-nft-gen)<br><br>Run: ${config.runName}<br>Hue: ${schemeInfo.hue}<br>Scheme: ${schemeInfo.scheme}<br>Variation: ${schemeInfo.variations}<br>Distance: ${schemeInfo.distance.toFixed(2)}<br>Image Size: ${finalImageSize.width}x${finalImageSize.height} pixels<br>Number of Frames: ${config.numberOfFrame}<br><br>Effects: ${getEffectInfo(effects)}<br><br>Final Image Effects: ${getEffectInfo(finalImageEffects)}`

}
