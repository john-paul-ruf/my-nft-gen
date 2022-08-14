import {getRandomIntExclusive} from "../../core/math/random.js";
import {Effect} from './Effect.js';
import {verticalScanLinesEffect} from "../effectTypes/primaryEffects/scanLines/verticalScanLines.js";
import {hexEffect} from "../effectTypes/primaryEffects/hex/hex.js";
import {wireframeSpiralEffect} from "../effectTypes/primaryEffects/wireframeSpiral/wireframe-spiral.js";
import {fuzzyRippleEffect} from "../effectTypes/primaryEffects/fuzzyRipples/fuzzy-ripples.js";
import {fuzzBandsEffect} from "../effectTypes/primaryEffects/fuzzBands/fuzzBands.js";
import {gatesEffect} from "../effectTypes/primaryEffects/gates/gates.js";
import {ampEffect} from "../effectTypes/primaryEffects/amp/amp.js";
import {viewportEffect} from "../effectTypes/primaryEffects/viewport/viewport.js";
import {randomizeEffect} from "../effectTypes/secondaryEffects/randomize.js";
import {glowEffect} from "../effectTypes/secondaryEffects/glow.js";
import {fadeEffect} from "../effectTypes/secondaryEffects/fade.js";
import {blurEffect} from "../effectTypes/finalImageEffects/blur.js";
import {pixelateEffect} from "../effectTypes/finalImageEffects/pixelate.js";
import {sepiaEffect} from "../effectTypes/finalImageEffects/sepia.js";
import {posterizeEffect} from "../effectTypes/finalImageEffects/posterize.js";
import {glitchDrumrollHorizontalWaveEffect} from "../effectTypes/finalImageEffects/glitchDrumrollHorizontalWave.js";
import {glitchFractalEffect} from "../effectTypes/finalImageEffects/glitchFractal.js";
import {glitchInverseEffect} from "../effectTypes/finalImageEffects/glitchInverse.js";
import {animateBackgroundEffect} from "../effectTypes/primaryEffects/animateBackground/animateBackground.js";
import {scopesEffect} from "../effectTypes/primaryEffects/scopes/scopes.js";
import {rayRingEffect} from "../effectTypes/primaryEffects/rayRing/ray-ring.js";

const primaryEffects = [
    animateBackgroundEffect,
    scopesEffect,
    verticalScanLinesEffect,
    hexEffect,
    wireframeSpiralEffect,
    rayRingEffect,
    fuzzyRippleEffect,
    fuzzBandsEffect,
    gatesEffect,
    ampEffect,
    viewportEffect,
];

//Possible effect to apply to the main effects found in the possibleEffects array found above
const secondaryEffects = [randomizeEffect, glowEffect, fadeEffect,];

const finalImageEffects = [blurEffect, pixelateEffect, sepiaEffect, posterizeEffect, glitchInverseEffect, glitchFractalEffect, glitchDrumrollHorizontalWaveEffect,]

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