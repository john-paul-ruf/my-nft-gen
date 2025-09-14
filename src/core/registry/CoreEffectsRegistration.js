import { EffectRegistry } from './EffectRegistry.js';
import { EffectCategories } from './EffectCategories.js';

// Primary Effects
import { AmpEffect } from 'my-nft-effects-core/effects/primaryEffects/amp/AmpEffect.js';
import { BlinkOnEffect } from 'my-nft-effects-core/effects/primaryEffects/blink-on-blink-on-blink-redux/BlinkOnEffect.js';
import { CurvedRedEyeEffect } from 'my-nft-effects-core/effects/primaryEffects/curved-red-eye/CurvedRedEyeEffect.js';
import { EncircledSpiralEffect } from 'my-nft-effects-core/effects/primaryEffects/encircledSpiral/EncircledSpiralEffect.js';
import { FuzzFlareEffect } from 'my-nft-effects-core/effects/primaryEffects/fuzz-flare/FuzzFlareEffect.js';
import { FuzzyBandEffect } from 'my-nft-effects-core/effects/primaryEffects/fuzzyBands/FuzzyBandEffect.js';
import { FuzzyRipplesEffect } from 'my-nft-effects-core/effects/primaryEffects/fuzzyRipples/FuzzyRipplesEffect.js';
import { GatesEffect } from 'my-nft-effects-core/effects/primaryEffects/gates/GatesEffect.js';
import { HexEffect } from 'my-nft-effects-core/effects/primaryEffects/hex/HexEffect.js';
import { ImageOverlayEffect } from 'my-nft-effects-core/effects/primaryEffects/imageOverlay/ImageOverlayEffect.js';
import { LayeredHexEffect } from 'my-nft-effects-core/effects/primaryEffects/layeredHex/LayeredHexEffect.js';
import { LayeredRingEffect } from 'my-nft-effects-core/effects/primaryEffects/layeredRing/LayeredRingEffect.js';
import { LensFlareEffect } from 'my-nft-effects-core/effects/primaryEffects/lensFlare/LensFlareEffect.js';
import { MappedFramesEffect } from 'my-nft-effects-core/effects/primaryEffects/mappedFrames/MappedFramesEffect.js';
import { NthRingsEffect } from 'my-nft-effects-core/effects/primaryEffects/nthRings/NthRingsEffect.js';
import { PorousEffect } from 'my-nft-effects-core/effects/primaryEffects/porous/PorousEffect.js';
import { RayRingEffect } from 'my-nft-effects-core/effects/primaryEffects/rayRing/RayRingEffect.js';
import { RayRingInvertedEffect } from 'my-nft-effects-core/effects/primaryEffects/rayRingInverted/RayRingInvertedEffect.js';
import { RedEyeEffect } from 'my-nft-effects-core/effects/primaryEffects/red-eye/RedEyeEffect.js';
import { RollingGradientEffect } from 'my-nft-effects-core/effects/primaryEffects/rollingGradient/RollingGradientEffect.js';
import { ScanLinesEffect } from 'my-nft-effects-core/effects/primaryEffects/scanLines/ScanLinesEffect.js';
import { ScopesEffect } from 'my-nft-effects-core/effects/primaryEffects/scopes/ScopesEffect.js';
import { StaticPathEffect } from 'my-nft-effects-core/effects/primaryEffects/static-path/StaticPathEffect.js';
import { ViewportEffect } from 'my-nft-effects-core/effects/primaryEffects/viewport/ViewportEffect.js';

// Secondary Effects
import { EdgeGlowEffect } from 'my-nft-effects-core/effects/secondaryEffects/edgeGlow/EdgeGlowEffect.js';
import { FadeEffect } from 'my-nft-effects-core/effects/secondaryEffects/fade/FadeEffect.js';
import { GlowEffect } from 'my-nft-effects-core/effects/secondaryEffects/glow/GlowEffect.js';
import { RandomizeEffect } from 'my-nft-effects-core/effects/secondaryEffects/randomize/RandomizeEffect.js';
import { SingleLayerBlurEffect } from 'my-nft-effects-core/effects/secondaryEffects/single-layer-blur/SingleLayerBlurEffect.js';
import { SingleLayerGlitchDrumrollHorizontalWaveEffect } from 'my-nft-effects-core/effects/secondaryEffects/single-layer-glitch-drumroll-horizontal-wave/SingleLayerGlitchDrumrollHorizontalWaveEffect.js';
import { SingleLayerGlitchFractalEffect } from 'my-nft-effects-core/effects/secondaryEffects/single-layer-glitch-fractal/SingleLayerGlitchFractalEffect.js';

