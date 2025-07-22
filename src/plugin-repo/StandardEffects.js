import {EffectRegistry} from "./EffectRegistry.js";
import {BlurEffect} from "../effects/finalImageEffects/blur/BlurEffect.js";
import {
    SingleLayerGlitchDrumrollHorizontalWaveEffect
} from "../effects/secondaryEffects/single-layer-glitch-drumroll-horizontal-wave/SingleLayerGlitchDrumrollHorizontalWaveEffect.js";
import {GlitchFractalEffect} from "../effects/finalImageEffects/glitchFractal/GlitchFractalEffect.js";
import {GlitchInverseEffect} from "../effects/finalImageEffects/glitchInverse/GlitchInverseEffect.js";
import {PixelateEffect} from "../effects/finalImageEffects/pixelate/PixelateEffect.js";
import {AmpEffect} from "../effects/primaryEffects/amp/AmpEffect.js";
import {BlinkOnEffect} from "../effects/primaryEffects/blink-on-blink-on-blink-redux/BlinkOnEffect.js";
import {EncircledSpiralEffect} from "../effects/primaryEffects/encircledSpiral/EncircledSpiralEffect.js";
import {FuzzyBandEffect} from "../effects/primaryEffects/fuzzyBands/FuzzyBandEffect.js";
import {FuzzyRipplesEffect} from "../effects/primaryEffects/fuzzyRipples/FuzzyRipplesEffect.js";
import {GatesEffect} from "../effects/primaryEffects/gates/GatesEffect.js";
import {HexEffect} from "../effects/primaryEffects/hex/HexEffect.js";
import {ImageOverlayEffect} from "../effects/primaryEffects/imageOverlay/ImageOverlayEffect.js";
import {LayeredHexEffect} from "../effects/primaryEffects/layeredHex/LayeredHexEffect.js";
import {LayeredRingEffect} from "../effects/primaryEffects/layeredRing/LayeredRingEffect.js";
import {LensFlareEffect} from "../effects/primaryEffects/lensFlare/LensFlareEffect.js";
import {MappedFramesEffect} from "../effects/primaryEffects/mappedFrames/MappedFramesEffect.js";
import {NthRingsEffect} from "../effects/primaryEffects/nthRings/NthRingsEffect.js";
import {PorousEffect} from "../effects/primaryEffects/porous/PorousEffect.js";
import {RayRingEffect} from "../effects/primaryEffects/rayRing/RayRingEffect.js";
import {RayRingInvertedEffect} from "../effects/primaryEffects/rayRingInverted/RayRingInvertedEffect.js";
import {ScanLinesEffect} from "../effects/primaryEffects/scanLines/ScanLinesEffect.js";
import {ScopesEffect} from "../effects/primaryEffects/scopes/ScopesEffect.js";
import {ViewportEffect} from "../effects/primaryEffects/viewport/ViewportEffect.js";
import {RandomizeEffect} from "../effects/secondaryEffects/randomize/RandomizeEffect.js";
import {GlowEffect} from "../effects/secondaryEffects/glow/GlowEffect.js";
import {FadeEffect} from "../effects/secondaryEffects/fade/FadeEffect.js";
import {SingleLayerBlurEffect} from "../effects/secondaryEffects/single-layer-blur/SingleLayerBlurEffect.js";
import {
    SingleLayerGlitchFractalEffect
} from "../effects/secondaryEffects/single-layer-glitch-fractal/SingleLayerGlitchFractalEffect.js";
import {LayerEffect} from "../core/layer/LayerEffect.js";
import {RedEyeEffect} from "../effects/primaryEffects/red-eye/RedEyeEffect.js";
import {FuzzFlareEffect} from "../effects/primaryEffects/fuzz-flare/FuzzFlareEffect.js";
import {CRTScanLinesEffect} from "../effects/finalImageEffects/crtScanLines/CRTScanLinesEffect.js";
import {CRTShadowEffect} from "../effects/finalImageEffects/crtShadow/CRTShadowEffect.js";
import {CRTBarrelEffect} from "../effects/finalImageEffects/crtBarrel/CRTBarrelEffect.js";
import {CRTDegaussEffect} from "../effects/keyFrameEffects/crtDegaussEvent/CRTDegaussEffect.js";
import {PixelateKeyFrameEffect} from "../effects/keyFrameEffects/pixelate/PixelateKeyFrameEffect.js";
import {FadeKeyFrameEffect} from "../effects/keyFrameEffects/fade/FadeKeyFrameEffect.js";
import {GlowKeyFrameEffect} from "../effects/keyFrameEffects/glow/GlowKeyFrameEffect.js";
import {StaticPathEffect} from "../effects/primaryEffects/static-path/StaticPathEffect.js";
import {ModulateEffect} from "../effects/finalImageEffects/modulate/ModulateEffect.js";
import {BlurKeyFrameEffect} from "../effects/keyFrameEffects/blur/BlurKeyFrameEffect.js";
import {CurvedRedEyeEffect} from "../effects/primaryEffects/curved-red-eye/CurvedRedEyeEffect.js";
import {StaticImageKeyFrameEffect} from "../effects/keyFrameEffects/staticImageKeyFrame/StaticImageKeyFrameEffect.js";
import {ArcPath} from "../core/position/ArcPath.js";
import {Position} from "../core/position/Position.js";

