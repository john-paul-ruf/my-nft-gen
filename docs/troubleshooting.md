# Troubleshooting

## When to use this
Check these fixes for common runtime issues observed in the codebase.

- **Effect class not found in registry**
  - Symptom: `EffectRegistry.getGlobal(...)` returns `undefined` (see guard in `src/mp4-test.js`).
  - Fix: Call `EnhancedEffectsRegistration.registerEffectsFromPackage()` before resolving effects.

- **Images not resized when compositing**
  - Symptom: Layers overflow or clip when overlaying.
  - Fix: Use `Layer.compositeLayerOver(layer)` without `withoutResize=true` so `SharpLayerStrategy` auto-resizes both layers to `finalImageSize`.

- **Blur/opacity no-op**
  - Symptom: `blur()` or `adjustLayerOpacity()` appears ineffective.
  - Fix: Ensure the layer buffer is initialized (`newLayer` or `fromFile`). `SharpLayerStrategy.blur` skips when `byPixels <= 0`; pass a positive value. `adjustLayerOpacity` expects `opacity` in `[0,1]`.

- **Zero animation movement**
  - Symptom: Animated parameters stay constant.
  - Fix: `findValue` returns early when `totalFrame` or `times` is `0`; verify configs set non-zero counts.

- **Missing output directory**
  - Symptom: File writes fail in custom scripts.
  - Fix: Create the `workingDirectory` before calling `toFile`/`generate` (e.g., `test-output/` in `src/mp4-test.js`).

Related files
- `src/core/registry/EffectRegistry.js`
- `src/mp4-test.js`
- `src/core/factory/layer/strategy/SharpLayerStrategy.js`
- `src/core/math/findValue.js`

See also
- [Quickstart](quickstart.md)
- [Config glossary](reference/config-glossary.md)
