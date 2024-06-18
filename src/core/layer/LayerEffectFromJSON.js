import {BlurEffect} from '../../effects/finalImageEffects/blur/BlurEffect.js';
import {
    SingleLayerGlitchDrumrollHorizontalWaveEffect,
} from '../../effects/secondaryEffects/single-layer-glitch-drumroll-horizontal-wave/SingleLayerGlitchDrumrollHorizontalWaveEffect.js';
import {GlitchFractalEffect} from '../../effects/finalImageEffects/glitchFractal/GlitchFractalEffect.js';
import {GlitchInverseEffect} from '../../effects/finalImageEffects/glitchInverse/GlitchInverseEffect.js';
import {PixelateEffect} from '../../effects/finalImageEffects/pixelate/PixelateEffect.js';
import {AmpEffect} from '../../effects/primaryEffects/amp/AmpEffect.js';
import {BlinkOnEffect} from '../../effects/primaryEffects/blink-on-blink-on-blink-redux/BlinkOnEffect.js';
import {EightEffect} from '../../effects/primaryEffects/eight/EightEffect.js';
import {EncircledSpiralEffect} from '../../effects/primaryEffects/encircledSpiral/EncircledSpiralEffect.js';
import {FuzzyBandEffect} from '../../effects/primaryEffects/fuzzyBands/FuzzyBandEffect.js';
import {FuzzyRipplesEffect} from '../../effects/primaryEffects/fuzzyRipples/FuzzyRipplesEffect.js';
import {GatesEffect} from '../../effects/primaryEffects/gates/GatesEffect.js';
import {HexEffect} from '../../effects/primaryEffects/hex/HexEffect.js';
import {ImageOverlayEffect} from '../../effects/primaryEffects/imageOverlay/ImageOverlayEffect.js';
import {LayeredHexEffect} from '../../effects/primaryEffects/layeredHex/LayeredHexEffect.js';
import {LayeredRingEffect} from '../../effects/primaryEffects/layeredRing/LayeredRingEffect.js';
import {LensFlareEffect} from '../../effects/primaryEffects/lensFlare/LensFlareEffect.js';
import {MappedFramesEffect} from '../../effects/primaryEffects/mappedFrames/MappedFramesEffect.js';
import {NthRingsEffect} from '../../effects/primaryEffects/nthRings/NthRingsEffect.js';
import {PorousEffect} from '../../effects/primaryEffects/porous/PorousEffect.js';
import {RayRingEffect} from '../../effects/primaryEffects/rayRing/RayRingEffect.js';
import {RayRingInvertedEffect} from '../../effects/primaryEffects/rayRingInverted/RayRingInvertedEffect.js';
import {ScanLinesEffect} from '../../effects/primaryEffects/scanLines/ScanLinesEffect.js';
import {ScopesEffect} from '../../effects/primaryEffects/scopes/ScopesEffect.js';
import {ViewportEffect} from '../../effects/primaryEffects/viewport/ViewportEffect.js';
import {WireFrameSpiralEffect} from '../../effects/primaryEffects/wireframeSpiral/WireFrameSpiralEffect.js';
import {FadeEffect} from '../../effects/secondaryEffects/fade/FadeEffect.js';
import {GlowEffect} from '../../effects/secondaryEffects/glow/GlowEffect.js';
import {RandomizeEffect} from '../../effects/secondaryEffects/randomize/RandomizeEffect.js';
import {SingleLayerBlurEffect} from '../../effects/secondaryEffects/single-layer-blur/SingleLayerBlurEffect.js';
import {
    SingleLayerGlitchFractalEffect,
} from '../../effects/secondaryEffects/single-layer-glitch-fractal/SingleLayerGlitchFractalEffect.js';
import {LayerEffect} from './LayerEffect.js';
import {RedEyeEffect} from '../../effects/primaryEffects/red-eye/RedEyeEffect.js';
import {FuzzFlareEffect} from "../../effects/primaryEffects/fuzz-flare/FuzzFlareEffect.js";

export class LayerEffectFromJSON {
    static from(json) {
        let layer = new LayerEffect({});

        switch (json.name) {
            // final image effects
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
            // primary effects
            case AmpEffect._name_:
                layer = Object.assign(new AmpEffect({}), json);
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
            case ViewportEffect._name_:
                layer = Object.assign(new ViewportEffect({}), json);
                break;
            case WireFrameSpiralEffect._name_:
                layer = Object.assign(new WireFrameSpiralEffect({}), json);
                break;
            case RedEyeEffect._name_:
                layer = Object.assign(new RedEyeEffect({}), json);
                break;
            case FuzzFlareEffect._name_:
                layer = Object.assign(new FuzzFlareEffect({}), json);
                break;
            default:
                throw new Error('Not a valid effect name');
        }

        layer.data = json.data;

        for (let i = 0; i < layer.additionalEffects.length; i++) {
            const {data} = layer.additionalEffects[i];

            switch (layer.additionalEffects[i].name) {
                // secondary effects
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
                default:
                    throw new Error('Not a valid effect name');
            }

            layer.additionalEffects[i].data = data;
        }

        return layer;
    }
}
