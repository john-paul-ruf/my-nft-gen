import {LayerEffect} from "./LayerEffect.js";

export class LayerConfig {
    constructor({
                    effect = LayerEffect,
                    percentChance = 0,
                    ignoreSecondaryEffects = false,
                    currentEffectConfig = new EffectConfig(),
                    defaultEffectConfig= EffectConfig
                })
    {
            this.effect = effect;
            this.percentChance = percentChance;
            this.ignoreSecondaryEffects = ignoreSecondaryEffects;
            this.currentEffectConfig = currentEffectConfig;
            this.defaultEffectConfig = defaultEffectConfig;
    }
}