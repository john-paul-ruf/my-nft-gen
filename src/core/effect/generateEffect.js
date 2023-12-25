import {getRandomIntExclusive} from "../math/random.js";
import {Effect} from './Effect.js';
import {verticalScanLinesEffect} from "../../effects/primaryEffects/scanLines/effect.js";
import {hexEffect} from "../../effects/primaryEffects/hex/effect.js";
import {wireframeSpiralEffect} from "../../effects/primaryEffects/wireframeSpiral/effect.js";
import {fuzzyRippleEffect} from "../../effects/primaryEffects/fuzzyRipples/effect.js";
import {fuzzBandsEffect} from "../../effects/primaryEffects/fuzzBands/effect.js";
import {gatesEffect} from "../../effects/primaryEffects/gates/effect.js";
import {ampEffect} from "../../effects/primaryEffects/amp/effect.js";
import {viewportEffect} from "../../effects/primaryEffects/viewport/effect.js";
import {randomizeEffect} from "../../effects/secondaryEffects/randomize/effect.js";
import {glowEffect} from "../../effects/secondaryEffects/glow/effect.js";
import {fadeEffect} from "../../effects/secondaryEffects/fade/effect.js";
import {blurEffect} from "../../effects/finalImageEffects/blur/effect.js";
import {pixelateEffect} from "../../effects/finalImageEffects/pixelate/effect.js";
import {
    glitchDrumrollHorizontalWaveEffect
} from "../../effects/finalImageEffects/glitchDrumrollHorizontalWave/effect.js";
import {glitchFractalEffect} from "../../effects/finalImageEffects/glitchFractal/effect.js";
import {glitchInverseEffect} from "../../effects/finalImageEffects/glitchInverse/effect.js";
import {animateBackgroundEffect} from "../../effects/primaryEffects/animateBackground/effect.js";
import {scopesEffect} from "../../effects/primaryEffects/scopes/effect.js";
import {rayRingEffect} from "../../effects/primaryEffects/rayRing/effect.js";
import {imageOverlayEffect} from "../../effects/primaryEffects/imageOverlay/effect.js";
import {threeDimensionalShapeEffect} from "../../effects/primaryEffects/threeDimensionalShape/effect.js";
import {threeDimensionalRingsEffect} from "../../effects/primaryEffects/threeDeminsonalRings/effect.js";
import {invertedRayRingEffect} from "../../effects/primaryEffects/invertedRayRing/effect.js";
import {lensFlareEffect} from "../../effects/primaryEffects/lensFlare/effect.js";
import {layeredHexEffect} from "../../effects/primaryEffects/layeredHex/effect.js";
import {layeredRingsEffect} from "../../effects/primaryEffects/layeredRings/effect.js";
import {encircledSpiralEffect} from "../../effects/primaryEffects/encircledSpiral/effect.js";
import {eightEffect} from "../../effects/primaryEffects/eight/effect.js";
import {mappedFramesEffect} from "../../effects/primaryEffects/mappedFrames/effect.js";
import {nthRingsEffect} from "../../effects/primaryEffects/nthRings/effect.js";
import {blinkOnEffect} from "../../effects/primaryEffects/blink-on-blink-on-blink-redux/effect.js";
import {
    singleLayerGlitchDrumrollHorizontalWaveEffect
} from "../../effects/secondaryEffects/single-layer-glitch-drumroll-horizontal-wave/effect.js";
import {singleLayerGlitchFractalEffect} from "../../effects/secondaryEffects/single-layer-glitch-fractal/effect.js";
import {singleLayerBlurEffect} from "../../effects/secondaryEffects/single-layer-blur/effect.js";
import {porousEffect} from "../../effects/primaryEffects/porous/effect.js";


const primaryEffects = [

    animateBackgroundEffect,

    hexEffect,

    invertedRayRingEffect, rayRingEffect,

    wireframeSpiralEffect,

    fuzzBandsEffect,

    encircledSpiralEffect,

    layeredHexEffect, layeredRingsEffect,

    nthRingsEffect, eightEffect, fuzzyRippleEffect,

    ampEffect,

    scopesEffect,

    blinkOnEffect,

    gatesEffect,

    lensFlareEffect,

    viewportEffect,

    threeDimensionalShapeEffect,

    mappedFramesEffect, threeDimensionalRingsEffect,

    imageOverlayEffect, porousEffect,

    verticalScanLinesEffect,


];

//Possible effect to apply to the main effects found in the possibleEffects array found above
const secondaryEffects = [randomizeEffect, glowEffect, fadeEffect, singleLayerBlurEffect, singleLayerGlitchFractalEffect, singleLayerGlitchDrumrollHorizontalWaveEffect,];

const finalImageEffects = [blurEffect, pixelateEffect, glitchInverseEffect, glitchFractalEffect, glitchDrumrollHorizontalWaveEffect,]

const generateEffects = (possibleEffectList, settings) => {
    const effectList = [];

    //For each effect in the possible effects list.
    possibleEffectList.forEach(obj => {
        const chance = getRandomIntExclusive(0, 100) //roll the dice
        if (obj.effectChance > chance) { //if the roll was below the chance of hit
            effectList.push(new Effect(obj, settings));
        }
    })

    return effectList;
}

export const generatePrimaryEffects = (settings) => {
    return generateEffects(primaryEffects, settings)
}

export const applySecondaryEffects = (settings) => {
    return generateEffects(secondaryEffects, settings)
}


export const generateFinalImageEffects = (settings) => {
    return generateEffects(finalImageEffects, settings)
}