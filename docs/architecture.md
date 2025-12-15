# Architecture Overview

## When to use this
Read this to understand how configs, layers, effects, and exports move through the engine before adding new features or debugging renders.

## Data flow
```
Config (Project + LayerConfig + EffectConfig)
    ↓
Settings.generateEffects() → LoopBuilder (animation plan)
    ↓
Canvas2dFactory → Canvas2d (strategy: SvgCanvasStrategy) → draw primitives
    ↓
LayerFactory (SharpLayerStrategy) → Layer instances
    ↓
LayerEffect.invoke() chains additional effects
    ↓
Composition/composite → write via Sharp → ffmpeg pipeline (if exporting video)
```

## Key modules & responsibilities
- `src/app/Project.js`
  - Owns project metadata, effect selections, worker/event wiring.
  - Provides `addPrimaryEffect/removePrimaryEffect` and triggers generation lifecycle events.
- `src/core/Settings.js` (imported by effects)
  - Normalizes working directory, layer strategy, final sizes, and effect lists before rendering.
- `src/core/factory/canvas/Canvas2dFactory.js`
  - Builds `Canvas2d` wrappers with a render strategy (currently `SvgCanvasStrategy`).
- `src/core/factory/canvas/strategy/SvgCanvasStrategy.js`
  - Renders geometric primitives to SVG strings, converts to PNG buffers via Sharp, and can hand buffers to `LayerFactory`.
- `src/core/factory/layer/LayerFactory.js`
  - Produces `Layer` objects backed by `SharpLayerStrategy`; supports new layers, loading from file/buffer, and compositing.
- `src/core/factory/layer/strategy/SharpLayerStrategy.js`
  - Implements blur, resize, crop, composite, opacity adjustment, rotate, extend via Sharp; manages buffer lifecycle.
- `src/core/layer/LayerEffect.js`
  - Base class for effects; runs `additionalEffects` and exposes metadata for each effect.
- Registries
  - `src/core/registry/EffectRegistry.js`, `ConfigRegistry.js`, `PresetRegistry.js` coordinate plugin resolution and presets.

## Lifecycle / pipeline stages
1. **Register effects:** `EnhancedEffectsRegistration.registerEffectsFromPackage()` populates the registries.
2. **Select effects:** `Project.addPrimaryEffect({ layerConfig })` pushes `LayerConfig` entries.
3. **Generate settings:** `Settings.generateEffects()` hydrates effect instances (and their configs) for each frame builder thread.
4. **Build frame:** Effects allocate canvases/layers, draw primitives, composite layers, and apply secondary effects via `LayerEffect.invoke` chaining.
5. **Export:** Layers are written to files through `SharpLayerStrategy.toFile`; MP4 or sequences can be produced via ffmpeg helpers (see `src/mp4-test.js` and core/output modules).

## ASCII pipeline
```
[Project config]
      │
      ▼
[Settings + registries]
      │
      ▼
[Effect instances] ──► [Canvas2d (SVG→PNG)] ──► [Layer (Sharp)]
                                      │
                                      ▼
                           [Composite & effects]
                                      │
                                      ▼
                               [Export/write]
```

Related files
- `src/app/Project.js`
- `src/core/factory/canvas/Canvas2dFactory.js`
- `src/core/factory/canvas/strategy/SvgCanvasStrategy.js`
- `src/core/factory/layer/LayerFactory.js`
- `src/core/factory/layer/strategy/SharpLayerStrategy.js`
- `src/core/layer/LayerEffect.js`

See also
- [Canvas2D](core/canvas2d.md)
- [Layer2D](core/layer2d.md)
- [Effects overview](effects/overview.md)
