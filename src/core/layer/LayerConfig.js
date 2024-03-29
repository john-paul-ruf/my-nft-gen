import { LayerEffect } from './LayerEffect.js';
import { EffectConfig } from './EffectConfig.js';

export class LayerConfig {
    constructor({
        name = 'base-config',
        effect = LayerEffect,
        percentChance = 0,
        ignoreSecondaryEffects = false,
        currentEffectConfig = new EffectConfig(),
        defaultEffectConfig = EffectConfig,
        possibleSecondaryEffects = [],
    }) {
        this.name = name;
        this.Effect = effect;
        this.percentChance = percentChance;
        this.ignoreSecondaryEffects = ignoreSecondaryEffects;
        this.currentEffectConfig = currentEffectConfig;
        this.defaultEffectConfig = defaultEffectConfig;
        this.possibleSecondaryEffects = possibleSecondaryEffects;
    }
}
