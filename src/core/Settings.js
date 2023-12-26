import {getRandomIntExclusive, randomId} from "./math/random.js";
import {ColorScheme} from "./color/ColorScheme.js";
import {GlobalSettings} from "./GlobalSettings.js";
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

export class Settings {
    constructor({
                    colorScheme = new ColorScheme({}),
                    neutrals = ['#FFFFFF'],
                    backgrounds = ['#000000',],
                    lights = ['#FFFF00', '#FF00FF', '#00FFFF', '#FF0000', '#00FF00', '#0000FF'],
                    _INVOKER_ = 'unknown',
                    runName = 'null-space-void',
                    frameInc = 1,
                    numberOfFrame = 1800,
                    allPrimaryEffects = [
                        {effect: animateBackgroundEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: hexEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: invertedRayRingEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: rayRingEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: wireframeSpiralEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: fuzzBandsEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: encircledSpiralEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: layeredHexEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: layeredRingsEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: nthRingsEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: eightEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: fuzzyRippleEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: ampEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: scopesEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: blinkOnEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: gatesEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: lensFlareEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: viewportEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: threeDimensionalShapeEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: mappedFramesEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: threeDimensionalRingsEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: imageOverlayEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: porousEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: verticalScanLinesEffect, effectChance: 0, ignoreAdditionalEffects: false},
                    ],
                    allSecondaryEffects = [
                        {effect: randomizeEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: glowEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: fadeEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: singleLayerBlurEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: singleLayerGlitchFractalEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: singleLayerGlitchDrumrollHorizontalWaveEffect, effectChance: 0, ignoreAdditionalEffects: false},
                    ],
                    allFinalImageEffects = [
                        {effect: blurEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: pixelateEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: glitchInverseEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: glitchFractalEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: glitchDrumrollHorizontalWaveEffect, effectChance: 0, ignoreAdditionalEffects: false},
                    ],
                    finalFileName = randomId(),
                    fileOut = GlobalSettings.getWorkingDirectory() + finalFileName,
                }) {

        this.colorScheme = colorScheme;

        //For 2D palettes
        this.neutrals = neutrals;

        //For 2D palettes
        this.backgrounds = backgrounds;

        //for three-dimensional lighting
        this.lights = lights;

        this.config = {
            _INVOKER_: _INVOKER_,
            runName: runName,
            frameInc: frameInc,
            numberOfFrame: numberOfFrame,
            finalFileName: finalFileName,
            fileOut: fileOut
        }

        this.allPrimaryEffects = allPrimaryEffects;
        this.allSecondaryEffects = allSecondaryEffects;
        this.allFinalImageEffects = allFinalImageEffects;
    }

    async getColorFromBucket() {
        return this.colorScheme.getColorFromBucket();
    }

    async getNeutralFromBucket() {
        return this.neutrals[getRandomIntExclusive(0, this.neutrals.length)]
    }

    async getBackgroundFromBucket() {
        return this.backgrounds[getRandomIntExclusive(0, this.backgrounds.length)]
    }

    async getLightFromBucket() {
        return this.lights[getRandomIntExclusive(0, this.lights.length)]
    }

    async getColorSchemeInfo() {
        return this.colorScheme.getColorSchemeInfo();
    }
}