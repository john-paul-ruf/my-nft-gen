import { BlurEffect } from '../../effects/finalImageEffects/blur/BlurEffect.js';
import { SingleLayerGlitchDrumrollHorizontalWaveEffect } from '../../effects/secondaryEffects/single-layer-glitch-drumroll-horizontal-wave/SingleLayerGlitchDrumrollHorizontalWaveEffect.js';
import { GlitchFractalEffect } from '../../effects/finalImageEffects/glitchFractal/GlitchFractalEffect.js';
import { GlitchInverseEffect } from '../../effects/finalImageEffects/glitchInverse/GlitchInverseEffect.js';
import { PixelateEffect } from '../../effects/finalImageEffects/pixelate/PixelateEffect.js';
import { AmpEffect } from '../../effects/primaryEffects/amp/AmpEffect.js';
import { BlinkOnEffect } from '../../effects/primaryEffects/blink-on-blink-on-blink-redux/BlinkOnEffect.js';
import { EncircledSpiralEffect } from '../../effects/primaryEffects/encircledSpiral/EncircledSpiralEffect.js';
import { FuzzyBandEffect } from '../../effects/primaryEffects/fuzzyBands/FuzzyBandEffect.js';
import { FuzzyRipplesEffect } from '../../effects/primaryEffects/fuzzyRipples/FuzzyRipplesEffect.js';
import { GatesEffect } from '../../effects/primaryEffects/gates/GatesEffect.js';
import { HexEffect } from '../../effects/primaryEffects/hex/HexEffect.js';
import { ImageOverlayEffect } from '../../effects/primaryEffects/imageOverlay/ImageOverlayEffect.js';
import { LayeredHexEffect } from '../../effects/primaryEffects/layeredHex/LayeredHexEffect.js';
import { LayeredRingEffect } from '../../effects/primaryEffects/layeredRing/LayeredRingEffect.js';
import { LensFlareEffect } from '../../effects/primaryEffects/lensFlare/LensFlareEffect.js';
import { MappedFramesEffect } from '../../effects/primaryEffects/mappedFrames/MappedFramesEffect.js';
import { NthRingsEffect } from '../../effects/primaryEffects/nthRings/NthRingsEffect.js';
import { PorousEffect } from '../../effects/primaryEffects/porous/PorousEffect.js';
import { RayRingEffect } from '../../effects/primaryEffects/rayRing/RayRingEffect.js';
import { RayRingInvertedEffect } from '../../effects/primaryEffects/rayRingInverted/RayRingInvertedEffect.js';
import { ScanLinesEffect } from '../../effects/primaryEffects/scanLines/ScanLinesEffect.js';
import { ScopesEffect } from '../../effects/primaryEffects/scopes/ScopesEffect.js';
import { ViewportEffect } from '../../effects/primaryEffects/viewport/ViewportEffect.js';
import { FadeEffect } from '../../effects/secondaryEffects/fade/FadeEffect.js';
import { GlowEffect } from '../../effects/secondaryEffects/glow/GlowEffect.js';
import { RandomizeEffect } from '../../effects/secondaryEffects/randomize/RandomizeEffect.js';
import { SingleLayerBlurEffect } from '../../effects/secondaryEffects/single-layer-blur/SingleLayerBlurEffect.js';
import { SingleLayerGlitchFractalEffect } from '../../effects/secondaryEffects/single-layer-glitch-fractal/SingleLayerGlitchFractalEffect.js';
import { LayerEffect } from './LayerEffect.js';
import { RedEyeEffect } from '../../effects/primaryEffects/red-eye/RedEyeEffect.js';
import { FuzzFlareEffect } from '../../effects/primaryEffects/fuzz-flare/FuzzFlareEffect.js';
import { CRTScanLinesEffect } from '../../effects/finalImageEffects/crtScanLines/CRTScanLinesEffect.js';
import { CRTShadowEffect } from '../../effects/finalImageEffects/crtShadow/CRTShadowEffect.js';
import { CRTBarrelEffect } from '../../effects/finalImageEffects/crtBarrel/CRTBarrelEffect.js';
import { CRTDegaussEffect } from '../../effects/keyFrameEffects/crtDegaussEvent/CRTDegaussEffect.js';
import { PixelateKeyFrameEffect } from '../../effects/keyFrameEffects/pixelate/PixelateKeyFrameEffect.js';
import { FadeKeyFrameEffect } from '../../effects/keyFrameEffects/fade/FadeKeyFrameEffect.js';
import { GlowKeyFrameEffect } from '../../effects/keyFrameEffects/glow/GlowKeyFrameEffect.js';
import { BlurKeyFrameEffect } from '../../effects/keyFrameEffects/blur/BlurKeyFrameEffect.js';
import { StaticPathEffect } from '../../effects/primaryEffects/static-path/StaticPathEffect.js';
import { StaticPathConfig } from '../../effects/primaryEffects/static-path/StaticPathConfig.js';
import { ModulateEffect } from '../../effects/finalImageEffects/modulate/ModulateEffect.js';
import {ArcPath} from "../position/ArcPath.js";
import {Position} from "../position/Position.js";
import {CurvedRedEyeConfig} from "../../effects/primaryEffects/curved-red-eye/CurvedRedEyeConfig.js";
import {CurvedRedEyeEffect} from "../../effects/primaryEffects/curved-red-eye/CurvedRedEyeEffect.js";
import {
    StaticImageKeyFrameEffect
} from "../../effects/keyFrameEffects/staticImageKeyFrame/StaticImageKeyFrameEffect.js";
import { RollingGradientEffect } from "../../effects/primaryEffects/rollingGradient/RollingGradientEffect.js";
import {SetOpacityKeyFrameEffect} from "../../effects/keyFrameEffects/setOpacity/SetOpacityKeyFrameEffect.js";
import {BloomFilmGrainEffect} from "../../effects/finalImageEffects/bloomFilmGrain/BloomFilmGrainEffect.js";
import {EdgeGlowEffect} from "../../effects/secondaryEffects/edgeGlow/EdgeGlowEffect.js";

