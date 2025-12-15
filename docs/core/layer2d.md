# Layer2D

## When to use this
Use this as a reference for loading, compositing, and transforming raster layers backed by Sharp. The API is consumable outside this repo via `import { LayerFactory } from 'my-nft-gen';`.

## Purpose and mental model
- `Layer` is a thin wrapper around a strategy (default `SharpLayerStrategy`) that owns a PNG buffer.
- Treat each layer as a full-size image that can be composited with other layers or written to disk.
- Coordinate system: top-left origin; widths/heights are passed directly to Sharp, so `(0,0)` is the upper-left corner.

## Creating layers
```javascript
import { LayerFactory } from 'my-nft-gen';

const layer = await LayerFactory.getNewLayer(
    640, // height
    640, // width
    { r: 0, g: 0, b: 0, alpha: 0 }, // background
    { workingDirectory: 'output/', layerStrategy: 'sharp', finalImageSize: { width: 640, height: 640, longestSide: 640, shortestSide: 640 } }
);
```
You can also load from files or buffers via `LayerFactory.getLayerFromFile(filename)` or `getLayerFromBuffer(buffer)`.

## API surface (Sharp-backed)
All methods return `Promise<void>` unless noted.

| Method | Signature | Notes |
| --- | --- | --- |
| `newLayer` | `(height, width, backgroundColor)` | Create/reset with a filled background. |
| `fromFile` / `toFile` | `(filename)` | Read/write PNGs. |
| `fromBuffer` / `toBuffer` | `(buffer)` / `()` → `Buffer` | Stream-safe conversions. |
| `compositeLayerOver` | `(layer, withoutResize=false)` | Composite another layer, resizing to `finalImageSize` unless `withoutResize` is true. |
| `compositeLayerOverAtPoint` | `(layer, top, left)` | Place another layer at pixel coordinates. |
| `blur` | `(byPixels)` | Gaussian blur when `byPixels > 0`. |
| `adjustLayerOpacity` | `(opacity)` | Opacity in `[0,1]` mapped to 0–255 alpha channel. |
| `rotate` | `(angle)` | Rotate around center and fit back to original bounds. |
| `resize` | `(height, width, fitType)` | Uses Sharp fit modes (e.g., `contain`). |
| `crop` | `(left, top, width, height)` | Safe extract; ignores errors silently. |
| `extend` | `({ top, bottom, left, right })` | Transparent extension. |
| `getInfo` | `()` → metadata | Returns Sharp metadata `{ width, height, channels, ... }`. |
| `modulate` | `({ brightness, saturation, contrast })` | Color adjustments. |

## Layer + effects interaction
Effects receive `Layer` instances and may:
- Draw to a temporary canvas (`Canvas2dFactory.getNewCanvas`), convert via `convertToLayer()`, then composite onto the working layer.
- Chain additional effects through `LayerEffect.invoke` (e.g., secondary/post effects).

## Examples
### Draw and composite onto another layer
```javascript
import { Canvas2dFactory, LayerFactory } from 'my-nft-gen';

const base = await LayerFactory.getNewLayer(400, 400, { r: 0, g: 0, b: 0, alpha: 0 });
const canvas = await Canvas2dFactory.getNewCanvas(400, 400);
await canvas.drawFilledPolygon2d(80, { x: 200, y: 200 }, 6, 0, '#00ffcc', 0.8);
const polygonLayer = await canvas.convertToLayer();
await base.compositeLayerOver(polygonLayer);
await base.toFile('output/composited.png');
```

Related files
- `src/core/factory/layer/Layer.js`
- `src/core/factory/layer/LayerFactory.js`
- `src/core/factory/layer/strategy/SharpLayerStrategy.js`

See also
- [Canvas2D](canvas2d.md)
- [Effects overview](../effects/overview.md)
