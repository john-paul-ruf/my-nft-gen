import {animateBackgroundEffect} from "../src/effects/primaryEffects/animateBackground/effect.js";
import {checkIfAnyNullOrUndefined} from "./helpers/checkIfAnyNullOrUndefined.js";
import {verticalScanLinesEffect} from "../src/effects/primaryEffects/scanLines/effect.js";
import {hexEffect} from "../src/effects/primaryEffects/hex/effect.js";
import {wireframeSpiralEffect} from "../src/effects/primaryEffects/wireframeSpiral/effect.js";
import {fuzzyRippleEffect} from "../src/effects/primaryEffects/fuzzyRipples/effect.js";
import {fuzzBandsEffect} from "../src/effects/primaryEffects/fuzzBands/effect.js";
import {gatesEffect} from "../src/effects/primaryEffects/gates/effect.js";
import {viewportEffect} from "../src/effects/primaryEffects/viewport/effect.js";
import {randomizeEffect} from "../src/effects/secondaryEffects/randomize/effect.js";
import {glowEffect} from "../src/effects/secondaryEffects/glow/effect.js";
import {fadeEffect} from "../src/effects/secondaryEffects/fade/effect.js";
import {blurEffect} from "../src/effects/finalImageEffects/blur/effect.js";
import {pixelateEffect} from "../src/effects/finalImageEffects/pixelate/effect.js";
import {glitchInverseEffect} from "../src/effects/finalImageEffects/glitchInverse/effect.js";
import {glitchFractalEffect} from "../src/effects/finalImageEffects/glitchFractal/effect.js";
import {
    glitchDrumrollHorizontalWaveEffect
} from "../src/effects/finalImageEffects/glitchDrumrollHorizontalWave/effect.js";
import {scopesEffect} from "../src/effects/primaryEffects/scopes/effect.js";
import {rayRingEffect} from "../src/effects/primaryEffects/rayRing/effect.js";
import {ampEffect} from "../src/effects/primaryEffects/amp/effect.js";
import {threeDimensionalShapeEffect} from "../src/effects/primaryEffects/threeDimensionalShape/effect.js";
import {threeDimensionalRingsEffect} from "../src/effects/primaryEffects/threeDeminsonalRings/effect.js";
import {invertedRayRingEffect} from "../src/effects/primaryEffects/invertedRayRing/effect.js";
import {lensFlareEffect} from "../src/effects/primaryEffects/lensFlare/effect.js";
import {layeredHexEffect} from "../src/effects/primaryEffects/layeredHex/effect.js";
import {layeredRingsEffect} from "../src/effects/primaryEffects/layeredRings/effect.js";
import {encircledSpiralEffect} from "../src/effects/primaryEffects/encircledSpiral/effect.js";
import {eightEffect} from "../src/effects/primaryEffects/eight/effect.js";

resetGlobalSettings();

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

test('no null or undefined in three-dimensional-shape generate function', () => {
    const hasNullOrUndefined = checkIfAnyNullOrUndefined(threeDimensionalShapeEffect.generateData());
    expect(hasNullOrUndefined).toBe(false);
});

test('no null or undefined in three-dimensional-ring generate function', () => {
    const hasNullOrUndefined = checkIfAnyNullOrUndefined(threeDimensionalRingsEffect.generateData());
    expect(hasNullOrUndefined).toBe(false);
});

test('no null or undefined in inverted-ray-rings generate function', () => {
    const hasNullOrUndefined = checkIfAnyNullOrUndefined(invertedRayRingEffect.generateData());
    expect(hasNullOrUndefined).toBe(false);
});

test('no null or undefined in lens-flare generate function', () => {
    const hasNullOrUndefined = checkIfAnyNullOrUndefined(lensFlareEffect.generateData());
    expect(hasNullOrUndefined).toBe(false);
});

test('no null or undefined in layered-hex generate function', () => {
    const hasNullOrUndefined = checkIfAnyNullOrUndefined(layeredHexEffect.generateData());
    expect(hasNullOrUndefined).toBe(false);
});

test('no null or undefined in layered-ring generate function', () => {
    const hasNullOrUndefined = checkIfAnyNullOrUndefined(layeredRingsEffect.generateData());
    expect(hasNullOrUndefined).toBe(false);
});

test('no null or undefined in encircled-Spiral generate function', () => {
    const hasNullOrUndefined = checkIfAnyNullOrUndefined(encircledSpiralEffect.generateData());
    expect(hasNullOrUndefined).toBe(false);
});

test('no null or undefined in eight generate function', () => {
    const hasNullOrUndefined = checkIfAnyNullOrUndefined(eightEffect.generateData());
    expect(hasNullOrUndefined).toBe(false);
});