# Repository Guidelines

## Project Structure & Module Organization
- src/: Core code.
  - core/: Math, animation, IO (e.g., core/output/writeToMp4.js).
  - effects/: finalImageEffects, primaryEffects, secondaryEffects, keyFrameEffects.
  - app/: entry-level project utilities.
  - scratch/: ad hoc experiments and generated artifacts.
- tests/: Jest tests (e.g., findValue.test.js), helpers/.
- output/: Rendered assets (mp4/images) when running scripts.
- coverage/: Jest coverage reports.

## Build, Test, and Development Commands
- npm test: Run Jest test suite with coverage.
- npm run quick-test: Execute a simple MP4 generation demo (node src/mp4-test.js).
- node src/rolling-gradient-test.js: Run a focused demo script.
Notes: Requires Node.js (LTS). FFmpeg/ffprobe are provided via ffmpeg-ffprobe-static; no system install needed.

## Coding Style & Naming Conventions
- Modules: ESM enabled ("type": "module"). Use import/export.
- Indentation: 4 spaces; end lines with semicolons.
- Filenames: PascalCase for classes/effects/configs (e.g., PixelateEffect.js, CRTScanLinesConfig.js). Kebab-case for some directories.
- Configuration objects: Keep "Config" alongside its "Effect" in the same folder.
- No linter configured; match existing style and structure.

## Testing Guidelines
- Framework: Jest with Babel transform (babel-jest).
- Location: Place tests in tests/ with filename pattern *.test.js.
- Coverage: Enabled by default; artifacts in coverage/.
- Run specific test: npx jest tests/findValue.test.js -t "midpoint match".

## Commit & Pull Request Guidelines
- Commits: No strict convention in history; use concise, imperative subject (<= 72 chars) + short context body if needed. Example: "Refactor: simplify BufferPool allocation path".
- PRs: Include overview, rationale, testing steps/outputs (commands used, before/after), linked issues, and screenshots/gifs for visual changes. Keep changes scoped; avoid unrelated refactors.

## Security & Configuration Tips
- Heavy renders: Some scripts are CPU-intensive; prefer small frame counts when iterating.
- Outputs: Write to output/ or a project-specific path; avoid committing generated media.
- Dependencies: Keep sharp and fluent-ffmpeg up to date to pick up fixes.

## Architecture Overview
- Pipeline: Project/App builds layers -> primaryEffects -> secondaryEffects/keyFrameEffects -> finalImageEffects -> core/output (e.g., writeToMp4.js).
- Rendering: Uses Canvas2dFactory and LayerFactory; image ops via SharpLayerStrategy; pooling via CanvasPool/BufferPool to reduce GC.
- Animation & Math: Time-based helpers in core/math/ (e.g., findValue.js with multiple loop-safe algorithms) drive smooth parameter changes.
- Output: MP4/frames via fluent-ffmpeg and ffmpeg-ffprobe-static; also see writeScreenCap.js and writeArtistCard.js for stills/aux.

## Quick Start: Add a New Effect
1) Create files under src/effects/primaryEffects/MyEffect/:
   - MyEffectConfig.js
   - MyEffectEffect.js
2) Config (minimal):
```js
// src/effects/primaryEffects/MyEffect/MyEffectConfig.js
import { EffectConfig } from '../../../core/layer/EffectConfig.js';
export class MyEffectConfig extends EffectConfig {
  constructor({ strength = 0.5 } = {}) { super(); this.strength = strength; }
}
```
3) Effect (skeleton):
```js
// src/effects/primaryEffects/MyEffect/MyEffectEffect.js
import { LayerEffect } from '../../../core/layer/LayerEffect.js';
import { MyEffectConfig } from './MyEffectConfig.js';
export class MyEffectEffect extends LayerEffect {
  static _name_ = 'myEffect';
  constructor({ config = new MyEffectConfig({}), ...rest } = {}) { super({ config, ...rest }); }
  async invoke(layer, currentFrame, numberOfFrames) { /* draw/composite */ await super.invoke(layer, currentFrame, numberOfFrames); }
  getInfo() { return `${this.name}: strength=${this.config.strength}`; }
}
```
4) Keep Config next to Effect; follow naming and import paths like existing effects (e.g., HexEffect/HexConfig).
