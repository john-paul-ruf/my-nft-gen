import {getFinalImageSize, getSchemeInfo} from "../GlobalSettings.js";

//This function makes use of the newline character \n and spaces for formatting
//https://stackoverflow.com/questions/1155678/what-is-the-javascript-string-newline-character
const getEffectInfo = (effectList) => {
    let results = '';
    for (let i = 0; i < effectList.length; i++) { //for each effect in the effectList
        let data = `
  ` + effectList[i].getInfo() //start new string with effect info

        if (effectList[i].additionalEffects.length > 0) {  // if this effect has additional effects
            data = data + `
    with additional effects: ` //append additional effects to the string we started above
            for (let a = 0; a < effectList[i].additionalEffects.length; a++) {
                data = data + `
    ` + effectList[i].additionalEffects[a].getInfo(); //Append additional info
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

    return `Title: ${config.finalFileName}
Artist: ${config._INVOKER_}
[Source Code:](https://github.com/john-paul-ruf/my-nft-gen)

Run: ${config.runName}
Hue: ${schemeInfo.hue}
Scheme: ${schemeInfo.scheme}
Variation: ${schemeInfo.variations}
Distance: ${schemeInfo.distance.toFixed(2)}
Image Size: ${finalImageSize.width}x${finalImageSize.height}
Number of Frames: ${config.numberOfFrame}

Effects: ${getEffectInfo(effects)}

Final Image Effects: ${getEffectInfo(finalImageEffects)}`

}