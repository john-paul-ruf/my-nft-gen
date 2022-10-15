import {
    getColorSchemeStrategy,
    getColorStrategy,
    getFinalImageSize,
    getNiceColorPalettesStrategy,
    getSchemeInfo
} from "../GlobalSettings.js";

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

const getColorInfo = () => {

    let schemeInfo = null;

    const colorStrategy = getColorStrategy();

    switch (colorStrategy) {
        case getColorSchemeStrategy():
            schemeInfo = getSchemeInfo();
            return `Strategy: ${getColorSchemeStrategy()}\nHue: ${schemeInfo.hue}\nScheme: ${schemeInfo.scheme}\nVariation: ${schemeInfo.variations}\nDistance: ${schemeInfo.distance.toFixed(2)}\n`
        case getNiceColorPalettesStrategy():
            return `Strategy: ${getNiceColorPalettesStrategy()}\n`
        default:
            throw 'no color scheme strategy';
    }
}


export const composeInfo = (config, effects, finalImageEffects) => {


    const finalImageSize = getFinalImageSize();

    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
    return `Title: ${config.finalFileName}\nArtist: ${config._INVOKER_}\n[source code](https://github.com/john-paul-ruf/my-nft-gen)\n\nRun: ${config.runName}\n${getColorInfo()}Image Size: ${finalImageSize.width}x${finalImageSize.height} pixels\nNumber of Frames: ${config.numberOfFrame}\n\nEffects: ${getEffectInfo(effects)}\n\nFinal Image Effects: ${getEffectInfo(finalImageEffects)}`

}
