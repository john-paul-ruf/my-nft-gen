# Recipe: Blur Using Two Layers

## When to use this
Use this pattern to add a soft glow/blur without destroying the sharp foreground by compositing a blurred copy underneath. Blur here means two identical drawings overlaid: one stays crisp, one is blurred (often at lower opacity) with both blur radius and opacity driven by `findValue` for animation.

## Approach
1. Render your sharp content to a base `Layer`.
2. Duplicate the base into a blur layer (`LayerFactory.getLayerFromBuffer(await base.toBuffer())`).
3. Compute blur radius/opacity using `findValue` so frames animate smoothly.
4. Apply `blur()` and `adjustLayerOpacity()` to the blur layer.
5. Composite the blurred layer over (or under) the base using `compositeLayerOver`.

## Example (Sharp layer APIs + `findValue`)
```javascript
import { Canvas2dFactory, LayerFactory, findValue, FindValueAlgorithm } from 'my-nft-gen';

// Step 1: draw crisp content once
const base = await LayerFactory.getNewLayer(640, 640, { r: 0, g: 0, b: 0, alpha: 0 });
const canvas = await Canvas2dFactory.getNewCanvas(640, 640);
await canvas.drawRing2d({ x: 320, y: 320 }, 120, 2, '#ff00ff', 8, '#00ffff', 0.9);
const crispLayer = await canvas.convertToLayer();
await base.compositeLayerOver(crispLayer, true);

// Step 2: duplicate and animate blur/opacity with findValue
const blurLayer = await LayerFactory.getLayerFromBuffer(await base.toBuffer(), {
    finalImageSize: { width: 640, height: 640, longestSide: 640, shortestSide: 640 },
    workingDirectory: 'output/',
});
const blurRadius = findValue(2, 14, 2, /*totalFrames=*/60, /*currentFrame=*/30, FindValueAlgorithm.JOURNEY_SIN);
const blurOpacity = findValue(0.35, 0.7, 2, 60, 30, FindValueAlgorithm.JOURNEY_SIN);
await blurLayer.blur(blurRadius);
await blurLayer.adjustLayerOpacity(blurOpacity);

// Step 3: composite blurred copy over the crisp base
await base.compositeLayerOver(blurLayer, true);
await base.toFile('output/blurred-composite.png');
```

## Why two layers?
- `SharpLayerStrategy.blur()` mutates the image; keeping a crisp base preserves details while the blurred copy adds glow.
- Using `findValue` to drive both `blur()` and `adjustLayerOpacity()` ensures the overlay stays in sync with animation timing.

Related files
- `src/core/factory/layer/LayerFactory.js`
- `src/core/factory/layer/strategy/SharpLayerStrategy.js`
- `src/core/factory/canvas/Canvas2d.js`
- `src/core/math/findValue.js`

See also
- [Layer2D](../core/layer2d.md)
- [Effects overview](../effects/overview.md)