// Final Image Effects
import { BloomFilmGrainEffect } from 'my-nft-effects-core/effects/finalImageEffects/bloomFilmGrain/BloomFilmGrainEffect.js';
import { BlurEffect } from 'my-nft-effects-core/effects/finalImageEffects/blur/BlurEffect.js';
import { ClaudeCRTBarrelRollEffect } from 'my-nft-effects-core/effects/finalImageEffects/claudeCRTBarrelRoll/ClaudeCRTBarrelRollEffect.js';
import { ColorPulseEffect } from 'my-nft-effects-core/effects/finalImageEffects/colorPulse/ColorPulseEffect.js';
import { CRTBarrelEffect } from 'my-nft-effects-core/effects/finalImageEffects/crtBarrel/CRTBarrelEffect.js';
import { CRTScanLinesEffect } from 'my-nft-effects-core/effects/finalImageEffects/crtScanLines/CRTScanLinesEffect.js';
import { CRTShadowEffect } from 'my-nft-effects-core/effects/finalImageEffects/crtShadow/CRTShadowEffect.js';
import { GlitchDrumrollHorizontalWaveEffect } from 'my-nft-effects-core/effects/finalImageEffects/glitchDrumrollHorizontalWave/GlitchDrumrollHorizontalWaveEffect.js';
import { GlitchFractalEffect } from 'my-nft-effects-core/effects/finalImageEffects/glitchFractal/GlitchFractalEffect.js';
import { GlitchInverseEffect } from 'my-nft-effects-core/effects/finalImageEffects/glitchInverse/GlitchInverseEffect.js';
import { ModulateEffect } from 'my-nft-effects-core/effects/finalImageEffects/modulate/ModulateEffect.js';
import { PixelateEffect } from 'my-nft-effects-core/effects/finalImageEffects/pixelate/PixelateEffect.js';
import { VintageFadeEffect } from 'my-nft-effects-core/effects/finalImageEffects/vintageFade/VintageFadeEffect.js';

// Key Frame Effects
import { BlurKeyFrameEffect } from 'my-nft-effects-core/effects/keyFrameEffects/blur/BlurKeyFrameEffect.js';
import { CRTDegaussEffect } from 'my-nft-effects-core/effects/keyFrameEffects/crtDegaussEvent/CRTDegaussEffect.js';
import { FadeKeyFrameEffect } from 'my-nft-effects-core/effects/keyFrameEffects/fade/FadeKeyFrameEffect.js';
import { GlowKeyFrameEffect } from 'my-nft-effects-core/effects/keyFrameEffects/glow/GlowKeyFrameEffect.js';
import { PixelateKeyFrameEffect } from 'my-nft-effects-core/effects/keyFrameEffects/pixelate/PixelateKeyFrameEffect.js';
import { SetOpacityKeyFrameEffect } from 'my-nft-effects-core/effects/keyFrameEffects/setOpacity/SetOpacityKeyFrameEffect.js';
import { StaticImageKeyFrameEffect } from 'my-nft-effects-core/effects/keyFrameEffects/staticImageKeyFrame/StaticImageKeyFrameEffect.js';

