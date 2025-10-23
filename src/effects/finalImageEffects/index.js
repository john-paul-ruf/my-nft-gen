// Final Image Effects Plugin Registration
import { BloomFilmGrainEffect } from './bloomFilmGrain/BloomFilmGrainEffect.js';
import { BlurEffect } from './blur/BlurEffect.js';
import { ClaudeCRTBarrelRollEffect } from './claudeCRTBarrelRoll/ClaudeCRTBarrelRollEffect.js';
import { ColorPulseEffect } from './colorPulse/ColorPulseEffect.js';
import { CRTBarrelEffect } from './crtBarrel/CRTBarrelEffect.js';
import { CRTScanLinesEffect } from './crtScanLines/CRTScanLinesEffect.js';
import { CRTShadowEffect } from './crtShadow/CRTShadowEffect.js';
import { GlitchDrumrollHorizontalWaveEffect } from './glitchDrumrollHorizontalWave/GlitchDrumrollHorizontalWaveEffect.js';
import { GlitchFractalEffect } from './glitchFractal/GlitchFractalEffect.js';
import { GlitchInverseEffect } from './glitchInverse/GlitchInverseEffect.js';
import { ModulateEffect } from './modulate/ModulateEffect.js';
import { PixelateEffect } from './pixelate/PixelateEffect.js';
import { VintageFadeEffect } from './vintageFade/VintageFadeEffect.js';

export const FINAL_IMAGE_EFFECTS = {
    BloomFilmGrainEffect,
    BlurEffect,
    ClaudeCRTBarrelRollEffect,
    ColorPulseEffect,
    CRTBarrelEffect,
    CRTScanLinesEffect,
    CRTShadowEffect,
    GlitchDrumrollHorizontalWaveEffect,
    GlitchFractalEffect,
    GlitchInverseEffect,
    ModulateEffect,
    PixelateEffect,
    VintageFadeEffect
};

export function register(effectRegistry, positionRegistry) {
    const EffectCategories = { FINAL_IMAGE: 'finalImage' };
    
    Object.values(FINAL_IMAGE_EFFECTS).forEach(EffectClass => {
        effectRegistry.register(EffectClass, EffectCategories.FINAL_IMAGE);
    });
}

export * from './bloomFilmGrain/BloomFilmGrainEffect.js';
export * from './blur/BlurEffect.js';
export * from './claudeCRTBarrelRoll/ClaudeCRTBarrelRollEffect.js';
export * from './colorPulse/ColorPulseEffect.js';
export * from './crtBarrel/CRTBarrelEffect.js';
export * from './crtScanLines/CRTScanLinesEffect.js';
export * from './crtShadow/CRTShadowEffect.js';
export * from './glitchDrumrollHorizontalWave/GlitchDrumrollHorizontalWaveEffect.js';
export * from './glitchFractal/GlitchFractalEffect.js';
export * from './glitchInverse/GlitchInverseEffect.js';
export * from './modulate/ModulateEffect.js';
export * from './pixelate/PixelateEffect.js';
export * from './vintageFade/VintageFadeEffect.js';