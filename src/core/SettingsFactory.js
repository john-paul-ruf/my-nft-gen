import {ColorScheme} from "./color/ColorScheme.js";
import {NeonColorScheme, NeonColorSchemeFactory} from "./color/NeonColorSchemeFactory.js";
import {animateBackgroundEffect} from "../effects/primaryEffects/animateBackground/effect.js";
import {hexEffect} from "../effects/primaryEffects/hex/effect.js";
import {invertedRayRingEffect} from "../effects/primaryEffects/invertedRayRing/effect.js";
import {rayRingEffect} from "../effects/primaryEffects/rayRing/effect.js";
import {wireframeSpiralEffect} from "../effects/primaryEffects/wireframeSpiral/effect.js";
import {fuzzBandsEffect} from "../effects/primaryEffects/fuzzBands/effect.js";
import {encircledSpiralEffect} from "../effects/primaryEffects/encircledSpiral/effect.js";
import {layeredHexEffect} from "../effects/primaryEffects/layeredHex/effect.js";
import {layeredRingsEffect} from "../effects/primaryEffects/layeredRings/effect.js";
import {nthRingsEffect} from "../effects/primaryEffects/nthRings/effect.js";
import {eightEffect} from "../effects/primaryEffects/eight/effect.js";
import {fuzzyRippleEffect} from "../effects/primaryEffects/fuzzyRipples/effect.js";
import {ampEffect} from "../effects/primaryEffects/amp/effect.js";
import {scopesEffect} from "../effects/primaryEffects/scopes/effect.js";
import {blinkOnEffect} from "../effects/primaryEffects/blink-on-blink-on-blink-redux/effect.js";
import {gatesEffect} from "../effects/primaryEffects/gates/effect.js";
import {lensFlareEffect} from "../effects/primaryEffects/lensFlare/effect.js";
import {viewportEffect} from "../effects/primaryEffects/viewport/effect.js";
import {threeDimensionalShapeEffect} from "../effects/primaryEffects/threeDimensionalShape/effect.js";
import {mappedFramesEffect} from "../effects/primaryEffects/mappedFrames/effect.js";
import {threeDimensionalRingsEffect} from "../effects/primaryEffects/threeDeminsonalRings/effect.js";
import {imageOverlayEffect} from "../effects/primaryEffects/imageOverlay/effect.js";
import {porousEffect} from "../effects/primaryEffects/porous/effect.js";
import {verticalScanLinesEffect} from "../effects/primaryEffects/scanLines/effect.js";
import {randomizeEffect} from "../effects/secondaryEffects/randomize/effect.js";
import {glowEffect} from "../effects/secondaryEffects/glow/effect.js";
import {fadeEffect} from "../effects/secondaryEffects/fade/effect.js";
import {singleLayerBlurEffect} from "../effects/secondaryEffects/single-layer-blur/effect.js";
import {singleLayerGlitchFractalEffect} from "../effects/secondaryEffects/single-layer-glitch-fractal/effect.js";
import {
    singleLayerGlitchDrumrollHorizontalWaveEffect
} from "../effects/secondaryEffects/single-layer-glitch-drumroll-horizontal-wave/effect.js";
import {blurEffect} from "../effects/finalImageEffects/blur/effect.js";
import {pixelateEffect} from "../effects/finalImageEffects/pixelate/effect.js";
import {glitchInverseEffect} from "../effects/finalImageEffects/glitchInverse/effect.js";
import {glitchFractalEffect} from "../effects/finalImageEffects/glitchFractal/effect.js";
import {glitchDrumrollHorizontalWaveEffect} from "../effects/finalImageEffects/glitchDrumrollHorizontalWave/effect.js";
import {randomId} from "./math/random.js";

export class SettingsFactory {
    constructor() {
    }

    static AvailableSettings = {
        bluePlateSpecial: 'blue-plate-special',
        everythingBagel: 'everything-bagel',
    }

    static getPresetSetting = async ({request = SettingsFactory.AvailableSettings.bluePlateSpecial}) => {
        switch (request) {
            case SettingsFactory.AvailableSettings.bluePlateSpecial:
                return {
                    colorScheme: NeonColorSchemeFactory.getColorScheme(NeonColorScheme.neons),
                    neutrals: ['#FFFFFF'],
                    backgrounds: ['#000000',],
                    lights: ['#FFFF00', '#FF00FF', '#00FFFF', '#FF0000', '#00FF00', '#0000FF'],
                    _INVOKER_: 'John Ruf',
                    runName: 'neon-dreams',
                    frameInc: 1,
                    numberOfFrame: 1800,
                    finalFileName: 'neon-dream' + randomId(),
                    allPrimaryEffects: [
                        {effect: fuzzBandsEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: ampEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: layeredHexEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: scopesEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: lensFlareEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: encircledSpiralEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: viewportEffect, effectChance: 100, ignoreAdditionalEffects: false},
                    ],
                    allSecondaryEffects: [
                        {effect: glowEffect, effectChance: 100, ignoreAdditionalEffects: false}
                    ],
                }
            case SettingsFactory.AvailableSettings.everythingBagel:
                return {
                    colorScheme: new ColorScheme(NeonColorSchemeFactory.getColorScheme(NeonColorScheme.neons)),
                    neutrals: ['#FFFFFF'],
                    backgrounds: ['#000000',],
                    lights: ['#FFFF00', '#FF00FF', '#00FFFF', '#FF0000', '#00FF00', '#0000FF'],
                    _INVOKER_: 'the guy who never tests enough',
                    runName: 'be-prepared-to-wait',
                    frameInc: 1,
                    numberOfFrame: 30,
                    finalFileName: 'test-run' + randomId(),
                    allPrimaryEffects: [
                        {effect: animateBackgroundEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: hexEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: invertedRayRingEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: rayRingEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: wireframeSpiralEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: fuzzBandsEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: encircledSpiralEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: layeredHexEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: layeredRingsEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: nthRingsEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: eightEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: fuzzyRippleEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: ampEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: scopesEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: blinkOnEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: gatesEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: lensFlareEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: viewportEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: threeDimensionalShapeEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: mappedFramesEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: threeDimensionalRingsEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: imageOverlayEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: porousEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: verticalScanLinesEffect, effectChance: 100, ignoreAdditionalEffects: false},
                    ],
                    allSecondaryEffects: [
                        {effect: randomizeEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: glowEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: fadeEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: singleLayerBlurEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: singleLayerGlitchFractalEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {
                            effect: singleLayerGlitchDrumrollHorizontalWaveEffect,
                            effectChance: 100,
                            ignoreAdditionalEffects: false
                        },
                    ],
                    allFinalImageEffects: [
                        {effect: blurEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: pixelateEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: glitchInverseEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: glitchFractalEffect, effectChance: 100, ignoreAdditionalEffects: false},
                        {effect: glitchDrumrollHorizontalWaveEffect, effectChance: 100, ignoreAdditionalEffects: false},
                    ]
                };
            default:
                throw 'Not a valid settings enum';
        }
    }
}
