import {Settings} from "../core/Settings.js";
import {LayerConfig} from "./LayerConfig.js";
import {AmpConfig} from "./primaryEffects/amp/AmpConfig.js";
import {AmpEffect} from "./primaryEffects/amp/AmpEffect.js";
import {AnimateBackgroundEffect} from "./primaryEffects/animateBackground/AnimateBackgroundEffect.js";
import {AnimateBackgroundConfig} from "./primaryEffects/animateBackground/AnimateBackgroundConfig.js";
import {BlinkOnEffect} from "./primaryEffects/blink-on-blink-on-blink-redux/BlinkEffect.js";
import {BlinkConfig} from "./primaryEffects/blink-on-blink-on-blink-redux/BlinkConfig.js";
import {EightEffect} from "./primaryEffects/eight/EightEffect.js";
import {EncircledSpiralEffect} from "./primaryEffects/encircledSpiral/EncircledSpiralEffect.js";
import {EncircledSpiralConfig} from "./primaryEffects/encircledSpiral/EncircledSpiralConfig.js";
import {FuzzyBandEffect} from "./primaryEffects/fuzzyBands/FuzzyBandEffect.js";
import {FuzzyBandConfig} from "./primaryEffects/fuzzyBands/FuzzyBandConfig.js";
import {FuzzyRipplesEffect} from "./primaryEffects/fuzzyRipples/FuzzyRipplesEffect.js";
import {FuzzyRipplesConfig} from "./primaryEffects/fuzzyRipples/FuzzyRipplesConfig.js";
import {GatesEffect} from "./primaryEffects/gates/GatesEffect.js";
import {GatesConfig} from "./primaryEffects/gates/GatesConfig.js";
import {HexEffect} from "./primaryEffects/hex/HexEffect.js";
import {HexConfig} from "./primaryEffects/hex/HexConfig.js";
import {ImageOverlayEffect} from "./primaryEffects/imageOverlay/ImageOverlayEffect.js";
import {ImageOverlayConfig} from "./primaryEffects/imageOverlay/ImageOverlayConfig.js";
import {LayeredHexEffect} from "./primaryEffects/layeredHex/LayeredHexEffect.js";
import {LayeredHexConfig} from "./primaryEffects/layeredHex/LayeredHexConfig.js";
import {LayeredRingEffect} from "./primaryEffects/layeredRing/LayeredRingEffect.js";
import {LayeredRingConfig} from "./primaryEffects/layeredRing/LayeredRingConfig.js";
import {WireframeSpiralConfig} from "./primaryEffects/wireframeSpiral/WireframeSpiralConfig.js";
import {WireFrameSpiralEffect} from "./primaryEffects/wireframeSpiral/WireFrameSpiralEffect.js";
import {ViewportConfig} from "./primaryEffects/viewport/ViewportConfig.js";
import {ViewportEffect} from "./primaryEffects/viewport/ViewportEffect.js";
import {ThreeDimensionalShapeConfig} from "./primaryEffects/threeDimensionalShape/ThreeDimensionalShapeConfig.js";
import {ThreeDimensionalShapeEffect} from "./primaryEffects/threeDimensionalShape/ThreeDimensionalShapeEffect.js";
import {ThreeDimensionalRingsConfig} from "./primaryEffects/threeDimensionalRings/ThreeDimensionalRingsConfig.js";
import {ThreeDimensionalRingsEffect} from "./primaryEffects/threeDimensionalRings/ThreeDimensionalRingsEffect.js";
import {ScopesConfig} from "./primaryEffects/scopes/ScopesConfig.js";
import {ScopesEffect} from "./primaryEffects/scopes/ScopesEffect.js";
import {ScanLinesConfig} from "./primaryEffects/scanLines/ScanLinesConfig.js";
import {ScanLinesEffect} from "./primaryEffects/scanLines/ScanLinesEffect.js";
import {RayRingInvertedConfig} from "./primaryEffects/rayRingInverted/RayRingInvertedConfig.js";
import {RayRingInvertedEffect} from "./primaryEffects/rayRingInverted/RayRingInvertedEffect.js";
import {RayRingConfig} from "./primaryEffects/rayRing/RayRingConfig.js";
import {RayRingEffect} from "./primaryEffects/rayRing/RayRingEffect.js";
import {PorousConfig} from "./primaryEffects/porous/PorousConfig.js";
import {PorousEffect} from "./primaryEffects/porous/PorousEffect.js";
import {NthRingsConfig} from "./primaryEffects/nthRings/NthRingsConfig.js";
import {NthRingsEffect} from "./primaryEffects/nthRings/NthRingsEffect.js";
import {MappedFramesConfig} from "./primaryEffects/mappedFrames/MappedFramesConfig.js";
import {MappedFramesEffect} from "./primaryEffects/mappedFrames/MappedFramesEffect.js";
import {LensFlareConfig} from "./primaryEffects/lensFlare/LensFlareConfig.js";
import {LensFlareEffect} from "./primaryEffects/lensFlare/LensFlareEffect.js";
import {FadeEffect} from "./secondaryEffects/fade/FadeEffect.js";
import {FadeConfig} from "./secondaryEffects/fade/FadeConfig.js";
import {GlowEffect} from "./secondaryEffects/glow/GlowEffect.js";
import {GlowConfig} from "./secondaryEffects/glow/GlowConfig.js";
import {RandomizeEffect} from "./secondaryEffects/randomize/RandomizeEffect.js";
import {RandomizeConfig} from "./secondaryEffects/randomize/RandomizeConfig.js";
import {SingleLayerBlurEffect} from "./secondaryEffects/single-layer-blur/SingleLayerBlurEffect.js";
import {SingleLayerBlurConfig} from "./secondaryEffects/single-layer-blur/SingleLayerBlurConfig.js";
import {
    SingleLayerGlitchDrumrollHorizontalWaveEffect
} from "./secondaryEffects/single-layer-glitch-drumroll-horizontal-wave/SingleLayerGlitchDrumrollHorizontalWaveEffect.js";
import {
    SingleLayerGlitchDrumrollHorizontalWaveConfig
} from "./secondaryEffects/single-layer-glitch-drumroll-horizontal-wave/SingleLayerGlitchDrumrollHorizontalWaveConfig.js";
import {
    SingleLayerGlitchFractalEffect
} from "./secondaryEffects/single-layer-glitch-fractal/SingleLayerGlitchFractalEffect.js";
import {
    SingleLayerGlitchFractalConfig
} from "./secondaryEffects/single-layer-glitch-fractal/SingleLayerGlitchFractal.js";
import {PixelateEffect} from "./finalImageEffects/pixelate/PixelateEffect.js";
import {PixelateConfig} from "./finalImageEffects/pixelate/PixelateConfig.js";
import {GlitchInverseEffect} from "./finalImageEffects/glitchInverse/GlitchInverseEffect.js";
import {GlitchInverseConfig} from "./finalImageEffects/glitchInverse/GlitchInverseConfig.js";
import {GlitchFractalEffect} from "./finalImageEffects/glitchFractal/GlitchFractalEffect.js";
import {GlitchFractalConfig} from "./finalImageEffects/glitchFractal/GlitchFractalConfig.js";
import {
    GlitchDrumrollHorizontalWaveEffect
} from "./finalImageEffects/glitchDrumrollHorizontalWave/GlitchDrumrollHorizontalWaveEffect.js";
import {
    GlitchDrumrollHorizontalWaveConfig
} from "./finalImageEffects/glitchDrumrollHorizontalWave/GlitchDrumrollHorizontalWaveConfig.js";
import {BlurEffect} from "./finalImageEffects/blur/BlurEffect.js";
import {BlurConfig} from "./finalImageEffects/blur/BlurConfig.js";
import {EightConfig} from "./primaryEffects/eight/EightConfig.js";

