import { LayerConfig } from './LayerConfig.js';
import { AmpConfig } from '../../effects/primaryEffects/amp/AmpConfig.js';
import { AmpEffect } from '../../effects/primaryEffects/amp/AmpEffect.js';
import { AnimateBackgroundEffect } from '../../effects/primaryEffects/animateBackground/AnimateBackgroundEffect.js';
import { AnimateBackgroundConfig } from '../../effects/primaryEffects/animateBackground/AnimateBackgroundConfig.js';
import { BlinkOnEffect } from '../../effects/primaryEffects/blink-on-blink-on-blink-redux/BlinkOnEffect.js';
import { BlinkConfig } from '../../effects/primaryEffects/blink-on-blink-on-blink-redux/BlinkOnConfig.js';
import { EightEffect } from '../../effects/primaryEffects/eight/EightEffect.js';
import { EncircledSpiralEffect } from '../../effects/primaryEffects/encircledSpiral/EncircledSpiralEffect.js';
import { EncircledSpiralConfig } from '../../effects/primaryEffects/encircledSpiral/EncircledSpiralConfig.js';
import { FuzzyBandEffect } from '../../effects/primaryEffects/fuzzyBands/FuzzyBandEffect.js';
import { FuzzyBandConfig } from '../../effects/primaryEffects/fuzzyBands/FuzzyBandConfig.js';
import { FuzzyRipplesEffect } from '../../effects/primaryEffects/fuzzyRipples/FuzzyRipplesEffect.js';
import { FuzzyRipplesConfig } from '../../effects/primaryEffects/fuzzyRipples/FuzzyRipplesConfig.js';
import { GatesEffect } from '../../effects/primaryEffects/gates/GatesEffect.js';
import { GatesConfig } from '../../effects/primaryEffects/gates/GatesConfig.js';
import { HexEffect } from '../../effects/primaryEffects/hex/HexEffect.js';
import { HexConfig } from '../../effects/primaryEffects/hex/HexConfig.js';
import { ImageOverlayEffect } from '../../effects/primaryEffects/imageOverlay/ImageOverlayEffect.js';
import { ImageOverlayConfig } from '../../effects/primaryEffects/imageOverlay/ImageOverlayConfig.js';
import { LayeredHexEffect } from '../../effects/primaryEffects/layeredHex/LayeredHexEffect.js';
import { LayeredHexConfig } from '../../effects/primaryEffects/layeredHex/LayeredHexConfig.js';
import { LayeredRingEffect } from '../../effects/primaryEffects/layeredRing/LayeredRingEffect.js';
import { LayeredRingConfig } from '../../effects/primaryEffects/layeredRing/LayeredRingConfig.js';
import { WireframeSpiralConfig } from '../../effects/primaryEffects/wireframeSpiral/WireframeSpiralConfig.js';
import { WireFrameSpiralEffect } from '../../effects/primaryEffects/wireframeSpiral/WireFrameSpiralEffect.js';
import { ViewportConfig } from '../../effects/primaryEffects/viewport/ViewportConfig.js';
import { ViewportEffect } from '../../effects/primaryEffects/viewport/ViewportEffect.js';
import { ScopesConfig } from '../../effects/primaryEffects/scopes/ScopesConfig.js';
import { ScopesEffect } from '../../effects/primaryEffects/scopes/ScopesEffect.js';
import { ScanLinesConfig } from '../../effects/primaryEffects/scanLines/ScanLinesConfig.js';
import { ScanLinesEffect } from '../../effects/primaryEffects/scanLines/ScanLinesEffect.js';
import { RayRingInvertedConfig } from '../../effects/primaryEffects/rayRingInverted/RayRingInvertedConfig.js';
import { RayRingInvertedEffect } from '../../effects/primaryEffects/rayRingInverted/RayRingInvertedEffect.js';
import { RayRingConfig } from '../../effects/primaryEffects/rayRing/RayRingConfig.js';
import { RayRingEffect } from '../../effects/primaryEffects/rayRing/RayRingEffect.js';
import { PorousConfig } from '../../effects/primaryEffects/porous/PorousConfig.js';
import { PorousEffect } from '../../effects/primaryEffects/porous/PorousEffect.js';
import { NthRingsConfig } from '../../effects/primaryEffects/nthRings/NthRingsConfig.js';
import { NthRingsEffect } from '../../effects/primaryEffects/nthRings/NthRingsEffect.js';
import { MappedFramesConfig } from '../../effects/primaryEffects/mappedFrames/MappedFramesConfig.js';
import { MappedFramesEffect } from '../../effects/primaryEffects/mappedFrames/MappedFramesEffect.js';
import { LensFlareConfig } from '../../effects/primaryEffects/lensFlare/LensFlareConfig.js';
import { LensFlareEffect } from '../../effects/primaryEffects/lensFlare/LensFlareEffect.js';
import { FadeEffect } from '../../effects/secondaryEffects/fade/FadeEffect.js';
import { FadeConfig } from '../../effects/secondaryEffects/fade/FadeConfig.js';
import { GlowEffect } from '../../effects/secondaryEffects/glow/GlowEffect.js';
import { GlowConfig } from '../../effects/secondaryEffects/glow/GlowConfig.js';
import { RandomizeEffect } from '../../effects/secondaryEffects/randomize/RandomizeEffect.js';
import { RandomizeConfig } from '../../effects/secondaryEffects/randomize/RandomizeConfig.js';
import { SingleLayerBlurEffect } from '../../effects/secondaryEffects/single-layer-blur/SingleLayerBlurEffect.js';
import { SingleLayerBlurConfig } from '../../effects/secondaryEffects/single-layer-blur/SingleLayerBlurConfig.js';
import {
    SingleLayerGlitchDrumrollHorizontalWaveEffect,
} from '../../effects/secondaryEffects/single-layer-glitch-drumroll-horizontal-wave/SingleLayerGlitchDrumrollHorizontalWaveEffect.js';
import {
    SingleLayerGlitchDrumrollHorizontalWaveConfig,
} from '../../effects/secondaryEffects/single-layer-glitch-drumroll-horizontal-wave/SingleLayerGlitchDrumrollHorizontalWaveConfig.js';
import {
    SingleLayerGlitchFractalEffect,
} from '../../effects/secondaryEffects/single-layer-glitch-fractal/SingleLayerGlitchFractalEffect.js';
import {
    SingleLayerGlitchFractalConfig,
} from '../../effects/secondaryEffects/single-layer-glitch-fractal/SingleLayerGlitchFractal.js';
import { PixelateEffect } from '../../effects/finalImageEffects/pixelate/PixelateEffect.js';
import { PixelateConfig } from '../../effects/finalImageEffects/pixelate/PixelateConfig.js';
import { GlitchInverseEffect } from '../../effects/finalImageEffects/glitchInverse/GlitchInverseEffect.js';
import { GlitchInverseConfig } from '../../effects/finalImageEffects/glitchInverse/GlitchInverseConfig.js';
import { GlitchFractalEffect } from '../../effects/finalImageEffects/glitchFractal/GlitchFractalEffect.js';
import { GlitchFractalConfig } from '../../effects/finalImageEffects/glitchFractal/GlitchFractalConfig.js';
import {
    GlitchDrumrollHorizontalWaveEffect,
} from '../../effects/finalImageEffects/glitchDrumrollHorizontalWave/GlitchDrumrollHorizontalWaveEffect.js';
import {
    GlitchDrumrollHorizontalWaveConfig,
} from '../../effects/finalImageEffects/glitchDrumrollHorizontalWave/GlitchDrumrollHorizontalWaveConfig.js';
import { BlurEffect } from '../../effects/finalImageEffects/blur/BlurEffect.js';
import { BlurConfig } from '../../effects/finalImageEffects/blur/BlurConfig.js';
import { EightConfig } from '../../effects/primaryEffects/eight/EightConfig.js';

