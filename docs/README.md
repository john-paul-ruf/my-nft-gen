# my-nft-gen Documentation Hub

## When to use this
Use this entry point when you need a fast orientation to the project. It links to all other docs and shows the minimum code needed to spin up the engine.

## What the app is
`my-nft-gen` is a Node.js generative art engine that builds layered 2D compositions with a plugin-based effect system, renders frames via Sharp/SVG, and can export image sequences or MP4s.

## Who it’s for
- Engineers building custom visual effects or presets.
- Artists who want to script generative loops with repeatable configs.
- Contributors who need to understand the render pipeline and registries.

## Docs map
- [Getting started](quickstart.md)
- [Architecture overview](architecture.md)
- Core engine
  - [Canvas2D](core/canvas2d.md)
  - [Layer2D](core/layer2d.md)
- Effects system
  - [Effects overview](effects/overview.md)
  - [Creating an effect](effects/creating-an-effect.md)
  - [Effect config schema](effects/effect-config-schema.md)
  - [Oscillating blur example](effects/example-oscillating-blur.md)
- Recipes
  - [Blur using two layers](recipes/blur-two-layer.md)
  - [findValue lookups](recipes/find-value.md)
- Reference & troubleshooting
  - [Config glossary](reference/config-glossary.md)
  - [Troubleshooting](troubleshooting.md)

## 30-second usage example
```javascript
import { Project, LayerConfig } from 'my-nft-gen';
import { EnhancedEffectsRegistration } from './src/core/registry/EnhancedEffectsRegistration.js';
import { EffectRegistry } from './src/core/registry/EffectRegistry.js';
import { RayRingEffect } from './src/effects/primaryEffects/rayRing/RayRingEffect.js';

// Register built-in effects (required before lookup)
await EnhancedEffectsRegistration.registerEffectsFromPackage();

const project = new Project({
    projectName: 'demo-loop',
    numberOfFrame: 120,
    longestSideInPixels: 1080,
    shortestSideInPixels: 1080,
});

project.addPrimaryEffect({
    layerConfig: new LayerConfig({
        name: 'ray-rings',
        effect: RayRingEffect,
        percentChance: 100,
    }),
});

// Build settings + generate frames
// (Project.generate orchestrates worker threads and rendering.)
await project.generate();
```

Related files
- `index.js`
- `src/app/Project.js`
- `package.json`

See also
- [Getting started](quickstart.md)
- [Architecture overview](architecture.md)
