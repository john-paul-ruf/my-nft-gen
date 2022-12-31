import {getRandomIntExclusive} from "../../core/math/random.js";
import {Effect} from './Effect.js';
import {verticalScanLinesEffect} from "../effectTypes/primaryEffects/scanLines/effect.js";
import {hexEffect} from "../effectTypes/primaryEffects/hex/effect.js";
import {wireframeSpiralEffect} from "../effectTypes/primaryEffects/wireframeSpiral/effect.js";
import {fuzzyRippleEffect} from "../effectTypes/primaryEffects/fuzzyRipples/effect.js";
import {fuzzBandsEffect} from "../effectTypes/primaryEffects/fuzzBands/effect.js";
import {gatesEffect} from "../effectTypes/primaryEffects/gates/effect.js";
import {ampEffect} from "../effectTypes/primaryEffects/amp/effect.js";
import {viewportEffect} from "../effectTypes/primaryEffects/viewport/effect.js";
import {randomizeEffect} from "../effectTypes/secondaryEffects/randomize/effect.js";
import {glowEffect} from "../effectTypes/secondaryEffects/glow/effect.js";
import {fadeEffect} from "../effectTypes/secondaryEffects/fade/effect.js";
import {blurEffect} from "../effectTypes/finalImageEffects/blur/effect.js";
import {pixelateEffect} from "../effectTypes/finalImageEffects/pixelate/effect.js";
import {
    glitchDrumrollHorizontalWaveEffect
} from "../effectTypes/finalImageEffects/glitchDrumrollHorizontalWave/effect.js";
import {glitchFractalEffect} from "../effectTypes/finalImageEffects/glitchFractal/effect.js";
import {glitchInverseEffect} from "../effectTypes/finalImageEffects/glitchInverse/effect.js";
import {animateBackgroundEffect} from "../effectTypes/primaryEffects/animateBackground/effect.js";
import {scopesEffect} from "../effectTypes/primaryEffects/scopes/effect.js";
import {rayRingEffect} from "../effectTypes/primaryEffects/rayRing/effect.js";
import {imageOverlayEffect} from "../effectTypes/primaryEffects/imageOverlay/effect.js";
import {threeDimensionalShapeEffect} from "../effectTypes/primaryEffects/threeDimensionalShape/effect.js";
import {threeDimensionalRingsEffect} from "../effectTypes/primaryEffects/threeDeminsonalRings/effect.js";
import {invertedRayRingEffect} from "../effectTypes/primaryEffects/invertedRayRing/effect.js";
import {lensFlareEffect} from "../effectTypes/primaryEffects/lensFlare/effect.js";
import {layeredHexEffect} from "../effectTypes/primaryEffects/layeredHex/effect.js";
import {layeredRingsEffect} from "../effectTypes/primaryEffects/layeredRings/effect.js";
import {encircledSpiralEffect} from "../effectTypes/primaryEffects/encircledSpiral/effect.js";
import {eightEffect} from "../effectTypes/primaryEffects/eight/effect.js";
import {animatedImageOverlayEffect} from "../effectTypes/primaryEffects/animatedOverlay/effect.js";
import {mappedFramesEffect} from "../effectTypes/primaryEffects/mappedFrames/effect.js";

const primaryEffects = [
    animateBackgroundEffect,

    fuzzyRippleEffect,
    eightEffect,

    scopesEffect,

    wireframeSpiralEffect,
    encircledSpiralEffect,

    hexEffect,
    ampEffect,
    fuzzBandsEffect,
    gatesEffect,
    invertedRayRingEffect,
    rayRingEffect,

    layeredHexEffect,
    layeredRingsEffect,

    viewportEffect,
    verticalScanLinesEffect,
    threeDimensionalShapeEffect,
    imageOverlayEffect,
    animatedImageOverlayEffect,
    mappedFramesEffect,
    threeDimensionalRingsEffect,
    lensFlareEffect,


];

//Possible effect to apply to the main effects found in the possibleEffects array found above
const secondaryEffects = [
    randomizeEffect,
    glowEffect,
    fadeEffect,
];

const finalImageEffects = [
    blurEffect,
    pixelateEffect,
    glitchInverseEffect,
    glitchFractalEffect,
    glitchDrumrollHorizontalWaveEffect,
]

const generateEffects = (possibleEffectList) => {
    const effectList = [];

    //For each effect in the possible effects list.
    possibleEffectList.forEach(obj => {
        const chance = getRandomIntExclusive(0, 100) //roll the dice
        if (obj.effectChance > chance) { //if the roll was below the chance of hit
            effectList.push(new Effect(obj));
        }
    })

    return effectList;
}

export const generatePrimaryEffects = () => {
    return generateEffects(primaryEffects)
}

export const applySecondaryEffects = () => {
    return generateEffects(secondaryEffects)
}


export const generateFinalImageEffects = () => {
    return generateEffects(finalImageEffects)
}