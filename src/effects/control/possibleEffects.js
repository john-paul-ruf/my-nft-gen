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
import {rippleEffect} from "../ripples.js";
import {viewportEffect} from "../viewport.js";
import {fuzzyRippleEffect} from "../fuzzy-ripples.js";
import {hexEffect} from "../hex.js";
import {fuzzBandsEffect} from "../fuzzBands.js";

////////////////////////////////////////////////////////
// Just buckets of effects that get applied by chance
////////////////////////////////////////////////////////


//ordered list, maybe a pipeline if you think about it, maybe, maybe not...
//Main effects
//Each effect in this list can have one of the effects in the
//possibleAdditionalEffects array below
export const possibleEffects = [
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
export const possibleAdditionalEffects = [
    radiateEffect,
    randomizeEffect,
    glowEffect,
    fadeEffect,
    rotateEffect,
];