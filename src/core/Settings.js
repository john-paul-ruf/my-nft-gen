import {getRandomIntExclusive, randomId} from "./math/random.js";
import {ColorScheme} from "./color/ColorScheme.js";
import {RayRingInvertedEffect} from "../effects/primaryEffects/rayRingInverted/RayRingInvertedEffect.js";
import {GlitchFractalEffect} from "../effects/finalImageEffects/glitchFractal/GlitchFractalEffect.js";
import {HexEffect} from "../effects/primaryEffects/hex/HexEffect.js";
import {AnimateBackgroundEffect} from "../effects/primaryEffects/animateBackground/AnimateBackgroundEffect.js";
import {RayRingEffect} from "../effects/primaryEffects/rayRing/RayRingEffect.js";
import {WireFrameSpiralEffect} from "../effects/primaryEffects/wireframeSpiral/WireFrameSpiralEffect.js";
import {FuzzyBandEffect} from "../effects/primaryEffects/fuzzyBands/FuzzyBandEffect.js";
import {EncircledSpiralEffect} from "../effects/primaryEffects/encircledSpiral/EncircledSpiralEffect.js";
import {LayeredHexEffect} from "../effects/primaryEffects/layeredHex/LayeredHexEffect.js";
import {LayeredRingEffect} from "../effects/primaryEffects/layeredRing/LayeredRingEffect.js";
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
import {LayerEffectFromJSON} from "../effects/LayerEffectFromJSON.js";

export class Settings {

    static from(json) {
        const settings = Object.assign(new Settings({}), json);

        settings.colorScheme = Object.assign(new ColorScheme({}), settings.colorScheme);

        for (let i = 0; i < settings.effects.length; i++) {
            settings.effects[i] = LayerEffectFromJSON.from(settings.effects[i])
        }

        for (let i = 0; i < settings.finalImageEffects.length; i++) {
            settings.finalImageEffects[i] = LayerEffectFromJSON.from(settings.finalImageEffects[i])
        }

        return settings;
    }

    constructor({
                    colorScheme = new ColorScheme({}),
                    neutrals = ['#FFFFFF'],
                    backgrounds = ['#000000',],
                    lights = ['#FFFF00', '#FF00FF', '#00FFFF', '#FF0000', '#00FF00', '#0000FF'],
                    _INVOKER_ = 'unknown',
                    runName = 'null-space-void',
                    frameInc = 1,
                    numberOfFrame = 1800,
                    longestSideInPixels = 1920,
                    shortestSideInPixels = 1080,
                    isHorizontal = false,
                    workingDirectory = `src/img/working/`,
                    layerStrategy = 'sharp', //jimp no longer supported
                    allPrimaryEffects = [
                        {effect: AnimateBackgroundEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: HexEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: RayRingInvertedEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: RayRingEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: WireFrameSpiralEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: FuzzyBandEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: EncircledSpiralEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: LayeredHexEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: LayeredRingEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: NthRingsEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: EightEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: FuzzyRipplesEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: AmpEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: ScopesEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: BlinkOnEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: GatesEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: LensFlareEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: ViewportEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: ThreeDimensionalShapeEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: MappedFramesEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: ThreeDimensionalRingsEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: ImageOverlayEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: PorousEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: ScanLinesEffect, effectChance: 0, ignoreAdditionalEffects: false},
                    ],
                    allSecondaryEffects = [
                        {effect: RandomizeEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: GlowEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: FadeEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: SingleLayerBlurEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: SingleLayerGlitchFractalEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {
                            effect: SingleLayerGlitchDrumrollHorizontalWaveEffect,
                            effectChance: 0,
                            ignoreAdditionalEffects: false
                        },
                    ],
                    allFinalImageEffects = [
                        {effect: BlurEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: PixelateEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: GlitchInverseEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: GlitchFractalEffect, effectChance: 0, ignoreAdditionalEffects: false},
                        {effect: GlitchDrumrollHorizontalWaveEffect, effectChance: 0, ignoreAdditionalEffects: false},
                    ],
                    finalFileName = 'nsv' + randomId(),
                    fileOut =workingDirectory + finalFileName,
                }) {

        this.colorScheme = colorScheme;

        const finalImageHeight = isHorizontal ? shortestSideInPixels : longestSideInPixels;
        const finalImageWidth = isHorizontal ? longestSideInPixels : shortestSideInPixels;

        this.finalSize =  {
            width: finalImageWidth,
            height: finalImageHeight,
            longestSide: finalImageHeight > finalImageWidth ? finalImageHeight : finalImageWidth,
            shortestSide: finalImageHeight > finalImageWidth ? finalImageWidth : finalImageHeight,
        }

        this.workingDirectory = `src/img/working/`;

        this.fileConfig = {
            finalImageSize: this.finalSize,
            workingDirectory: this.workingDirectory,
            layerStrategy: layerStrategy
        };

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

        //This determines the final image contents
        //The effect array is super important
        //Understanding effects is key to running this program.
        this.effects = this.#generatePrimaryEffects(this);
        this.finalImageEffects = this.#generateFinalImageEffects(this);
    }

    #generatePrimaryEffects() {
        const effectList = [];

        //For each effect in the possible effects list.
        this.allPrimaryEffects.forEach(obj => {
            const chance = getRandomIntExclusive(0, 100) //roll the dice
            if (obj.effectChance > chance) { //if the roll was below the chance of hit
                effectList.push(new obj.effect({
                    additionalEffects: this.#applySecondaryEffects(),
                    ignoreAdditionalEffects: obj.ignoreAdditionalEffects,
                    settings: this
                }));
            }
        })

        return effectList;
    }

    #applySecondaryEffects() {
        const effectList = [];

        //For each effect in the possible effects list.
        this.allSecondaryEffects.forEach(obj => {
            const chance = getRandomIntExclusive(0, 100) //roll the dice
            if (obj.effectChance > chance) { //if the roll was below the chance of hit
                effectList.push(new obj.effect({
                    additionalEffects: [],
                    ignoreAdditionalEffects: obj.ignoreAdditionalEffects,
                    settings: this
                }));
            }
        })
        return effectList;
    }


    #generateFinalImageEffects() {
        const effectList = [];

        //For each effect in the possible effects list.
        this.allFinalImageEffects.forEach(obj => {
            const chance = getRandomIntExclusive(0, 100) //roll the dice
            if (obj.effectChance > chance) { //if the roll was below the chance of hit
                effectList.push(new obj.effect({
                    additionalEffects: this.#applySecondaryEffects(),
                    ignoreAdditionalEffects: obj.ignoreAdditionalEffects,
                    settings: this
                }));
            }
        })

        return effectList;
    }

    getColorFromBucket() {
        return this.colorScheme.getColorFromBucket();
    }

    getNeutralFromBucket() {
        return this.neutrals[getRandomIntExclusive(0, this.neutrals.length)]
    }

    getBackgroundFromBucket() {
        return this.backgrounds[getRandomIntExclusive(0, this.backgrounds.length)]
    }

    getLightFromBucket() {
        return this.lights[getRandomIntExclusive(0, this.lights.length)]
    }

    async getColorSchemeInfo() {
        return this.colorScheme.getColorSchemeInfo();
    }

}