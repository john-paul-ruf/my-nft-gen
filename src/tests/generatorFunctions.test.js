import {animateBackgroundEffect} from "../effects/primaryEffects/animateBackground.js";
import {checkIfAnyNullOrUndefined} from "./helpers/checkIfAnyNullOrUndefined.js";
import {verticalScanLinesEffect} from "../effects/primaryEffects/verticalScanLines.js";
import {hexEffect} from "../effects/primaryEffects/hex.js";
import {wireframeSpiralEffect} from "../effects/primaryEffects/wireframe-spiral.js";
import {rippleEffect} from "../effects/primaryEffects/ripples.js";
import {fuzzyRippleEffect} from "../effects/primaryEffects/fuzzy-ripples.js";
import {fuzzEffect} from "../effects/primaryEffects/fuzz.js";
import {fuzzBandsEffect} from "../effects/primaryEffects/fuzzBands.js";
import {gatesEffect} from "../effects/primaryEffects/gates.js";
import {ampEffect} from "../effects/primaryEffects/amp.js";
import {viewportEffect} from "../effects/primaryEffects/viewport.js";
import {randomizeEffect} from "../effects/secondaryEffects/randomize.js";
import {glowEffect} from "../effects/secondaryEffects/glow.js";
import {fadeEffect} from "../effects/secondaryEffects/fade.js";
import {rotateEffect} from "../effects/secondaryEffects/rotate.js";
import {blurEffect} from "../effects/finalImageEffects/blur.js";
import {pixelateEffect} from "../effects/finalImageEffects/pixelate.js";
import {sepiaEffect} from "../effects/finalImageEffects/sepia.js";
import {posterizeEffect} from "../effects/finalImageEffects/posterize.js";
import {glitchInverseEffect} from "../effects/finalImageEffects/glitchInverse.js";
import {glitchFractalEffect} from "../effects/finalImageEffects/glitchFractal.js";
import {glitchDrumrollHorizontalWaveEffect} from "../effects/finalImageEffects/glitchDrumrollHorizontalWave.js";

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

test('no null or undefined in rippleEffect generate function', () => {
    const hasNullOrUndefined = checkIfAnyNullOrUndefined(rippleEffect.generateData());
    expect(hasNullOrUndefined).toBe(false);
});

test('no null or undefined in fuzzyRippleEffect generate function', () => {
    const hasNullOrUndefined = checkIfAnyNullOrUndefined(fuzzyRippleEffect.generateData());
    expect(hasNullOrUndefined).toBe(false);
});

test('no null or undefined in fuzzEffect generate function', () => {
    const hasNullOrUndefined = checkIfAnyNullOrUndefined(fuzzEffect.generateData());
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

test('no null or undefined in rotateEffect generate function', () => {
    const hasNullOrUndefined = checkIfAnyNullOrUndefined(rotateEffect.generateData());
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