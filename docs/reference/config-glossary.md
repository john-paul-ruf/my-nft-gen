# Config Glossary

## When to use this
Use this glossary to decode common config keys used across projects, layer configs, and effects.

### Canvas / project
- `numberOfFrame` – total frames to render (`Project` constructor).
- `longestSideInPixels` / `shortestSideInPixels` – base dimensions; drive `Project.width/height` getters.
- `isHorizontal` – swaps width/height orientation.
- `workingDirectory` – output path used by layers/effects for temporary files.
- `layerStrategy` – rendering backend (`sharp` default) used by `LayerFactory`.

### Layer
- `finalImageSize` – `{ width, height, longestSide, shortestSide }`; used by `LayerFactory` and `SharpLayerStrategy` to constrain composites/resizes.
- `backgroundColor` – RGBA object when calling `LayerFactory.getNewLayer`.
- `percentChance` – probability that a `LayerConfig` effect is selected.
- `ignoreSecondaryEffects` – skip `additionalEffects` when true.

### Effect (examples)
- `currentEffectConfig` – concrete config object passed into an effect (keys vary per effect).
- `times` – oscillation cycles for animated parameters (used by `findValue`).
- `blurRange` / `accentRange` / `lengthRange` – common range objects with `{ lower, upper }` or nested `bottom/top` ranges.
- `layerOpacity` / `underLayerOpacity` – blending amounts before compositing (see `RayRingEffect` presets).
- `center` – often a `Position` with `{ x, y }` used for radial effects.

### Export
- `workingDirectory` – ensures temp files can be written before ffmpeg/export.
- `ffmpegConfig` – optional config passed to `Project` for video output (see `FFmpegConfig` export in `index.js`).

Related files
- `src/app/Project.js`
- `src/core/factory/layer/LayerFactory.js`
- `src/core/factory/layer/strategy/SharpLayerStrategy.js`
- `src/effects/primaryEffects/rayRing/RayRingEffect.js`

See also
- [Effect config schema](../effects/effect-config-schema.md)
- [Quickstart](../quickstart.md)
