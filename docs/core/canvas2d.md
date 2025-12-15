# Canvas2D

## When to use this
Reference this when you need to allocate a drawable canvas, render primitives (rings, rays, polygons, text), and export to files or layers. The API is designed for consumption outside this repo via `import { Canvas2dFactory } from 'my-nft-gen';`.

## Purpose & lifecycle
- `Canvas2d` wraps a render strategy (currently `SvgCanvasStrategy`).
- Lifecycle:
  1. `Canvas2dFactory.getNewCanvas(width, height, strategy)` creates the instance and calls `newCanvas`.
  2. Draw shapes/text via the delegated methods.
  3. Export with `toFile()` or convert to a `Layer` via `convertToLayer()`.
  4. Call `dispose()` to clear caches.

## Construction
```javascript
import { Canvas2dFactory } from 'my-nft-gen';

const canvas = await Canvas2dFactory.getNewCanvas(640, 640, 'svg');
```

## API surface (delegated to `SvgCanvasStrategy`)
All methods return `Promise<void>` unless noted.

| Method | Signature | Notes |
| --- | --- | --- |
| `newCanvas` | `(width, height)` | Reset to a blank canvas. |
| `toFile` | `(filename)` | Write PNG converted from the SVG stack. |
| `convertToLayer` | `()` → `Layer` | Renders current SVG into a Sharp-backed `Layer`. |
| `dispose` | `()` | Clears cached SVG fragments. |
| `drawRing2d` | `(pos, radius, innerStroke, innerColor, outerStroke, outerColor, alpha)` | Draw a stroked ring. |
| `drawRay2d` | `(pos, angle, radius, length, innerStroke, innerColor, outerStroke, outerColor)` | Single radial ray. |
| `drawRays2d` | `(pos, radius, length, sparsityFactor, innerStroke, innerColor, outerStroke, outerColor)` | Fan of rays. |
| `drawPolygon2d` | `(radius, pos, numberOfSides, startAngle, innerStroke, innerColor, outerStroke, outerColor, alpha)` | Outlined polygon. |
| `drawFilledPolygon2d` | `(radius, pos, numberOfSides, startAngle, fillColor, alpha)` | Filled polygon. |
| `drawGradientLine2d` | `(startPos, endPos, stroke, startColor, endColor)` | Linear gradient stroke. |
| `drawLine2d` | `(startPos, endPos, innerStroke, innerColor, outerStroke, outerColor, alpha)` | Double-stroke line. |
| `drawBezierCurve` | `(start, control, end, innerStroke, innerColor, outerStroke, outerColor)` | Quadratic Bézier curve. |
| `drawPath` | `(segment, innerStroke, innerColor, outerStroke, outerColor)` | Accepts array of points or SVG path string. |
| `drawGradientRect` | `(x, y, width, height, colorStops)` | Color stops are `{ offset, color }`. |
| `drawText` | `(text, x, y, options)` | Options include font family/size/weight/style, color/alpha, anchor, baseline, letter spacing, decoration, stroke, rotation. |

## Minimal create + render example
```javascript
import { Canvas2dFactory } from 'my-nft-gen';

const canvas = await Canvas2dFactory.getNewCanvas(400, 400);
await canvas.drawRing2d({ x: 200, y: 200 }, 80, 2, '#ff00ff', 6, '#00ffff', 0.9);
await canvas.drawText('hello', 200, 200, { textAnchor: 'middle', dominantBaseline: 'middle', color: '#ffffff', fontSize: 24 });
await canvas.toFile('output/ring.png');
```

## Performance notes
- `SvgCanvasStrategy` caches built SVG fragments in `this.elements` and clears via `dispose()`.
- Exports convert SVG → PNG through Sharp; minimize calls to `toFile`/`convertToLayer` for throughput.

Related files
- `src/core/factory/canvas/Canvas2d.js`
- `src/core/factory/canvas/Canvas2dFactory.js`
- `src/core/factory/canvas/strategy/SvgCanvasStrategy.js`

See also
- [Layer2D](layer2d.md)
- [Effects overview](../effects/overview.md)
