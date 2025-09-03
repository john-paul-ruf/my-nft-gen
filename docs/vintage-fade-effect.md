# VintageFadeEffect

Applies a warm vintage color wash and animated grain.

## Usage

```javascript
import {VintageFadeEffect} from './src/effects/finalImageEffects/vintageFade/VintageFadeEffect.js';
import {VintageFadeConfig} from './src/effects/finalImageEffects/vintageFade/VintageFadeConfig.js';

const effect = new VintageFadeEffect({
  config: new VintageFadeConfig({
    warmth: {lower: 0.2, upper: 0.4},
    grainIntensity: {lower: 0.05, upper: 0.15},
    flickerSpeed: {lower: 2, upper: 6}
  })
});
```

## Configuration

- `warmth`: range controlling the strength of the warm color overlay.
- `grainIntensity`: range controlling grain noise strength.
- `flickerSpeed`: range for how many times the grain opacity flickers over the animation.
