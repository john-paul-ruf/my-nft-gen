import {ColorScheme} from "./color/ColorScheme.js";
import {NeonColorScheme, NeonColorSchemeFactory} from "./color/NeonColorSchemeFactory.js";
import {RayRingInvertedEffect} from "../effects/primaryEffects/rayRingInverted/RayRingInverted.js";
import {GlitchFractalEffect} from "../effects/finalImageEffects/glitchFractal/GlitchFractalEffect.js";
import {HexEffect} from "../effects/primaryEffects/hex/HexEffect.js";
import {AnimateBackgroundEffect} from "../effects/primaryEffects/animateBackground/AnimateBackgroundEffect.js";
import {RayRingEffect} from "../effects/primaryEffects/rayRing/RayRingEffect.js";
import {WireFrameSpiralEffect} from "../effects/primaryEffects/wireframeSpiral/WireFrameSpiralEffect.js";
import {FuzzyBandEffect} from "../effects/primaryEffects/fuzzyBands/FuzzyBandEffect.js";
import {EncircledSpiralEffect} from "../effects/primaryEffects/encircledSpiral/EncircledSpiralEffect.js";
import {LayeredHexEffect} from "../effects/primaryEffects/layeredHex/LayeredHexEffect.js";
import {LayeredRingEffect} from "../effects/primaryEffects/layeredRings/LayeredRingEffect.js";
import {EightEffect} from "../effects/primaryEffects/eight/EightEffect.js";
import {FuzzyRipplesEffect} from "../effects/primaryEffects/fuzzyRipples/FuzzyRipplesEffect.js";
import {NthRingsEffect} from "../effects/primaryEffects/nthRings/NthRingsEffect.js";
import {AmpEffect} from "../effects/primaryEffects/amp/AmpEffect.js";
import {ScopesEffect} from "../effects/primaryEffects/scopes/ScopesEffect.js";
import {BlinkOnEffect} from "../effects/primaryEffects/blink-on-blink-on-blink-redux/BlinkEffect.js";
import {GatesEffect} from "../effects/primaryEffects/gates/GatesEffect.js";
import {LensFlareEffect} from "../effects/primaryEffects/lensFlare/LensFlareEffect.js";
import {ViewportEffect} from "../effects/primaryEffects/viewport/ViewportEffect.js";
import {
    ThreeDimensionalShapeEffect
} from "../effects/primaryEffects/threeDimensionalShape/ThreeDimensionalShapeEffect.js";
import {MappedFramesEffect} from "../effects/primaryEffects/mappedFrames/MappedFramesEffect.js";
import {
    ThreeDimensionalRingsEffect
} from "../effects/primaryEffects/threeDimensionalRings/ThreeDimensionalRingsEffect.js";
import {PorousEffect} from "../effects/primaryEffects/porous/PorousEffect.js";
import {ImageOverlayEffect} from "../effects/primaryEffects/imageOverlay/ImageOverlayEffect.js";
import {ScanLinesEffect} from "../effects/primaryEffects/scanLines/ScanLinesEffect.js";
import {
    SingleLayerGlitchDrumrollHorizontalWaveEffect
} from "../effects/secondaryEffects/single-layer-glitch-drumroll-horizontal-wave/SingleLayerGlitchDrumrollHorizontalWaveEffect.js";
import {
    SingleLayerGlitchFractalEffect
} from "../effects/secondaryEffects/single-layer-glitch-fractal/SingleLayerGlitchFractalEffect.js";
import {SingleLayerBlurEffect} from "../effects/secondaryEffects/single-layer-blur/SingleLayerBlurEffect.js";
import {FadeEffect} from "../effects/secondaryEffects/fade/FadeEffect.js";
import {GlowEffect} from "../effects/secondaryEffects/glow/GlowEffect.js";
import {RandomizeEffect} from "../effects/secondaryEffects/randomize/RandomizeEffect.js";
import {BlurEffect} from "../effects/finalImageEffects/blur/BlurEffect.js";
import {PixelateEffect} from "../effects/finalImageEffects/pixelate/PixelateEffect.js";
import {GlitchInverseEffect} from "../effects/finalImageEffects/glitchInverse/GlitchInverseEffect.js";
import {
    GlitchDrumrollHorizontalWaveEffect
} from "../effects/finalImageEffects/glitchDrumrollHorizontalWave/GlitchDrumrollHorizontalWaveEffect.js";
import {ColorSchemeJsFactory} from "./color/ColorSchemeJsFactory.js";
import {randomId} from "./math/random.js";
import {Settings} from "./Settings.js";

export class SettingsFactory {
    constructor() {
    }

    static AvailableSettings = {
        experimental: 'experimental',
        bluePlateSpecial: 'blue-plate-special',
        everythingBagel: 'everything-bagel',
    }

