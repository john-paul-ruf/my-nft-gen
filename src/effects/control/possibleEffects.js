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

export const possibleSummonsEffects = [
    randomizeEffect,
    glowEffect,
    fadeEffect,
    rotateEffect,
    /*radiateEffect*/,
    /*traceEffect,*/
];

export const possibleFocusEffects = [
    randomizeEffect,
    glowEffect,
    fadeEffect,
    /*radiateEffect*/,
    /*traceEffect*/,
];

export const possibleGlossEffects = [
    randomizeEffect,
    glowEffect,
    fadeEffect,
    /*radiateEffect*/,
    /*traceEffect*/,
];

export const possibleSigEffects = [
    randomizeEffect,
    glowEffect,
    fadeEffect,
    /*radiateEffect*/,
    /*traceEffect*/,
];

export const possibleExtraEffects = [
    /*animateBackgroundEffect*/,
    /*verticalScanLinesEffect,*/
    backdropEffect,
    fuzzEffect,
    ampEffect,
    gatesEffect
];

export const possibleAdditionalEffects = [
    randomizeEffect,
    glowEffect,
    fadeEffect,
];