export class LayerConfigFactory {
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
        WireframeSpiral: 'Wireframe Spiral',
    };

    static SecondaryEffect = {
        Default: '',
        Fade: 'Fade',
        Glow: 'Glow',
        Randomize: 'Randomize',
        SingleLayerBlur: 'Single Layer Blur',
        SingleLayerGlitchDrumrollHorizontalWave: 'Single Layer Glitch Drumroll Horizontal Wave',
        SingleLayerGlitchFractal: 'Single Layer Glitch Fractal',
    };

    static FinalEffect = {
        Default: '',
        Blur: 'Blur',
        GlitchDrumrollHorizontalWave: 'Glitch Drumroll Horizontal Wave',
        GlitchFractal: 'Glitch Fractal',
        GlitchInverse: 'Glitch Inverse',
        Pixelate: 'Pixelate',
    };

    static getFinalEffect = ({ type = LayerConfigFactory.FinalEffect.Default }) => {
        switch (type) {
        case LayerConfigFactory.FinalEffect.Blur:
            return new LayerConfig({
                Effect: BlurEffect,
                currentEffectConfig: new BlurConfig({}),
                defaultEffectConfig: BlurConfig,
            });
        case LayerConfigFactory.FinalEffect.GlitchDrumrollHorizontalWave:
            return new LayerConfig({
                Effect: GlitchDrumrollHorizontalWaveEffect,
                currentEffectConfig: new GlitchDrumrollHorizontalWaveConfig({}),
                defaultEffectConfig: GlitchDrumrollHorizontalWaveConfig,
            });
        case LayerConfigFactory.FinalEffect.GlitchFractal:
            return new LayerConfig({
                Effect: GlitchFractalEffect,
                currentEffectConfig: new GlitchFractalConfig({}),
                defaultEffectConfig: GlitchFractalConfig,
            });
        case LayerConfigFactory.FinalEffect.GlitchInverse:
            return new LayerConfig({
                Effect: GlitchInverseEffect,
                currentEffectConfig: new GlitchInverseConfig({}),
                defaultEffectConfig: GlitchInverseConfig,
            });
        case LayerConfigFactory.FinalEffect.Pixelate:
            return new LayerConfig({
                Effect: PixelateEffect,
                currentEffectConfig: new PixelateConfig({}),
                defaultEffectConfig: PixelateConfig,
            });
        case LayerConfigFactory.FinalEffect.Default:
            return new LayerConfig({});
        default:
            throw new Error('Not a valid type');
        }
    };

    static getSecondaryEffect = ({ type = LayerConfigFactory.SecondaryEffect.Default }) => {
        switch (type) {
        case LayerConfigFactory.SecondaryEffect.Fade:
            return new LayerConfig({
                Effect: FadeEffect,
                currentEffectConfig: new FadeConfig({}),
                defaultEffectConfig: FadeConfig,
            });
        case LayerConfigFactory.SecondaryEffect.Glow:
            return new LayerConfig({
                Effect: GlowEffect,
                currentEffectConfig: new GlowConfig({}),
                defaultEffectConfig: GlowConfig,
            });
        case LayerConfigFactory.SecondaryEffect.Randomize:
            return new LayerConfig({
                Effect: RandomizeEffect,
                currentEffectConfig: new RandomizeConfig({}),
                defaultEffectConfig: RandomizeConfig,
            });
        case LayerConfigFactory.SecondaryEffect.SingleLayerBlur:
            return new LayerConfig({
                Effect: SingleLayerBlurEffect,
                currentEffectConfig: new SingleLayerBlurConfig({}),
                defaultEffectConfig: SingleLayerBlurConfig,
            });
        case LayerConfigFactory.SecondaryEffect.SingleLayerGlitchDrumrollHorizontalWave:
            return new LayerConfig({
                Effect: SingleLayerGlitchDrumrollHorizontalWaveEffect,
                currentEffectConfig: new SingleLayerGlitchDrumrollHorizontalWaveConfig({}),
                defaultEffectConfig: SingleLayerGlitchDrumrollHorizontalWaveConfig,
            });
        case LayerConfigFactory.SecondaryEffect.SingleLayerGlitchFractal:
            return new LayerConfig({
                Effect: SingleLayerGlitchFractalEffect,
                currentEffectConfig: new SingleLayerGlitchFractalConfig({}),
                defaultEffectConfig: SingleLayerGlitchFractalConfig,
            });
        case LayerConfigFactory.SecondaryEffect.Default:
            return new LayerConfig({});
        default:
            throw new Error('Not a valid type');
        }
    };

    static getPrimaryEffect = ({ type = LayerConfigFactory.PrimaryEffect.Default }) => {
        switch (type) {
        case LayerConfigFactory.PrimaryEffect.Amp:
            return new LayerConfig({
                name: LayerConfigFactory.PrimaryEffect.Amp,
                Effect: AmpEffect,
                currentEffectConfig: new AmpConfig({}),
                defaultEffectConfig: AmpConfig,
            });
        case LayerConfigFactory.PrimaryEffect.AnimateBackground:
            return new LayerConfig({
                Effect: AnimateBackgroundEffect,
                currentEffectConfig: new AnimateBackgroundConfig({}),
                defaultEffectConfig: AnimateBackgroundConfig,
            });
        case LayerConfigFactory.PrimaryEffect.BlinkOn:
            return new LayerConfig({
                Effect: BlinkOnEffect,
                currentEffectConfig: new BlinkConfig({}),
                defaultEffectConfig: BlinkConfig,
            });
        case LayerConfigFactory.PrimaryEffect.Eight:
            return new LayerConfig({
                Effect: EightEffect,
                currentEffectConfig: new EightConfig({}),
                defaultEffectConfig: EightConfig,
            });
        case LayerConfigFactory.PrimaryEffect.EncircledSpiral:
            return new LayerConfig({
                Effect: EncircledSpiralEffect,
                currentEffectConfig: new EncircledSpiralConfig({}),
                defaultEffectConfig: EncircledSpiralConfig,
            });
        case LayerConfigFactory.PrimaryEffect.FuzzyBands:
            return new LayerConfig({
                name: LayerConfigFactory.PrimaryEffect.FuzzyBands,
                Effect: FuzzyBandEffect,
                currentEffectConfig: new FuzzyBandConfig({}),
                defaultEffectConfig: FuzzyBandConfig,
            });
        case LayerConfigFactory.PrimaryEffect.FuzzyRipples:
            return new LayerConfig({
                Effect: FuzzyRipplesEffect,
                currentEffectConfig: new FuzzyRipplesConfig({}),
                defaultEffectConfig: FuzzyRipplesConfig,
            });
        case LayerConfigFactory.PrimaryEffect.Gates:
            return new LayerConfig({
                Effect: GatesEffect,
                currentEffectConfig: new GatesConfig({}),
                defaultEffectConfig: GatesConfig,
            });
        case LayerConfigFactory.PrimaryEffect.Hex:
            return new LayerConfig({
                Effect: HexEffect,
                currentEffectConfig: new HexConfig({}),
                defaultEffectConfig: HexConfig,
            });
        case LayerConfigFactory.PrimaryEffect.ImageOverlay:
            return new LayerConfig({
                Effect: ImageOverlayEffect,
                currentEffectConfig: new ImageOverlayConfig({}),
                defaultEffectConfig: ImageOverlayConfig,
            });
        case LayerConfigFactory.PrimaryEffect.LayeredHex:
            return new LayerConfig({
                Effect: LayeredHexEffect,
                currentEffectConfig: new LayeredHexConfig({}),
                defaultEffectConfig: LayeredHexConfig,
            });
        case LayerConfigFactory.PrimaryEffect.LayeredRing:
            return new LayerConfig({
                Effect: LayeredRingEffect,
                currentEffectConfig: new LayeredRingConfig({}),
                defaultEffectConfig: LayeredRingConfig,
            });
        case LayerConfigFactory.PrimaryEffect.LensFlare:
            return new LayerConfig({
                Effect: LensFlareEffect,
                currentEffectConfig: new LensFlareConfig({}),
                defaultEffectConfig: LensFlareConfig,
            });
        case LayerConfigFactory.PrimaryEffect.MappedFrames:
            return new LayerConfig({
                Effect: MappedFramesEffect,
                currentEffectConfig: new MappedFramesConfig({}),
                defaultEffectConfig: MappedFramesConfig,
            });
        case LayerConfigFactory.PrimaryEffect.NthRings:
            return new LayerConfig({
                Effect: NthRingsEffect,
                currentEffectConfig: new NthRingsConfig({}),
                defaultEffectConfig: NthRingsConfig,
            });
        case LayerConfigFactory.PrimaryEffect.Porous:
            return new LayerConfig({
                Effect: PorousEffect,
                currentEffectConfig: new PorousConfig({}),
                defaultEffectConfig: PorousConfig,
            });
        case LayerConfigFactory.PrimaryEffect.RayRing:
            return new LayerConfig({
                Effect: RayRingEffect,
                currentEffectConfig: new RayRingConfig({}),
                defaultEffectConfig: RayRingConfig,
            });
        case LayerConfigFactory.PrimaryEffect.RayRingInverted:
            return new LayerConfig({
                Effect: RayRingInvertedEffect,
                currentEffectConfig: new RayRingInvertedConfig({}),
                defaultEffectConfig: RayRingInvertedConfig,
            });
        case LayerConfigFactory.PrimaryEffect.ScanLines:
            return new LayerConfig({
                Effect: ScanLinesEffect,
                currentEffectConfig: new ScanLinesConfig({}),
                defaultEffectConfig: ScanLinesConfig,
            });
        case LayerConfigFactory.PrimaryEffect.Scopes:
            return new LayerConfig({
                Effect: ScopesEffect,
                currentEffectConfig: new ScopesConfig({}),
                defaultEffectConfig: ScopesConfig,
            });
        case LayerConfigFactory.PrimaryEffect.ThreeDimensionalRings:
            return new LayerConfig({
                Effect: ThreeDimensionalRingsEffect,
                currentEffectConfig: new ThreeDimensionalRingsConfig({}),
                defaultEffectConfig: ThreeDimensionalRingsConfig,
            });
        case LayerConfigFactory.PrimaryEffect.ThreeDimensionalShape:
            return new LayerConfig({
                Effect: ThreeDimensionalShapeEffect,
                currentEffectConfig: new ThreeDimensionalShapeConfig({}),
                defaultEffectConfig: ThreeDimensionalShapeConfig,
            });
        case LayerConfigFactory.PrimaryEffect.Viewport:
            return new LayerConfig({
                name: LayerConfigFactory.PrimaryEffect.Viewport,
                Effect: ViewportEffect,
                currentEffectConfig: new ViewportConfig({}),
                defaultEffectConfig: ViewportConfig,
            });
        case LayerConfigFactory.PrimaryEffect.WireframeSpiral:
            return new LayerConfig({
                Effect: WireFrameSpiralEffect,
                currentEffectConfig: new WireframeSpiralConfig({}),
                defaultEffectConfig: WireframeSpiralConfig,
            });
        case LayerConfigFactory.PrimaryEffect.Default:
            return new LayerConfig({});
        default:
            throw new Error('Not a valid type');
        }
    };
}