export class LayerConfigFactory {
    constructor() {
    }

    static PrimaryEffect = {
        Default: '',
        Amp: 'Amp',
        AnimateBackground: 'Animate Background',
        BlinkOn: 'Blink On',
        Eight: 'Eight',
        EncircledSpiral: 'Encircled Spiral',
        FuzzyBands: 'Fuzzy Bands',
        FuzzyRipples: 'Fuzzy Ripples',
        Gates: 'Gates',
        Hex: 'Hex',
        ImageOverlay: 'Image Overlay',
        LayeredHex: 'Layered Hex',
        LayeredRing: 'Layered Ring',
        LensFlare: 'Lens Flare',
        MappedFrames: 'Mapped Frames',
        NthRings: 'Nth Rings',
        Porous: 'Porous',
        RayRing: 'RayRing',
        RayRingInverted: 'RayRingInverted',
        ScanLines: 'Scan Lines',
        Scopes: 'Scopes',
        ThreeDimensionalRings: '3D Rings',
        ThreeDimensionalShape: '3D Shape',
        Viewport: 'Viewport',
        WireframeSpiral: 'Wireframe Spiral'
    }

    static SecondaryEffect = {
        Default: '',
        Fade: 'Fade',
        Glow: 'Glow',
        Randomize: 'Randomize',
        SingleLayerBlur: 'Single Layer Blur',
        SingleLayerGlitchDrumrollHorizontalWave: 'Single Layer Glitch Drumroll Horizontal Wave',
        SingleLayerGlitchFractal: 'Single Layer Glitch Fractal'
    }