    static getPresetSetting = async ({request = SettingsFactory.AvailableSettings.bluePlateSpecial}) => {
        switch (request) {
            case SettingsFactory.AvailableSettings.experimental:

                FuzzyBandEffect._config_.circles.lower = 20;
                FuzzyBandEffect._config_.circles.upper = 25;

                LensFlareEffect._config_.numberOfFlareRays.lower = 11;
                LensFlareEffect._config_.numberOfFlareRays.upper = 11;

                return new Settings({
                    colorScheme: NeonColorSchemeFactory.getColorScheme(NeonColorScheme.neons),
                    //colorScheme: ColorSchemeJsFactory.getColorSchemeJsColorScheme({}),
                    neutrals: ['#FFFFFF'],
                    backgrounds: ['#000000',],
                    lights: ['#FFFF00', '#FF00FF', '#00FFFF', '#FF0000', '#00FF00', '#0000FF'],
                    _INVOKER_: 'John Ruf',
                    runName: 'neon-dreams',
                    frameInc: 1,
                    numberOfFrame: 1800,
                    finalFileName: 'neon-dream' + randomId(),
                    allPrimaryEffects: [
                        {effect: LensFlareEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: FuzzyBandEffect, effectChance: 100, ignoreAdditionalEffects: false},
                    ],
                });
            case SettingsFactory.AvailableSettings.bluePlateSpecial:
                return new Settings({
                    colorScheme: NeonColorSchemeFactory.getColorScheme(NeonColorScheme.neons),
                    //colorScheme: ColorSchemeJsFactory.getColorSchemeJsColorScheme({}),
                    neutrals: ['#FFFFFF'],
                    backgrounds: ['#000000',],
                    lights: ['#FFFF00', '#FF00FF', '#00FFFF', '#FF0000', '#00FF00', '#0000FF'],
                    _INVOKER_: 'John Ruf',
                    runName: 'neon-dreams',
                    frameInc: 1,
                    numberOfFrame: 1800,
                    finalFileName: 'neon-dream' + randomId(),
                    allPrimaryEffects: [
                        {effect: FuzzyBandEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: NthRingsEffect, effectChance: 50, ignoreAdditionalEffects: false},
                        {effect: AmpEffect, effectChance: 50, ignoreAdditionalEffects: false},
                        {effect: LayeredHexEffect, effectChance: 50, ignoreAdditionalEffects: false},
                        {effect: ScopesEffect, effectChance: 50, ignoreAdditionalEffects: false},
                        {effect: EncircledSpiralEffect, effectChance: 50, ignoreAdditionalEffects: false},
                        {effect: ViewportEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: ImageOverlayEffect, effectChance: 50, ignoreAdditionalEffects: false},
                    ],
                });
            case SettingsFactory.AvailableSettings.everythingBagel:
                return new Settings({
                    colorScheme: new ColorScheme(NeonColorSchemeFactory.getColorScheme(NeonColorScheme.neons)),
                    neutrals: ['#FFFFFF'],
                    backgrounds: ['#000000',],
                    lights: ['#FFFF00', '#FF00FF', '#00FFFF', '#FF0000', '#00FF00', '#0000FF'],
                    _INVOKER_: 'the guy who never tests enough',
                    runName: 'be-prepared-to-wait',
                    frameInc: 1,
                    numberOfFrame: 1,
                    finalFileName: 'test-run' + randomId(),
                    allPrimaryEffects: [
                        {effect: AnimateBackgroundEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: HexEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: RayRingInvertedEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: RayRingEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: WireFrameSpiralEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: FuzzyBandEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: EncircledSpiralEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: LayeredHexEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: LayeredRingEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: NthRingsEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: EightEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: FuzzyRipplesEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: AmpEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: ScopesEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: BlinkOnEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: GatesEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: LensFlareEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: ViewportEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: ThreeDimensionalShapeEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: MappedFramesEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: ThreeDimensionalRingsEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: ImageOverlayEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: PorousEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: ScanLinesEffect, effectChance: 100, ignoreAdditionalEffects: false},
                    ],
                    allSecondaryEffects: [
                        {effect: RandomizeEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: GlowEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: FadeEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: SingleLayerBlurEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: SingleLayerGlitchFractalEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {
                            effect: SingleLayerGlitchDrumrollHorizontalWaveEffect,
                            effectChance: 100,
                            ignoreAdditionalEffects: false
                        },
                    ],
                    allFinalImageEffects: [
                        {effect: BlurEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: PixelateEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: GlitchInverseEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: GlitchFractalEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: GlitchDrumrollHorizontalWaveEffect, effectChance: 100, ignoreAdditionalEffects: false},
                    ]
                });
            default:
                throw 'Not a valid settings enum';
        }
    }
}
