import {LayerEffect} from "./LayerEffect.js";
import {EffectConfig} from "./EffectConfig.js";

export class LayerConfig {
    constructor({
                    effect = LayerEffect,
                    percentChance = 0,
                    ignoreSecondaryEffects = false,
                    currentEffectConfig = new EffectConfig(),
                    defaultEffectConfig = EffectConfig,
                    possibleSecondaryEffects = []
                }) {
        this.effect = effect;
        this.percentChance = percentChance;
        this.ignoreSecondaryEffects = ignoreSecondaryEffects;
        this.currentEffectConfig = currentEffectConfig;
        this.defaultEffectConfig = defaultEffectConfig;
        this.possibleSecondaryEffects = possibleSecondaryEffects;
    }
}