export class ComposeInfo {
    constructor({
        config, effects, finalImageEffects, settings,
    }) {
        this.config = config;
        this.effects = effects;
        this.finalImageEffects = finalImageEffects;
        this.settings = settings;
    }

    // This function makes use of the newline character \n and spaces for formatting
    // https://stackoverflow.com/questions/1155678/what-is-the-javascript-string-newline-character
    #getEffectInfo(effectList) {
        let results = '';
        for (let i = 0; i < effectList.length; i++) { // for each effect in the effectList
            let data = `\n* ${effectList[i].getInfo()}`; // start new string with effect info

            if (effectList[i].additionalEffects.length > 0) { // if this effect has additional effects
                data += '\n  * with additional effects:'; // append additional effects to the string we started above
                for (let a = 0; a < effectList[i].additionalEffects.length; a++) {
                    data = `${data}\n    * ${effectList[i].additionalEffects[a].getInfo()}`; // Append additional info
                }
            }

            results += data; // Append this effects total info to the final result
        }
        return results; // returns the result, which is appended to the info string.
    }

    async #getColorInfo(settings) {
        return await await settings.getColorSchemeInfo();
    }

    async composeInfo() {
        const finalImageSize = this.settings.finalSize;

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
        return `**Title**: ${this.config.finalFileName}\n**Artist**: ${this.config._INVOKER_}\n[source code](https://github.com/john-paul-ruf/my-nft-gen)\n\n**Run**: ${this.config.runName}\n${await this.#getColorInfo(this.settings)}**Color Palette**: ${this.settings.colorScheme.colorBucket.join(", ")}\n**Image Size**: ${finalImageSize.width}x${finalImageSize.height} pixels\n**Number of Frames**: ${this.config.numberOfFrame}\n\n**Effects**: ${this.#getEffectInfo(this.effects)}\n\nFinal Image Effects: ${this.#getEffectInfo(this.finalImageEffects)}`;
    }
}