    static FinalEffect = {
        Default: '',
        Blur: 'Blur',
        GlitchDrumrollHorizontalWave: 'Glitch Drumroll Horizontal Wave',
        GlitchFractal: 'Glitch Fractal',
        GlitchInverse: 'Glitch Inverse',
        Pixelate: 'Pixelate'
    }

    static getFinalEffect = ({type = LayerConfigFactory.FinalEffect.Default}) => {
        switch (type) {
            case LayerConfigFactory.FinalEffect.Blur:
                return new LayerConfig({
                    effect: BlurEffect,
                    currentEffectConfig: new BlurConfig({}),
                    defaultEffectConfig: BlurConfig,
                });
            case LayerConfigFactory.FinalEffect.GlitchDrumrollHorizontalWave:
                return new LayerConfig({
                    effect: GlitchDrumrollHorizontalWaveEffect,
                    currentEffectConfig: new GlitchDrumrollHorizontalWaveConfig({}),
                    defaultEffectConfig: GlitchDrumrollHorizontalWaveConfig,
                });
            case LayerConfigFactory.FinalEffect.GlitchFractal:
                return new LayerConfig({
                    effect: GlitchFractalEffect,
                    currentEffectConfig: new GlitchFractalConfig({}),
                    defaultEffectConfig: GlitchFractalConfig,
                });
            case LayerConfigFactory.FinalEffect.GlitchInverse:
                return new LayerConfig({
                    effect: GlitchInverseEffect,
                    currentEffectConfig: new GlitchInverseConfig({}),
                    defaultEffectConfig: GlitchInverseConfig,
                });
            case LayerConfigFactory.FinalEffect.Pixelate:
                return new LayerConfig({
                    effect: PixelateEffect,
                    currentEffectConfig: new PixelateConfig({}),
                    defaultEffectConfig: PixelateConfig,
                });
            case LayerConfigFactory.FinalEffect.Default:
                return new LayerConfig({});
            default:
                throw 'Not a valid type';
        }
    }

