import {BlurEffect} from "./finalImageEffects/blur/BlurEffect.js";
import {
    SingleLayerGlitchDrumrollHorizontalWaveEffect
} from "./secondaryEffects/single-layer-glitch-drumroll-horizontal-wave/SingleLayerGlitchDrumrollHorizontalWaveEffect.js";
import {GlitchFractalEffect} from "./finalImageEffects/glitchFractal/GlitchFractalEffect.js";
import {GlitchInverseEffect} from "./finalImageEffects/glitchInverse/GlitchInverseEffect.js";
import {PixelateEffect} from "./finalImageEffects/pixelate/PixelateEffect.js";
import {AmpEffect} from "./primaryEffects/amp/AmpEffect.js";
import {AnimateBackgroundEffect} from "./primaryEffects/animateBackground/AnimateBackgroundEffect.js";
import {BlinkOnEffect} from "./primaryEffects/blink-on-blink-on-blink-redux/BlinkEffect.js";
import {EightEffect} from "./primaryEffects/eight/EightEffect.js";
import {EncircledSpiralEffect} from "./primaryEffects/encircledSpiral/EncircledSpiralEffect.js";
import {FuzzyBandEffect} from "./primaryEffects/fuzzyBands/FuzzyBandEffect.js";
import {FuzzyRipplesEffect} from "./primaryEffects/fuzzyRipples/FuzzyRipplesEffect.js";
import {GatesEffect} from "./primaryEffects/gates/GatesEffect.js";
import {HexEffect} from "./primaryEffects/hex/HexEffect.js";
import {ImageOverlayEffect} from "./primaryEffects/imageOverlay/ImageOverlayEffect.js";
import {LayeredHexEffect} from "./primaryEffects/layeredHex/LayeredHexEffect.js";
import {LayeredRingEffect} from "./primaryEffects/layeredRing/LayeredRingEffect.js";
import {LensFlareEffect} from "./primaryEffects/lensFlare/LensFlareEffect.js";
import {MappedFramesEffect} from "./primaryEffects/mappedFrames/MappedFramesEffect.js";
import {NthRingsEffect} from "./primaryEffects/nthRings/NthRingsEffect.js";
import {PorousEffect} from "./primaryEffects/porous/PorousEffect.js";
import {RayRingEffect} from "./primaryEffects/rayRing/RayRingEffect.js";
import {RayRingInvertedEffect} from "./primaryEffects/rayRingInverted/RayRingInvertedEffect.js";
import {ScanLinesEffect} from "./primaryEffects/scanLines/ScanLinesEffect.js";
import {ScopesEffect} from "./primaryEffects/scopes/ScopesEffect.js";
import {ThreeDimensionalRingsEffect} from "./primaryEffects/threeDimensionalRings/ThreeDimensionalRingsEffect.js";
import {ThreeDimensionalShapeEffect} from "./primaryEffects/threeDimensionalShape/ThreeDimensionalShapeEffect.js";
import {ViewportEffect} from "./primaryEffects/viewport/ViewportEffect.js";
import {WireFrameSpiralEffect} from "./primaryEffects/wireframeSpiral/WireFrameSpiralEffect.js";
import {FadeEffect} from "./secondaryEffects/fade/FadeEffect.js";
import {GlowEffect} from "./secondaryEffects/glow/GlowEffect.js";
import {RandomizeEffect} from "./secondaryEffects/randomize/RandomizeEffect.js";
import {SingleLayerBlurEffect} from "./secondaryEffects/single-layer-blur/SingleLayerBlurEffect.js";
import {
    SingleLayerGlitchFractalEffect
} from "./secondaryEffects/single-layer-glitch-fractal/SingleLayerGlitchFractalEffect.js";
import {LayerEffect} from "./LayerEffect.js";

export class LayerEffectFromJSON {

    static from(json) {

        let layer = new LayerEffect({});

        switch (json.name) {
            //final image effects
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
            //primary effects
            case AmpEffect._name_:
                layer = Object.assign(new AmpEffect({}), json);
                break;
            case AnimateBackgroundEffect._name_:
                layer = Object.assign(new AnimateBackgroundEffect({}), json);
                break;
            case BlinkOnEffect._name_:
                layer = Object.assign(new BlinkOnEffect({}), json);
                break;
            case EightEffect._name_:
                layer = Object.assign(new EightEffect({}), json);
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
            case ThreeDimensionalRingsEffect._name_:
                layer = Object.assign(new ThreeDimensionalRingsEffect({}), json);
                break;
            case ThreeDimensionalShapeEffect._name_:
                layer = Object.assign(new ThreeDimensionalShapeEffect({}), json);
                break;
            case ViewportEffect._name_:
                layer = Object.assign(new ViewportEffect({}), json);
                break;
            case WireFrameSpiralEffect._name_:
                layer = Object.assign(new WireFrameSpiralEffect({}), json);
                break;
            default:
                throw 'Not a valid effect name'
        }

        layer.data = json.data;

        for (let i = 0; i < layer.additionalEffects.length; i++) {

            const data = layer.additionalEffects[i].data;

            switch (layer.additionalEffects[i].name) {
                //secondary effects
                case FadeEffect._name_:
                    layer.additionalEffects[i] = Object.assign(new FadeEffect({}), layer.additionalEffects[i])
                    break;
                case GlowEffect._name_:
                    layer.additionalEffects[i] = Object.assign(new GlowEffect({}), layer.additionalEffects[i])
                    break;
                case RandomizeEffect._name_:
                    layer.additionalEffects[i] = Object.assign(new RandomizeEffect({}), layer.additionalEffects[i])
                    break;
                case SingleLayerBlurEffect._name_:
                    layer.additionalEffects[i] = Object.assign(new SingleLayerBlurEffect({}), layer.additionalEffects[i])
                    break;
                case SingleLayerGlitchDrumrollHorizontalWaveEffect._name_:
                    layer.additionalEffects[i] = Object.assign(new SingleLayerGlitchDrumrollHorizontalWaveEffect({}), layer.additionalEffects[i])
                    break;
                case SingleLayerGlitchFractalEffect._name_:
                    layer.additionalEffects[i] = Object.assign(new SingleLayerGlitchFractalEffect({}), layer.additionalEffects[i])
                    break;
                default:
                    throw 'Not a valid effect name'
            }

            layer.additionalEffects[i].data = data;
        }

        return layer;
    }
}