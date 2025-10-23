// Primary Effects Plugin Registration
import { AmpEffect } from './amp/AmpEffect.js';
import { BlinkOnEffect } from './blink-on-blink-on-blink-redux/BlinkOnEffect.js';
import { CurvedRedEyeEffect } from './curved-red-eye/CurvedRedEyeEffect.js';
import { EncircledSpiralEffect } from './encircledSpiral/EncircledSpiralEffect.js';
import { FuzzFlareEffect } from './fuzz-flare/FuzzFlareEffect.js';
import { FuzzyBandEffect } from './fuzzyBands/FuzzyBandEffect.js';
import { FuzzyRipplesEffect } from './fuzzyRipples/FuzzyRipplesEffect.js';
import { GatesEffect } from './gates/GatesEffect.js';
import { HexEffect } from './hex/HexEffect.js';
import { ImageOverlayEffect } from './imageOverlay/ImageOverlayEffect.js';
import { LayeredHexEffect } from './layeredHex/LayeredHexEffect.js';
import { LayeredRingEffect } from './layeredRing/LayeredRingEffect.js';
import { LensFlareEffect } from './lensFlare/LensFlareEffect.js';
import { MappedFramesEffect } from './mappedFrames/MappedFramesEffect.js';
import { NthRingsEffect } from './nthRings/NthRingsEffect.js';
import { PorousEffect } from './porous/PorousEffect.js';
import { RayRingEffect } from './rayRing/RayRingEffect.js';
import { RayRingInvertedEffect } from './rayRingInverted/RayRingInvertedEffect.js';
import { RedEyeEffect } from './red-eye/RedEyeEffect.js';
import { RollingGradientEffect } from './rollingGradient/RollingGradientEffect.js';
import { ScanLinesEffect } from './scanLines/ScanLinesEffect.js';
import { ScopesEffect } from './scopes/ScopesEffect.js';
import { StaticPathEffect } from './static-path/StaticPathEffect.js';
import { ViewportEffect } from './viewport/ViewportEffect.js';

export const PRIMARY_EFFECTS = {
    AmpEffect,
    BlinkOnEffect,
    CurvedRedEyeEffect,
    EncircledSpiralEffect,
    FuzzFlareEffect,
    FuzzyBandEffect,
    FuzzyRipplesEffect,
    GatesEffect,
    HexEffect,
    ImageOverlayEffect,
    LayeredHexEffect,
    LayeredRingEffect,
    LensFlareEffect,
    MappedFramesEffect,
    NthRingsEffect,
    PorousEffect,
    RayRingEffect,
    RayRingInvertedEffect,
    RedEyeEffect,
    RollingGradientEffect,
    ScanLinesEffect,
    ScopesEffect,
    StaticPathEffect,
    ViewportEffect
};

export function register(effectRegistry, positionRegistry) {
    const EffectCategories = { PRIMARY: 'primary' };
    
    Object.values(PRIMARY_EFFECTS).forEach(EffectClass => {
        effectRegistry.register(EffectClass, EffectCategories.PRIMARY);
    });
}

export * from './amp/AmpEffect.js';
export * from './blink-on-blink-on-blink-redux/BlinkOnEffect.js';
export * from './curved-red-eye/CurvedRedEyeEffect.js';
export * from './encircledSpiral/EncircledSpiralEffect.js';
export * from './fuzz-flare/FuzzFlareEffect.js';
export * from './fuzzyBands/FuzzyBandEffect.js';
export * from './fuzzyRipples/FuzzyRipplesEffect.js';
export * from './gates/GatesEffect.js';
export * from './hex/HexEffect.js';
export * from './imageOverlay/ImageOverlayEffect.js';
export * from './layeredHex/LayeredHexEffect.js';
export * from './layeredRing/LayeredRingEffect.js';
export * from './lensFlare/LensFlareEffect.js';
export * from './mappedFrames/MappedFramesEffect.js';
export * from './nthRings/NthRingsEffect.js';
export * from './porous/PorousEffect.js';
export * from './rayRing/RayRingEffect.js';
export * from './rayRingInverted/RayRingInvertedEffect.js';
export * from './red-eye/RedEyeEffect.js';
export * from './rollingGradient/RollingGradientEffect.js';
export * from './scanLines/ScanLinesEffect.js';
export * from './scopes/ScopesEffect.js';
export * from './static-path/StaticPathEffect.js';
export * from './viewport/ViewportEffect.js';