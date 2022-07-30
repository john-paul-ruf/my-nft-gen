import {verticalScanLinesEffect} from "../primaryEffects/verticalScanLines.js";
import {hexEffect} from "../primaryEffects/hex.js";
import {wireframeSpiralEffect} from "../primaryEffects/wireframe-spiral.js";
import {backdropEffect} from "../primaryEffects/backdrop.js";
import {rippleEffect} from "../primaryEffects/ripples.js";
import {fuzzyRippleEffect} from "../primaryEffects/fuzzy-ripples.js";
import {fuzzEffect} from "../primaryEffects/fuzz.js";
import {fuzzBandsEffect} from "../primaryEffects/fuzzBands.js";
import {gatesEffect} from "../primaryEffects/gates.js";
import {summonEffect} from "../primaryEffects/summons.js";
import {ampEffect} from "../primaryEffects/amp.js";
import {viewportEffect} from "../primaryEffects/viewport.js";
import {sigEffect} from "../primaryEffects/sig.js";
import {radiateEffect} from "../secondaryEffects/radiate.js";
import {randomizeEffect} from "../secondaryEffects/randomize.js";
import {glowEffect} from "../secondaryEffects/glow.js";
import {fadeEffect} from "../secondaryEffects/fade.js";
import {rotateEffect} from "../secondaryEffects/rotate.js";
import {blurEffect} from "../secondaryEffects/blur.js";
import {pixelateEffect} from "../secondaryEffects/pixelate.js";
import {sepiaEffect} from "../secondaryEffects/sepia.js";
import {posterizeEffect} from "../secondaryEffects/posterize.js";
////////////////////////////////////////////////////////
// Just buckets of effects that get applied by chance
////////////////////////////////////////////////////////


//ordered list, maybe a pipeline if you think about it, maybe, maybe not...
//Main effects
//Each effect in this list can have one of the effects in the
//possibleAdditionalEffects array below


export const primaryEffects = [
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
export const secondaryEffects = [
    radiateEffect,
    randomizeEffect,
    glowEffect,
    fadeEffect,
    rotateEffect,
    blurEffect,
    pixelateEffect,
    sepiaEffect,
    posterizeEffect
];