export class StandardEffects {
    /**
     * Import and register each built‑in effect exactly once.
     */
    static registerAll() {
        const reg = EffectRegistry.instance;
        reg.register(BlurEffect._name_, BlurEffect);
        reg.register(SingleLayerGlitchDrumrollHorizontalWaveEffect._name_, SingleLayerGlitchDrumrollHorizontalWaveEffect);
        reg.register(GlitchFractalEffect._name_, GlitchFractalEffect);
        reg.register(GlitchInverseEffect._name_, GlitchInverseEffect);
        reg.register(PixelateEffect._name_, PixelateEffect);
        reg.register(AmpEffect._name_, AmpEffect);
        reg.register(BlinkOnEffect._name_, BlinkOnEffect);
        reg.register(EncircledSpiralEffect._name_, EncircledSpiralEffect);
        reg.register(FuzzyBandEffect._name_, FuzzyBandEffect);
        reg.register(FuzzyRipplesEffect._name_, FuzzyRipplesEffect);
        reg.register(GatesEffect._name_, GatesEffect);
        reg.register(HexEffect._name_, HexEffect);
        reg.register(ImageOverlayEffect._name_, ImageOverlayEffect);
        reg.register(LayeredHexEffect._name_, LayeredHexEffect);
        reg.register(LayeredRingEffect._name_, LayeredRingEffect);
        reg.register(LensFlareEffect._name_, LensFlareEffect);
        reg.register(MappedFramesEffect._name_, MappedFramesEffect);
        reg.register(NthRingsEffect._name_, NthRingsEffect);
        reg.register(PorousEffect._name_, PorousEffect);
        reg.register(RayRingEffect._name_, RayRingEffect);
        reg.register(RayRingInvertedEffect._name_, RayRingInvertedEffect);
        reg.register(ScanLinesEffect._name_, ScanLinesEffect);
        reg.register(ScopesEffect._name_, ScopesEffect);
        reg.register(ViewportEffect._name_, ViewportEffect);
        reg.register(RandomizeEffect._name_, RandomizeEffect);
        reg.register(GlowEffect._name_, GlowEffect);
        reg.register(FadeEffect._name_, FadeEffect);
        reg.register(SingleLayerBlurEffect._name_, SingleLayerBlurEffect);
        reg.register(SingleLayerGlitchFractalEffect._name_, SingleLayerGlitchFractalEffect);
        reg.register(LayerEffect._name_, LayerEffect);
        reg.register(RedEyeEffect._name_, RedEyeEffect);
        reg.register(FuzzFlareEffect._name_, FuzzFlareEffect);
        reg.register(CRTScanLinesEffect._name_, CRTScanLinesEffect);
        reg.register(CRTShadowEffect._name_, CRTShadowEffect);
        reg.register(CRTBarrelEffect._name_, CRTBarrelEffect);
        reg.register(CRTDegaussEffect._name_, CRTDegaussEffect);
        reg.register(PixelateKeyFrameEffect._name_, PixelateKeyFrameEffect);
        reg.register(FadeKeyFrameEffect._name_, FadeKeyFrameEffect);
        reg.register(GlowKeyFrameEffect._name_, GlowKeyFrameEffect);
        reg.register(BlurKeyFrameEffect._name_, BlurKeyFrameEffect);
        reg.register(StaticPathEffect._name_, StaticPathEffect);
        reg.register(ModulateEffect._name_, ModulateEffect);
        reg.register(CurvedRedEyeEffect._name_, CurvedRedEyeEffect);
        reg.register(StaticImageKeyFrameEffect._name_, StaticImageKeyFrameEffect);
        reg.register(ArcPath._name_, ArcPath);
        reg.register(Position._name_, Position);
    }
}
