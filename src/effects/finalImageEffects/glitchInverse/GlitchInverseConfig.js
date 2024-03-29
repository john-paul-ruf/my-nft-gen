import { EffectConfig } from '../../../core/layer/EffectConfig.js';

export class GlitchInverseConfig extends EffectConfig {
  constructor(
    {
      glitchChance = 100,
    },
  ) {
    super();
    this.glitchChance = glitchChance;
  }
}
