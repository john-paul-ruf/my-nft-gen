// Secondary Effects Plugin Registration
import { EdgeGlowEffect } from './edgeGlow/EdgeGlowEffect.js';
import { FadeEffect } from './fade/FadeEffect.js';
import { GlowEffect } from './glow/GlowEffect.js';
import { RandomizeEffect } from './randomize/RandomizeEffect.js';
import { SingleLayerBlurEffect } from './single-layer-blur/SingleLayerBlurEffect.js';
import { SingleLayerGlitchDrumrollHorizontalWaveEffect } from './single-layer-glitch-drumroll-horizontal-wave/SingleLayerGlitchDrumrollHorizontalWaveEffect.js';
import { SingleLayerGlitchFractalEffect } from './single-layer-glitch-fractal/SingleLayerGlitchFractalEffect.js';

export const SECONDARY_EFFECTS = {
    EdgeGlowEffect,
    FadeEffect,
    GlowEffect,
    RandomizeEffect,
    SingleLayerBlurEffect,
    SingleLayerGlitchDrumrollHorizontalWaveEffect,
    SingleLayerGlitchFractalEffect
};

export function register(effectRegistry, positionRegistry) {
    const EffectCategories = { SECONDARY: 'secondary' };
    
    Object.values(SECONDARY_EFFECTS).forEach(EffectClass => {
        effectRegistry.register(EffectClass, EffectCategories.SECONDARY);
    });
}

export * from './edgeGlow/EdgeGlowEffect.js';
export * from './fade/FadeEffect.js';
export * from './glow/GlowEffect.js';
export * from './randomize/RandomizeEffect.js';
export * from './single-layer-blur/SingleLayerBlurEffect.js';
export * from './single-layer-glitch-drumroll-horizontal-wave/SingleLayerGlitchDrumrollHorizontalWaveEffect.js';
export * from './single-layer-glitch-fractal/SingleLayerGlitchFractalEffect.js';