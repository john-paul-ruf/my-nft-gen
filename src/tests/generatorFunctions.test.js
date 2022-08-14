import {animateBackgroundEffect} from "../effects/effectTypes/primaryEffects/animateBackground/animateBackground.js";
import {checkIfAnyNullOrUndefined} from "./helpers/checkIfAnyNullOrUndefined.js";
import {verticalScanLinesEffect} from "../effects/effectTypes/primaryEffects/scanLines/verticalScanLines.js";
import {hexEffect} from "../effects/effectTypes/primaryEffects/hex/hex.js";
import {wireframeSpiralEffect} from "../effects/effectTypes/primaryEffects/wireframeSpiral/wireframe-spiral.js";
import {fuzzyRippleEffect} from "../effects/effectTypes/primaryEffects/fuzzyRipples/fuzzy-ripples.js";
import {fuzzBandsEffect} from "../effects/effectTypes/primaryEffects/fuzzBands/fuzzBands.js";
import {gatesEffect} from "../effects/effectTypes/primaryEffects/gates/gates.js";
import {viewportEffect} from "../effects/effectTypes/primaryEffects/viewport/viewport.js";
import {randomizeEffect} from "../effects/effectTypes/secondaryEffects/randomize.js";
import {glowEffect} from "../effects/effectTypes/secondaryEffects/glow.js";
import {fadeEffect} from "../effects/effectTypes/secondaryEffects/fade.js";
import {blurEffect} from "../effects/effectTypes/finalImageEffects/blur.js";
import {pixelateEffect} from "../effects/effectTypes/finalImageEffects/pixelate.js";
import {sepiaEffect} from "../effects/effectTypes/finalImageEffects/sepia.js";
import {posterizeEffect} from "../effects/effectTypes/finalImageEffects/posterize.js";
import {glitchInverseEffect} from "../effects/effectTypes/finalImageEffects/glitchInverse.js";
import {glitchFractalEffect} from "../effects/effectTypes/finalImageEffects/glitchFractal.js";
import {
    glitchDrumrollHorizontalWaveEffect
} from "../effects/effectTypes/finalImageEffects/glitchDrumrollHorizontalWave.js";
import {scopesEffect} from "../effects/effectTypes/primaryEffects/scopes/scopes.js";
import {rayRingEffect} from "../effects/effectTypes/primaryEffects/rayRing/ray-ring.js";
import {ampEffect} from "../effects/effectTypes/primaryEffects/amp/amp.js";


test('no null or undefined in scopesEffect generate function', () => {
    const hasNullOrUndefined = checkIfAnyNullOrUndefined(scopesEffect.generateData());
    expect(hasNullOrUndefined).toBe(false);
});

test('no null or undefined in animateBackgroundEffect generate function', () => {
    const hasNullOrUndefined = checkIfAnyNullOrUndefined(animateBackgroundEffect.generateData());
    expect(hasNullOrUndefined).toBe(false);
});

test('no null or undefined in hexEffect generate function', () => {
    const hasNullOrUndefined = checkIfAnyNullOrUndefined(hexEffect.generateData());
    expect(hasNullOrUndefined).toBe(false);
});

test('no null or undefined in verticalScanLinesEffect generate function', () => {
    const hasNullOrUndefined = checkIfAnyNullOrUndefined(verticalScanLinesEffect.generateData());
    expect(hasNullOrUndefined).toBe(false);
});

test('no null or undefined in wireframeSpiralEffect generate function', () => {
    const hasNullOrUndefined = checkIfAnyNullOrUndefined(wireframeSpiralEffect.generateData());
    expect(hasNullOrUndefined).toBe(false);
});

test('no null or undefined in fuzzyRippleEffect generate function', () => {
    const hasNullOrUndefined = checkIfAnyNullOrUndefined(fuzzyRippleEffect.generateData());
    expect(hasNullOrUndefined).toBe(false);
});

test('no null or undefined in fuzzBandsEffect generate function', () => {
    const hasNullOrUndefined = checkIfAnyNullOrUndefined(fuzzBandsEffect.generateData());
    expect(hasNullOrUndefined).toBe(false);
});

test('no null or undefined in gatesEffect generate function', () => {
    const hasNullOrUndefined = checkIfAnyNullOrUndefined(gatesEffect.generateData());
    expect(hasNullOrUndefined).toBe(false);
});

test('no null or undefined in ampEffect generate function', () => {
    const hasNullOrUndefined = checkIfAnyNullOrUndefined(ampEffect.generateData());
    expect(hasNullOrUndefined).toBe(false);
});

test('no null or undefined in viewportEffect generate function', () => {
    const hasNullOrUndefined = checkIfAnyNullOrUndefined(viewportEffect.generateData());
    expect(hasNullOrUndefined).toBe(false);
});

test('no null or undefined in randomizeEffect generate function', () => {
    const hasNullOrUndefined = checkIfAnyNullOrUndefined(randomizeEffect.generateData());
    expect(hasNullOrUndefined).toBe(false);
});

test('no null or undefined in glowEffect generate function', () => {
    const hasNullOrUndefined = checkIfAnyNullOrUndefined(glowEffect.generateData());
    expect(hasNullOrUndefined).toBe(false);
});

test('no null or undefined in fadeEffect generate function', () => {
    const hasNullOrUndefined = checkIfAnyNullOrUndefined(fadeEffect.generateData());
    expect(hasNullOrUndefined).toBe(false);
});

test('no null or undefined in blurEffect generate function', () => {
    const hasNullOrUndefined = checkIfAnyNullOrUndefined(blurEffect.generateData());
    expect(hasNullOrUndefined).toBe(false);
});

test('no null or undefined in pixelateEffect generate function', () => {
    const hasNullOrUndefined = checkIfAnyNullOrUndefined(pixelateEffect.generateData());
    expect(hasNullOrUndefined).toBe(false);
});

test('no null or undefined in sepiaEffect generate function', () => {
    const hasNullOrUndefined = checkIfAnyNullOrUndefined(sepiaEffect.generateData());
    expect(hasNullOrUndefined).toBe(false);
});

test('no null or undefined in posterizeEffect generate function', () => {
    const hasNullOrUndefined = checkIfAnyNullOrUndefined(posterizeEffect.generateData());
    expect(hasNullOrUndefined).toBe(false);
});

test('no null or undefined in glitchInverseEffect generate function', () => {
    const hasNullOrUndefined = checkIfAnyNullOrUndefined(glitchInverseEffect.generateData());
    expect(hasNullOrUndefined).toBe(false);
});

test('no null or undefined in glitchFractalEffect generate function', () => {
    const hasNullOrUndefined = checkIfAnyNullOrUndefined(glitchFractalEffect.generateData());
    expect(hasNullOrUndefined).toBe(false);
});

test('no null or undefined in glitchDrumrollHorizontalWaveEffect generate function', () => {
    const hasNullOrUndefined = checkIfAnyNullOrUndefined(glitchDrumrollHorizontalWaveEffect.generateData());
    expect(hasNullOrUndefined).toBe(false);
});

test('no null or undefined in ray-ring generate function', () => {
    const hasNullOrUndefined = checkIfAnyNullOrUndefined(rayRingEffect.generateData());
    expect(hasNullOrUndefined).toBe(false);
});