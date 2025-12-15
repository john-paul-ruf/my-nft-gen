# Effect Config Schema

## When to use this
Consult this when shaping config objects for effects or writing presets.

## Conventions
- Config classes extend `EffectConfig` (`src/core/layer/EffectConfig.js`). Validation is currently a TODO (stubbed `validate()` method).
- Effects often expose `static configClass` and `static presets` to describe expected keys.
- Numeric ranges are frequently expressed as `{ lower, upper }` objects; some effects nest these under `bottom`/`top` entries.

## Required vs optional
- Unless enforced by the effect’s constructor, fields are optional. Effects typically supply defaults in the config constructor.
- `LayerConfig` wraps an effect with `percentChance` and `ignoreSecondaryEffects` flags; these are required when instantiating the layer config but not inside the effect config itself.

## Real config examples
### RayRingEffect preset (primary effect)
From `RayRingEffect.presets`:
```javascript
{
    name: 'simple-ray-rings',
    effect: 'ray-rings',
    percentChance: 100,
    currentEffectConfig: {
        layerOpacity: 0.8,
        underLayerOpacity: 0.6,
        circles: { lower: 2, upper: 4 },
        radiusInitial: 200,
        radiusGap: 40,
        stroke: 1,
        thickness: 1,
        rayStroke: 1,
        rayThickness: 1,
        scaleFactor: 1.15,
        densityFactor: 1.5,
        accentRange: { bottom: { lower: 0, upper: 0 }, top: { lower: 2, upper: 4 } },
        blurRange: { bottom: { lower: 0, upper: 0 }, top: { lower: 1, upper: 2 } },
        featherTimes: { lower: 1, upper: 2 },
        lengthRange: { bottom: { lower: 3, upper: 8 }, top: { lower: 10, upper: 30 } },
        lengthTimes: { lower: 1, upper: 3 },
        sparsityFactor: [2, 3],
        speed: { lower: 0, upper: 0 },
        center: new Position({x: 1080 / 2, y: 1920 / 2}),
    }
}
```
Key patterns: scalar numbers, `{lower, upper}` ranges, arrays for discrete picks, and rich objects (e.g., `Position`).

### SingleLayerBlurConfig defaults (secondary effect)
```javascript
new SingleLayerBlurConfig({
    lowerRange: new Range(0, 0),
    upperRange: new Range(2, 6),
    times: new Range(2, 9),
    glitchChance: 100,
});
```
Effect logic then samples `lowerRange`/`upperRange`/`times` to derive blur values each frame and checks `glitchChance` before invoking `layer.blur()`.

### Config reconstruction test (FuzzFlareEffect)
`src/mp4-test.js` constructs a `LayerConfig` with serialized fields:
```javascript
new LayerConfig({
    name: 'fuzz-flare',
    effect: FuzzFlareEffect,
    percentChance: 100,
    currentEffectConfig: {
        flareRingsSizeRange: {
            __className: 'PercentageRange',
            lower: { percent: 0.1 },
            upper: { percent: 0.2 }
        },
        innerColor: {
            __className: 'ColorPicker',
            selectionType: 'colorBucket',
            colorValue: null
        }
    }
})
```
The engine reconstructs class instances (e.g., `PercentageRange`, `ColorPicker`) during `Settings.generateEffects()`.

## Validation/normalization
- `EffectConfig.validate()` is currently empty; effects themselves should defensively handle missing keys.
- `LayerFactory.compositeLayerOver` automatically resizes layers to `finalImageSize` unless `withoutResize` is `true`, which normalizes layer dimensions during compositing.

Related files
- `src/core/layer/EffectConfig.js`
- `src/effects/primaryEffects/rayRing/RayRingEffect.js`
- `src/effects/secondaryEffects/single-layer-blur/SingleLayerBlurConfig.js`
- `src/effects/secondaryEffects/single-layer-blur/SingleLayerBlurEffect.js`
- `src/mp4-test.js`

See also
- [Creating an effect](creating-an-effect.md)
- [Config glossary](../reference/config-glossary.md)
- [Oscillating blur example](example-oscillating-blur.md)