export class LayerEffectFromJSON {
    static from(json) {
        let layer = new LayerEffect({});

        switch (json.name) {
            case BlurEffect._name_:
                layer = Object.assign(new BlurEffect({}), json);
                break;
            case SingleLayerGlitchDrumrollHorizontalWaveEffect._name_:
                layer = Object.assign(new SingleLayerGlitchDrumrollHorizontalWaveEffect({}), json);
                break;
            case GlitchFractalEffect._name_:
                layer = Object.assign(new GlitchFractalEffect({}), json);
                break;
            case GlitchInverseEffect._name_:
                layer = Object.assign(new GlitchInverseEffect({}), json);
                break;
            case PixelateEffect._name_:
                layer = Object.assign(new PixelateEffect({}), json);
                break;
            case ModulateEffect._name_:
                layer = Object.assign(new ModulateEffect({}), json);
                break;
            case AmpEffect._name_:
                layer = Object.assign(new AmpEffect({}), json);
                break;
            case BlinkOnEffect._name_:
                layer = Object.assign(new BlinkOnEffect({}), json);
                break;
            case EncircledSpiralEffect._name_:
                layer = Object.assign(new EncircledSpiralEffect({}), json);
                break;
            case FuzzyBandEffect._name_:
                layer = Object.assign(new FuzzyBandEffect({}), json);
                break;
            case FuzzyRipplesEffect._name_:
                layer = Object.assign(new FuzzyRipplesEffect({}), json);
                break;
            case GatesEffect._name_:
                layer = Object.assign(new GatesEffect({}), json);
                break;
            case HexEffect._name_:
                layer = Object.assign(new HexEffect({}), json);
                break;
            case ImageOverlayEffect._name_:
                layer = Object.assign(new ImageOverlayEffect({}), json);
                break;
            case LayeredHexEffect._name_:
                layer = Object.assign(new LayeredHexEffect({}), json);
                break;
            case LayeredRingEffect._name_:
                layer = Object.assign(new LayeredRingEffect({}), json);
                break;
            case LensFlareEffect._name_:
                layer = Object.assign(new LensFlareEffect({}), json);
                break;
            case MappedFramesEffect._name_:
                layer = Object.assign(new MappedFramesEffect({}), json);
                break;
            case NthRingsEffect._name_:
                layer = Object.assign(new NthRingsEffect({}), json);
                break;
            case PorousEffect._name_:
                layer = Object.assign(new PorousEffect({}), json);
                break;
            case RayRingEffect._name_:
                layer = Object.assign(new RayRingEffect({}), json);
                break;
            case RayRingInvertedEffect._name_:
                layer = Object.assign(new RayRingInvertedEffect({}), json);
                break;
            case ScanLinesEffect._name_:
                layer = Object.assign(new ScanLinesEffect({}), json);
                break;
            case ScopesEffect._name_:
                layer = Object.assign(new ScopesEffect({}), json);
                break;
            case ViewportEffect._name_:
                layer = Object.assign(new ViewportEffect({}), json);
                break;
            case RedEyeEffect._name_:
                layer = Object.assign(new RedEyeEffect({}), json);
                break;
            case FuzzFlareEffect._name_:
                layer = Object.assign(new FuzzFlareEffect({}), json);
                break;
            case CRTScanLinesEffect._name_:
                layer = Object.assign(new CRTScanLinesEffect({}), json);
                break;
            case CRTShadowEffect._name_:
                layer = Object.assign(new CRTShadowEffect({}), json);
                break;
            case CRTBarrelEffect._name_:
                layer = Object.assign(new CRTBarrelEffect({}), json);
                break;
            case CRTDegaussEffect._name_:
                layer = Object.assign(new CRTDegaussEffect({}), json);
                break;
            case StaticPathEffect._name_:
                layer = Object.assign(new StaticPathEffect({}), json);
                break;
            case GlowEffect._name_:
                layer = Object.assign(new GlowEffect({}), json);
                break;
            case CurvedRedEyeEffect._name_:
                layer = Object.assign(new CurvedRedEyeEffect({}), json);
                break;
            case StaticImageKeyFrameEffect._name_:
                layer = Object.assign(new StaticImageKeyFrameEffect({}), json);
                break;
            case BloomFilmGrainEffect._name_:
                layer = Object.assign(new BloomFilmGrainEffect({}), json);
                break;
            case RollingGradientEffect._name_:
                layer = Object.assign(new RollingGradientEffect({}), json);
                break;
            default:
                throw new Error('Not a valid effect name');
        }

        layer.data = json.data;

        // Hydrate additionalEffects
        for (let i = 0; i < layer.additionalEffects.length; i++) {
            const { data } = layer.additionalEffects[i];

            switch (layer.additionalEffects[i].name) {
                case FadeEffect._name_:
                    layer.additionalEffects[i] = Object.assign(new FadeEffect({}), layer.additionalEffects[i]);
                    break;
                case GlowEffect._name_:
                    layer.additionalEffects[i] = Object.assign(new GlowEffect({}), layer.additionalEffects[i]);
                    break;
                case RandomizeEffect._name_:
                    layer.additionalEffects[i] = Object.assign(new RandomizeEffect({}), layer.additionalEffects[i]);
                    break;
                case SingleLayerBlurEffect._name_:
                    layer.additionalEffects[i] = Object.assign(new SingleLayerBlurEffect({}), layer.additionalEffects[i]);
                    break;
                case SingleLayerGlitchDrumrollHorizontalWaveEffect._name_:
                    layer.additionalEffects[i] = Object.assign(new SingleLayerGlitchDrumrollHorizontalWaveEffect({}), layer.additionalEffects[i]);
                    break;
                case SingleLayerGlitchFractalEffect._name_:
                    layer.additionalEffects[i] = Object.assign(new SingleLayerGlitchFractalEffect({}), layer.additionalEffects[i]);
                    break;
                case CRTDegaussEffect._name_:
                    layer.additionalEffects[i] = Object.assign(new CRTDegaussEffect({}), layer.additionalEffects[i]);
                    break;
                case PixelateKeyFrameEffect._name_:
                    layer.additionalEffects[i] = Object.assign(new PixelateKeyFrameEffect({}), layer.additionalEffects[i]);
                    break;
                case FadeKeyFrameEffect._name_:
                    layer.additionalEffects[i] = Object.assign(new FadeKeyFrameEffect({}), layer.additionalEffects[i]);
                    break;
                case GlowKeyFrameEffect._name_:
                    layer.additionalEffects[i] = Object.assign(new GlowKeyFrameEffect({}), layer.additionalEffects[i]);
                    break;
                case BlurKeyFrameEffect._name_:
                    layer.additionalEffects[i] = Object.assign(new BlurKeyFrameEffect({}), layer.additionalEffects[i]);
                    break;
                case SetOpacityKeyFrameEffect._name_:
                    layer.additionalEffects[i] = Object.assign(new SetOpacityKeyFrameEffect({}), layer.additionalEffects[i]);
                    break;
                case EdgeGlowEffect._name_:
                    layer.additionalEffects[i] = Object.assign(new EdgeGlowEffect({}), layer.additionalEffects[i]);
                    break;
                default:
                    throw new Error('Not a valid effect name');
            }

            layer.additionalEffects[i].data = data;
        }

        // Hydrate layer.data.center if present
        if (layer.data?.center?.name) {
            switch (layer.data.center.name) {
                case ArcPath._name_:
                    layer.data.center = Object.assign(new ArcPath({}), layer.data.center);
                    break;
                case Position._name_:
                    layer.data.center = Object.assign(new Position({}), layer.data.center);
                    break;
                default:
                    throw new Error(`Unknown center type: ${layer.data.center.name}`);
            }
        }

        return layer;
    }
}
