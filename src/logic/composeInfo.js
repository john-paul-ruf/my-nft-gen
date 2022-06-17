export const composeInfo = (config, summonEffects, focusEffects, extraEffects) => {

    const getEffectInfo = (effect) => {
        const results = []
        for (let i = 0; i < effect.length; i++) {
            const data = effect[i].getInfo()

            if (effect[i].additionalEffects.length > 0) {
                data.additionalEffects = [];
                for (let a = 0; a < effect[i].additionalEffects.length; a++) {
                    data.additionalEffects.push(effect[i].additionalEffects[a].getInfo());
                }
            }
            results.push(data);
        }
        return results;
    }

    config.summonsEffects = getEffectInfo(summonEffects);
    config.focusEffects = getEffectInfo(focusEffects);
    config.extraEffects = getEffectInfo(extraEffects);

    return config;

}