# Quickstart

## When to use this
Follow this guide to install dependencies, register effects, and render a test loop or MP4 using the built-in scripts.

## Install
```bash
npm install
```

## Run / build / generate output
- **Smoke test render:**
  ```bash
  npm run quick-test   # runs node src/mp4-test.js
  ```
  `src/mp4-test.js` constructs a small `Project`, registers effects via `EnhancedEffectsRegistration.registerEffectsFromPackage()`, and generates a 3-frame sample using Sharp.
- **Test suite:**
  ```bash
  npm test
  ```
- **Programmatic render (example):**
  ```javascript
  import { Project, LayerConfig } from 'my-nft-gen';
  import { EnhancedEffectsRegistration } from './src/core/registry/EnhancedEffectsRegistration.js';
  import { RayRingEffect } from './src/effects/primaryEffects/rayRing/RayRingEffect.js';

  await EnhancedEffectsRegistration.registerEffectsFromPackage();

  const project = new Project({
      projectName: 'quick-demo',
      numberOfFrame: 60,
      longestSideInPixels: 640,
      shortestSideInPixels: 640,
      workingDirectory: 'output/',
  });

  project.addPrimaryEffect({
      layerConfig: new LayerConfig({
          name: 'ray-rings',
          effect: RayRingEffect,
          percentChance: 100,
      }),
  });

  await project.generate();
  ```

## Expected inputs/outputs
- **Inputs:**
  - Node.js ≥18.
  - Effect registration via `EnhancedEffectsRegistration.registerEffectsFromPackage()` (loads built-ins from `src/effects`).
  - Layer strategy defaults to Sharp; files saved under the configured `workingDirectory`.
- **Outputs:**
  - Generated frame files or MP4s in the chosen working directory (e.g., `test-output/` in `src/mp4-test.js`).
  - Presets and registry metadata are stored in memory during runtime.

## Common failure modes + fixes
- **Effect not found in registry:** Ensure `EnhancedEffectsRegistration.registerEffectsFromPackage()` is called before `EffectRegistry.getGlobal()` or before constructing `LayerConfig` with an effect class.
- **Missing working directory:** `Project` does not auto-create directories in `src/mp4-test.js`; ensure the `workingDirectory` exists or create it before running.
- **Zero-length renders:** `findValue` returns early when `totalFrame` or `times` is `0`; pass non-zero values in configs that drive animated parameters.

Related files
- `package.json`
- `src/mp4-test.js`
- `src/app/Project.js`

See also
- [Architecture overview](architecture.md)
- [Troubleshooting](troubleshooting.md)
