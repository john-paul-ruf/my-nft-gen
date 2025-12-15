# Effects Overview

## When to use this
Start here to understand how effects are represented, invoked, and wired into layers/canvases.

## What is an effect?
- An effect is a subclass of `LayerEffect` that draws or post-processes a `Layer`.
- Each effect carries a config object (often a dedicated `*Config` class) plus optional `additionalEffects` that run afterward.
- Effects are registered in `EffectRegistry` and may expose presets via `PresetRegistry`; the plugin-based `EnhancedEffectsRegistration.registerEffectsFromPackage()` migrates these into legacy registries for consumption.

## Lifecycle hooks
- **constructor:** Accepts `{ name, requiresLayer, config, additionalEffects, ignoreAdditionalEffects, settings }`, sets up registry-related metadata, and may preload assets.
- **invoke(layer, currentFrame, totalFrames):** Main entry point called per frame; base class iterates `additionalEffects` unless `ignoreAdditionalEffects` is `true`.
- **getInfo():** Returns a short descriptor string.

## How effects receive params/config
- Config objects are passed into the effect constructor (`config` param) and stored as `this.config`.
- Many effects define `static configClass` and `static presets` (see `RayRingEffect` and `SingleLayerBlurEffect`), enabling config hydration through registries.
- `Settings` injects render context: `layerStrategy`, `finalSize`, `workingDirectory`, `fileConfig`.

## Applying effects to layers/canvas
- Effects often create a `Canvas2d` instance, draw primitives, convert to a `Layer`, then composite it over an existing `Layer` using `LayerFactory` operations (e.g., `compositeLayerOver`, `adjustLayerOpacity`).
- Secondary/post effects are executed by the base `LayerEffect.invoke` loop.

## Representative examples and patterns
- **Geometry + glow:** `src/effects/primaryEffects/rayRing/RayRingEffect.js`
  - Draws concentric rings/rays on a `Canvas2d`, composites two saved layers, feathers edges with `findValue`-driven blur, and animates ray lengths/accents frame-by-frame.
- **Single-layer post blur:** `src/effects/secondaryEffects/single-layer-blur/SingleLayerBlurEffect.js`
  - Randomly picks blur bounds/times from `Range` configs, uses `findValue` to oscillate blur per frame, and calls `layer.blur()` when a glitch chance check passes.
- **Keyframe modulation:** `src/effects/keyFrameEffects/pixelate/PixelateKeyFrameEffect.js`
  - Samples `findValue` to raise/lower pixelation strength across frames, relying on `Layer.blur`/resize-like operations for stylized stepping.
- **Final image CRT distortion:** `src/effects/finalImageEffects/claudeCRTBarrelRoll/ClaudeCRTBarrelRollEffect.js`
  - Applies `findValue`-driven barrel distortion and rolling offsets in a post-process stage, operating on the final composited layer.

Related files
- `src/core/layer/LayerEffect.js`
- `src/core/layer/EffectConfig.js`
- `src/core/registry/EffectRegistry.js`
- `src/core/registry/EnhancedEffectsRegistration.js`
- `src/effects/primaryEffects/rayRing/RayRingEffect.js`
- `src/effects/secondaryEffects/single-layer-blur/SingleLayerBlurEffect.js`
- `src/effects/keyFrameEffects/pixelate/PixelateKeyFrameEffect.js`
- `src/effects/finalImageEffects/claudeCRTBarrelRoll/ClaudeCRTBarrelRollEffect.js`

See also
- [Creating an effect](creating-an-effect.md)
- [Effect config schema](effect-config-schema.md)
- [Oscillating blur example](example-oscillating-blur.md)
