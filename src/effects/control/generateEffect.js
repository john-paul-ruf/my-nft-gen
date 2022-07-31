import {getRandomIntExclusive} from "../../logic/random.js";
import {Effect} from './Effect.js';
import {verticalScanLinesEffect} from "../primaryEffects/verticalScanLines.js";
import {hexEffect} from "../primaryEffects/hex.js";
import {wireframeSpiralEffect} from "../primaryEffects/wireframe-spiral.js";
import {backdropEffect} from "../primaryEffects/backdrop.js";
import {rippleEffect} from "../primaryEffects/ripples.js";
import {fuzzyRippleEffect} from "../primaryEffects/fuzzy-ripples.js";
import {fuzzEffect} from "../primaryEffects/fuzz.js";
import {fuzzBandsEffect} from "../primaryEffects/fuzzBands.js";
import {gatesEffect} from "../primaryEffects/gates.js";
import {ampEffect} from "../primaryEffects/amp.js";
import {summonEffect} from "../primaryEffects/summons.js";
import {viewportEffect} from "../primaryEffects/viewport.js";
import {sigEffect} from "../primaryEffects/sig.js";
import {radiateEffect} from "../secondaryEffects/radiate.js";
import {randomizeEffect} from "../secondaryEffects/randomize.js";
import {glowEffect} from "../secondaryEffects/glow.js";
import {fadeEffect} from "../secondaryEffects/fade.js";
import {rotateEffect} from "../secondaryEffects/rotate.js";
import {blurEffect} from "../finalImageEffects/blur.js";
import {pixelateEffect} from "../finalImageEffects/pixelate.js";
import {sepiaEffect} from "../finalImageEffects/sepia.js";
import {posterizeEffect} from "../finalImageEffects/posterize.js";

const primaryEffects = [
    /*animateBackgroundEffect*/,
    verticalScanLinesEffect,
    hexEffect,
    wireframeSpiralEffect,
    backdropEffect,
    rippleEffect,
    fuzzyRippleEffect,
    fuzzEffect,
    fuzzBandsEffect,
    gatesEffect,
    ampEffect,
    summonEffect,
    viewportEffect,
    sigEffect
];

//Possible effect to apply to the main effects found in the possibleEffects array found above
const secondaryEffects = [
    radiateEffect,
    randomizeEffect,
    glowEffect,
    fadeEffect,
    rotateEffect,
];

const finalImageEffects = [
    blurEffect,
    pixelateEffect,
    sepiaEffect,
    posterizeEffect
]

const generateEffects = (possibleEffectList, allowRotate = false) => {
    const effectList = [];

    //For each effect in the possible effects list.
    possibleEffectList.forEach(obj => {
            const chance = getRandomIntExclusive(0, 100) //roll the dice
            if (obj.effectChance > chance) { //if the roll was below the chance of hit

                //if the effect does not allow rotate
                //and the possible effect rotates the image
                //Don't allow it
                if (!(!allowRotate && obj.rotatesImg)) {
                    effectList.push(new Effect(obj));
                }
            }
        }
    )

    return effectList;
}

export const generatePrimaryEffects = () => {
    return generateEffects(primaryEffects)
}

export const applySecondaryEffects = (allowRotate) => {
    return generateEffects(secondaryEffects, allowRotate)
}


export const generateFinalImageEffects = () => {
    return generateEffects(finalImageEffects)
}