    static getSecondaryEffect = ({type = LayerConfigFactory.SecondaryEffect.Default}) => {
        switch (type) {
            case LayerConfigFactory.SecondaryEffect.Fade:
                return new LayerConfig({
                    effect: FadeEffect,
                    currentEffectConfig: new FadeConfig({}),
                    defaultEffectConfig: FadeConfig,
                });
            case LayerConfigFactory.SecondaryEffect.Glow:
                return new LayerConfig({
                    effect: GlowEffect,
                    currentEffectConfig: new GlowConfig({}),
                    defaultEffectConfig: GlowConfig,
                });
            case LayerConfigFactory.SecondaryEffect.Randomize:
                return new LayerConfig({
                    effect: RandomizeEffect,
                    currentEffectConfig: new RandomizeConfig({}),
                    defaultEffectConfig: RandomizeConfig,
                });
            case LayerConfigFactory.SecondaryEffect.SingleLayerBlur:
                return new LayerConfig({
                    effect: SingleLayerBlurEffect,
                    currentEffectConfig: new SingleLayerBlurConfig({}),
                    defaultEffectConfig: SingleLayerBlurConfig,
                });
            case LayerConfigFactory.SecondaryEffect.SingleLayerGlitchDrumrollHorizontalWave:
                return new LayerConfig({
                    effect: SingleLayerGlitchDrumrollHorizontalWaveEffect,
                    currentEffectConfig: new SingleLayerGlitchDrumrollHorizontalWaveConfig({}),
                    defaultEffectConfig: SingleLayerGlitchDrumrollHorizontalWaveConfig,
                });
            case LayerConfigFactory.SecondaryEffect.SingleLayerGlitchFractal:
                return new LayerConfig({
                    effect: SingleLayerGlitchFractalEffect,
                    currentEffectConfig: new SingleLayerGlitchFractalConfig({}),
                    defaultEffectConfig: SingleLayerGlitchFractalConfig,
                });
            case LayerConfigFactory.SecondaryEffect.Default:
                return new LayerConfig({});
            default:
                throw 'Not a valid type';
        }
    }

