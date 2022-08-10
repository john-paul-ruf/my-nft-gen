import {getRandomIntExclusive} from "../../logic/math/random.js";
import {Effect} from './Effect.js';
import {verticalScanLinesEffect} from "../primaryEffects/verticalScanLines.js";
import {hexEffect} from "../primaryEffects/hex.js";
import {wireframeSpiralEffect} from "../primaryEffects/wireframe-spiral.js";
import {backdropEffect} from "../primaryEffects/backdrop.js";
import {fuzzyRippleEffect} from "../primaryEffects/fuzzy-ripples.js";
import {fuzzBandsEffect} from "../primaryEffects/fuzzBands.js";
import {gatesEffect} from "../primaryEffects/gates.js";
import {ampEffect} from "../primaryEffects/amp.js";
import {summonEffect} from "../primaryEffects/summons.js";
import {viewportEffect} from "../primaryEffects/viewport.js";
import {sigEffect} from "../primaryEffects/sig.js";
import {randomizeEffect} from "../secondaryEffects/randomize.js";
import {glowEffect} from "../secondaryEffects/glow.js";
import {fadeEffect} from "../secondaryEffects/fade.js";
import {blurEffect} from "../finalImageEffects/blur.js";
import {pixelateEffect} from "../finalImageEffects/pixelate.js";
import {sepiaEffect} from "../finalImageEffects/sepia.js";
import {posterizeEffect} from "../finalImageEffects/posterize.js";
import {glitchDrumrollHorizontalWaveEffect} from "../finalImageEffects/glitchDrumrollHorizontalWave.js";
import {glitchFractalEffect} from "../finalImageEffects/glitchFractal.js";
import {glitchInverseEffect} from "../finalImageEffects/glitchInverse.js";
import {animateBackgroundEffect} from "../primaryEffects/animateBackground.js";
import {scopesEffect} from "../primaryEffects/scopes.js";
import {rayRingEffect} from "../primaryEffects/ray-ring.js";

const primaryEffects = [
    animateBackgroundEffect,
    scopesEffect,
    verticalScanLinesEffect,
    hexEffect,
    wireframeSpiralEffect,
    backdropEffect,
    fuzzyRippleEffect,
    fuzzBandsEffect,
    gatesEffect,
    ampEffect,
    rayRingEffect,
    summonEffect,
    viewportEffect,
    sigEffect
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