export function registerCoreEffects() {
    // Primary Effects
    EffectRegistry.registerGlobal(AmpEffect, EffectCategories.PRIMARY);
    EffectRegistry.registerGlobal(BlinkOnEffect, EffectCategories.PRIMARY);
    EffectRegistry.registerGlobal(CurvedRedEyeEffect, EffectCategories.PRIMARY);
    EffectRegistry.registerGlobal(EncircledSpiralEffect, EffectCategories.PRIMARY);
    EffectRegistry.registerGlobal(FuzzFlareEffect, EffectCategories.PRIMARY);
    EffectRegistry.registerGlobal(FuzzyBandEffect, EffectCategories.PRIMARY);
    EffectRegistry.registerGlobal(FuzzyRipplesEffect, EffectCategories.PRIMARY);
    EffectRegistry.registerGlobal(GatesEffect, EffectCategories.PRIMARY);
    EffectRegistry.registerGlobal(HexEffect, EffectCategories.PRIMARY);
    EffectRegistry.registerGlobal(ImageOverlayEffect, EffectCategories.PRIMARY);
    EffectRegistry.registerGlobal(LayeredHexEffect, EffectCategories.PRIMARY);
    EffectRegistry.registerGlobal(LayeredRingEffect, EffectCategories.PRIMARY);
    EffectRegistry.registerGlobal(LensFlareEffect, EffectCategories.PRIMARY);
    EffectRegistry.registerGlobal(MappedFramesEffect, EffectCategories.PRIMARY);
    EffectRegistry.registerGlobal(NthRingsEffect, EffectCategories.PRIMARY);
    EffectRegistry.registerGlobal(PorousEffect, EffectCategories.PRIMARY);
    EffectRegistry.registerGlobal(RayRingEffect, EffectCategories.PRIMARY);
    EffectRegistry.registerGlobal(RayRingInvertedEffect, EffectCategories.PRIMARY);
    EffectRegistry.registerGlobal(RedEyeEffect, EffectCategories.PRIMARY);
    EffectRegistry.registerGlobal(RollingGradientEffect, EffectCategories.PRIMARY);
    EffectRegistry.registerGlobal(ScanLinesEffect, EffectCategories.PRIMARY);
    EffectRegistry.registerGlobal(ScopesEffect, EffectCategories.PRIMARY);
    EffectRegistry.registerGlobal(StaticPathEffect, EffectCategories.PRIMARY);
    EffectRegistry.registerGlobal(ViewportEffect, EffectCategories.PRIMARY);

    // Secondary Effects
    EffectRegistry.registerGlobal(EdgeGlowEffect, EffectCategories.SECONDARY);
    EffectRegistry.registerGlobal(FadeEffect, EffectCategories.SECONDARY);
    EffectRegistry.registerGlobal(GlowEffect, EffectCategories.SECONDARY);
    EffectRegistry.registerGlobal(RandomizeEffect, EffectCategories.SECONDARY);
    EffectRegistry.registerGlobal(SingleLayerBlurEffect, EffectCategories.SECONDARY);
    EffectRegistry.registerGlobal(SingleLayerGlitchDrumrollHorizontalWaveEffect, EffectCategories.SECONDARY);
    EffectRegistry.registerGlobal(SingleLayerGlitchFractalEffect, EffectCategories.SECONDARY);

    // Final Image Effects
    EffectRegistry.registerGlobal(BloomFilmGrainEffect, EffectCategories.FINAL_IMAGE);
    EffectRegistry.registerGlobal(BlurEffect, EffectCategories.FINAL_IMAGE);
    EffectRegistry.registerGlobal(ClaudeCRTBarrelRollEffect, EffectCategories.FINAL_IMAGE);
    EffectRegistry.registerGlobal(ColorPulseEffect, EffectCategories.FINAL_IMAGE);
    EffectRegistry.registerGlobal(CRTBarrelEffect, EffectCategories.FINAL_IMAGE);
    EffectRegistry.registerGlobal(CRTScanLinesEffect, EffectCategories.FINAL_IMAGE);
    EffectRegistry.registerGlobal(CRTShadowEffect, EffectCategories.FINAL_IMAGE);
    EffectRegistry.registerGlobal(GlitchDrumrollHorizontalWaveEffect, EffectCategories.FINAL_IMAGE);
    EffectRegistry.registerGlobal(GlitchFractalEffect, EffectCategories.FINAL_IMAGE);
    EffectRegistry.registerGlobal(GlitchInverseEffect, EffectCategories.FINAL_IMAGE);
    EffectRegistry.registerGlobal(ModulateEffect, EffectCategories.FINAL_IMAGE);
    EffectRegistry.registerGlobal(PixelateEffect, EffectCategories.FINAL_IMAGE);
    EffectRegistry.registerGlobal(VintageFadeEffect, EffectCategories.FINAL_IMAGE);

    // Key Frame Effects
    EffectRegistry.registerGlobal(BlurKeyFrameEffect, EffectCategories.KEY_FRAME);
    EffectRegistry.registerGlobal(CRTDegaussEffect, EffectCategories.KEY_FRAME);
    EffectRegistry.registerGlobal(FadeKeyFrameEffect, EffectCategories.KEY_FRAME);
    EffectRegistry.registerGlobal(GlowKeyFrameEffect, EffectCategories.KEY_FRAME);
    EffectRegistry.registerGlobal(PixelateKeyFrameEffect, EffectCategories.KEY_FRAME);
    EffectRegistry.registerGlobal(SetOpacityKeyFrameEffect, EffectCategories.KEY_FRAME);
    EffectRegistry.registerGlobal(StaticImageKeyFrameEffect, EffectCategories.KEY_FRAME);
}