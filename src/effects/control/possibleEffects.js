import {glowEffect} from "../glow.js";
import {fadeEffect} from "../fade.js";
import {rotateEffect} from "../rotate.js";
import {radiateEffect} from "../radiate.js";
import {traceEffect} from "../trace.js";
import {randomizeEffect} from "../randomize.js";
import {animateBackgroundEffect} from "../animateBackground.js";
import {verticalScanLinesEffect} from "../verticalScanLines.js";
import {backdropEffect} from "../backdrop.js";
import {fuzzEffect} from "../fuzz.js";
import {ampEffect} from "../amp.js";
import {gatesEffect} from "../gates.js";
import {wireframeSpiralEffect} from "../wireframe-spiral.js";
import {summonEffect} from "../summons.js";
import {sigEffect} from "../sig.js";
import {threeSigEffect} from "../3dSig.js";
import {rippleEffect} from "../ripples.js";

////////////////////////////////////////////////////////
// Just buckets of effects that get applied by chance
////////////////////////////////////////////////////////

export const possibleEffects = [
    /*animateBackgroundEffect*/,
    rippleEffect,
    verticalScanLinesEffect,
    wireframeSpiralEffect,
    backdropEffect,
    fuzzEffect,
    gatesEffect,
    ampEffect,
    summonEffect,
    sigEffect,
    /*threeSigEffect*/
];

export const possibleAdditionalEffects = [
    /*radiateEffect,*/
    randomizeEffect,
    glowEffect,
    fadeEffect,
    rotateEffect,
];