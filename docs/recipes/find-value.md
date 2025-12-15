# Recipe: Using `findValue`

## When to use this
Use `findValue` to compute oscillating parameter values across animation frames (e.g., opacity, blur, hue) using loop-safe algorithms.

## Location & signature
- Defined in `src/core/math/findValue.js`.
- Signature:
  ```javascript
  findValue(min, max, times, totalFrame, currentFrame, algorithm = FindValueAlgorithm.JOURNEY_SIN, precision = 10000)
  ```
- Returns a number between `min` and `max`. If `max === min`, `totalFrame === 0`, or `times === 0`, it returns `min` early.

## Supported patterns
- Algorithms come from `FindValueAlgorithm` (e.g., `JOURNEY_SIN`, `ELASTIC_BOUNCE`, `PULSE_WAVE`, `OCEAN_TIDE`).
- Phase offsets are built-in per algorithm for staggered peaks.
- Uses `times` to control oscillation cycles over `totalFrame`.

## Examples
### Basic lookup
```javascript
import { findValue, FindValueAlgorithm } from 'my-nft-gen';

const val = findValue(0, 10, 1, 100, 50); // midpoint using default JOURNEY_SIN envelope
```

### Lookup with default/fallback
```javascript
const constant = findValue(5, 5, 2, 100, 40); // returns 5 immediately because min === max
```

### Nested/animated config usage
Used inside effects, e.g., `RayRingEffect` animates ray length per frame:
```javascript
const length = findValue(
    context.data.circles[i].rays[rayIndex].length.lower,
    context.data.circles[i].rays[rayIndex].length.upper,
    context.data.circles[i].rays[rayIndex].lengthTimes,
    context.numberOfFrames,
    context.currentFrame
);
```

Related files
- `src/core/math/findValue.js`
- `src/effects/primaryEffects/rayRing/RayRingEffect.js`
- `tests/findValue.test.js`

See also
- [Effect config schema](../effects/effect-config-schema.md)
- [Config glossary](../reference/config-glossary.md)