    static getPrimaryEffect = ({type = LayerConfigFactory.PrimaryEffect.Default}) => {
        switch (type) {
            case LayerConfigFactory.PrimaryEffect.Amp:
                return new LayerConfig({
                    name: LayerConfigFactory.PrimaryEffect.Amp,
                    effect: AmpEffect,
                    currentEffectConfig: new AmpConfig({}),
                    defaultEffectConfig: AmpConfig,
                });
            case LayerConfigFactory.PrimaryEffect.AnimateBackground:
                return new LayerConfig({
                    effect: AnimateBackgroundEffect,
                    currentEffectConfig: new AnimateBackgroundConfig({}),
                    defaultEffectConfig: AnimateBackgroundConfig,
                });
            case LayerConfigFactory.PrimaryEffect.BlinkOn:
                return new LayerConfig({
                    effect: BlinkOnEffect,
                    currentEffectConfig: new BlinkConfig({}),
                    defaultEffectConfig: BlinkConfig,
                });
            case LayerConfigFactory.PrimaryEffect.Eight:
                return new LayerConfig({
                    effect: EightEffect,
                    currentEffectConfig: new EightConfig({}),
                    defaultEffectConfig: EightConfig,
                });
            case LayerConfigFactory.PrimaryEffect.EncircledSpiral:
                return new LayerConfig({
                    effect: EncircledSpiralEffect,
                    currentEffectConfig: new EncircledSpiralConfig({}),
                    defaultEffectConfig: EncircledSpiralConfig,
                });
            case LayerConfigFactory.PrimaryEffect.FuzzyBands:
                return new LayerConfig({
                    name: LayerConfigFactory.PrimaryEffect.FuzzyBands,
                    effect: FuzzyBandEffect,
                    currentEffectConfig: new FuzzyBandConfig({}),
                    defaultEffectConfig: FuzzyBandConfig,
                });
            case LayerConfigFactory.PrimaryEffect.FuzzyRipples:
                return new LayerConfig({
                    effect: FuzzyRipplesEffect,
                    currentEffectConfig: new FuzzyRipplesConfig({}),
                    defaultEffectConfig: FuzzyRipplesConfig,
                });
            case LayerConfigFactory.PrimaryEffect.Gates:
                return new LayerConfig({
                    effect: GatesEffect,
                    currentEffectConfig: new GatesConfig({}),
                    defaultEffectConfig: GatesConfig,
                });
            case LayerConfigFactory.PrimaryEffect.Hex:
                return new LayerConfig({
                    effect: HexEffect,
                    currentEffectConfig: new HexConfig({}),
                    defaultEffectConfig: HexConfig,
                });
            case LayerConfigFactory.PrimaryEffect.ImageOverlay:
                return new LayerConfig({
                    effect: ImageOverlayEffect,
                    currentEffectConfig: new ImageOverlayConfig({}),
                    defaultEffectConfig: ImageOverlayConfig,
                });
            case LayerConfigFactory.PrimaryEffect.LayeredHex:
                return new LayerConfig({
                    effect: LayeredHexEffect,
                    currentEffectConfig: new LayeredHexConfig({}),
                    defaultEffectConfig: LayeredHexConfig,
                });
            case LayerConfigFactory.PrimaryEffect.LayeredRing:
                return new LayerConfig({
                    effect: LayeredRingEffect,
                    currentEffectConfig: new LayeredRingConfig({}),
                    defaultEffectConfig: LayeredRingConfig,
                });
            case LayerConfigFactory.PrimaryEffect.LensFlare:
                return new LayerConfig({
                    effect: LensFlareEffect,
                    currentEffectConfig: new LensFlareConfig({}),
                    defaultEffectConfig: LensFlareConfig,
                });
            case LayerConfigFactory.PrimaryEffect.MappedFrames:
                return new LayerConfig({
                    effect: MappedFramesEffect,
                    currentEffectConfig: new MappedFramesConfig({}),
                    defaultEffectConfig: MappedFramesConfig,
                });
            case LayerConfigFactory.PrimaryEffect.NthRings:
                return new LayerConfig({
                    effect: NthRingsEffect,
                    currentEffectConfig: new NthRingsConfig({}),
                    defaultEffectConfig: NthRingsConfig,
                });
            case LayerConfigFactory.PrimaryEffect.Porous:
                return new LayerConfig({
                    effect: PorousEffect,
                    currentEffectConfig: new PorousConfig({}),
                    defaultEffectConfig: PorousConfig,
                });
            case LayerConfigFactory.PrimaryEffect.RayRing:
                return new LayerConfig({
                    effect: RayRingEffect,
                    currentEffectConfig: new RayRingConfig({}),
                    defaultEffectConfig: RayRingConfig,
                });
            case LayerConfigFactory.PrimaryEffect.RayRingInverted:
                return new LayerConfig({
                    effect: RayRingInvertedEffect,
                    currentEffectConfig: new RayRingInvertedConfig({}),
                    defaultEffectConfig: RayRingInvertedConfig,
                });
            case LayerConfigFactory.PrimaryEffect.ScanLines:
                return new LayerConfig({
                    effect: ScanLinesEffect,
                    currentEffectConfig: new ScanLinesConfig({}),
                    defaultEffectConfig: ScanLinesConfig,
                });
            case LayerConfigFactory.PrimaryEffect.Scopes:
                return new LayerConfig({
                    effect: ScopesEffect,
                    currentEffectConfig: new ScopesConfig({}),
                    defaultEffectConfig: ScopesConfig,
                });
            case LayerConfigFactory.PrimaryEffect.ThreeDimensionalRings:
                return new LayerConfig({
                    effect: ThreeDimensionalRingsEffect,
                    currentEffectConfig: new ThreeDimensionalRingsConfig({}),
                    defaultEffectConfig: ThreeDimensionalRingsConfig,
                });
            case LayerConfigFactory.PrimaryEffect.ThreeDimensionalShape:
                return new LayerConfig({
                    effect: ThreeDimensionalShapeEffect,
                    currentEffectConfig: new ThreeDimensionalShapeConfig({}),
                    defaultEffectConfig: ThreeDimensionalShapeConfig,
                });
            case LayerConfigFactory.PrimaryEffect.Viewport:
                return new LayerConfig({
                    name: LayerConfigFactory.PrimaryEffect.Viewport,
                    effect: ViewportEffect,
                    currentEffectConfig: new ViewportConfig({}),
                    defaultEffectConfig: ViewportConfig,
                });
            case LayerConfigFactory.PrimaryEffect.WireframeSpiral:
                return new LayerConfig({
                    effect: WireFrameSpiralEffect,
                    currentEffectConfig: new WireframeSpiralConfig({}),
                    defaultEffectConfig: WireframeSpiralConfig,
                });
            case LayerConfigFactory.PrimaryEffect.Default:
                return new LayerConfig({});
            default:
                throw 'Not a valid type';
        }
    }

}