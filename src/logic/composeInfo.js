export const composeInfo = (config, summonEffects, focusEffects, extraEffects) => {

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
        `Title: ${config.finalFileName}\nRun: ${config.runName}\nArtist: ${config._INVOKER_}\n\nFocus Name: ${config.focusName}  ${getEffectInfo(focusEffects)} \n\nSummons Name: ${config.summonsName}  ${getEffectInfo(summonEffects)} \n\nExtra Effects: ${getEffectInfo(extraEffects)}`

    return info;

}