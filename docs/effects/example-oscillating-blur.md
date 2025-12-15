# Example: Oscillating Blur Overlay Effect

## When to use this
Use this as a template for a lightweight effect that draws on a `Canvas2d`, converts to a `Layer`, animates blur with `findValue`, and composites over the current frame.

## Minimal implementation
```javascript
// src/effects/secondaryEffects/pulse-blur/PulseBlurEffect.js
import { LayerEffect } from '../../../core/layer/LayerEffect.js';
import { EffectConfig } from '../../../core/layer/EffectConfig.js';
import { Canvas2dFactory } from '../../../core/factory/canvas/Canvas2dFactory.js';
import { findValue, FindValueAlgorithm } from '../../../core/math/findValue.js';
import { Range } from '../../../core/layer/configType/Range.js';

class PulseBlurConfig extends EffectConfig {
    constructor({ blurRange = new Range(2, 6), times = 2, text = 'pulse' } = {}) {
        super();
        this.blurRange = blurRange;
        this.times = times;
        this.text = text;
    }
}

export class PulseBlurEffect extends LayerEffect {
    static _name_ = 'pulse-blur';
    static configClass = PulseBlurConfig;

    constructor({ config = new PulseBlurConfig({}), ...rest } = {}) {
        super({ name: PulseBlurEffect._name_, requiresLayer: true, config, ...rest });
    }

    async invoke(layer, currentFrame, totalFrames) {
        const width = this.finalSize?.width ?? 640;
        const height = this.finalSize?.height ?? 640;

        const canvas = await Canvas2dFactory.getNewCanvas(width, height);
        await canvas.drawGradientRect(0, 0, width, height, [
            { offset: 0, color: '#101018' },
            { offset: 1, color: '#7027ff' },
        ]);
        await canvas.drawText(this.config.text, width / 2, height / 2, {
            textAnchor: 'middle',
            dominantBaseline: 'middle',
            color: '#ffffff',
            fontSize: 64,
        });

        const overlay = await canvas.convertToLayer();
        const blurByPixels = Math.floor(
            findValue(
                this.config.blurRange.lower,
                this.config.blurRange.upper,
                this.config.times,
                totalFrames,
                currentFrame,
                FindValueAlgorithm.JOURNEY_SIN,
            ),
        );
        if (blurByPixels > 0) {
            await overlay.blur(blurByPixels);
        }
        await overlay.adjustLayerOpacity(0.8);
        await layer.compositeLayerOver(overlay);

        await super.invoke(layer, currentFrame, totalFrames);
    }
}
```

## Usage snippet
```javascript
import { LayerConfig } from 'my-nft-gen/src/core/layer/LayerConfig.js';
import { EnhancedEffectsRegistration } from 'my-nft-gen/src/core/registry/EnhancedEffectsRegistration.js';
import { PulseBlurEffect } from './src/effects/secondaryEffects/pulse-blur/PulseBlurEffect.js';

await EnhancedEffectsRegistration.registerEffectsFromPackage();

const layerConfig = new LayerConfig({
    name: 'pulse-blur',
    effect: PulseBlurEffect,
    percentChance: 100,
    currentEffectConfig: {
        blurRange: { lower: 1, upper: 5 },
        times: 3,
        text: 'hello svg',
    },
});
// Attach layerConfig to your project/layer pipeline as shown in quickstart.
```

Related files
- `src/core/factory/canvas/Canvas2dFactory.js`
- `src/core/factory/canvas/Canvas2d.js`
- `src/core/layer/LayerEffect.js`
- `src/core/layer/EffectConfig.js`
- `src/core/math/findValue.js`
- `src/core/layer/configType/Range.js`
- `src/effects/secondaryEffects/single-layer-blur/SingleLayerBlurEffect.js`

See also
- [Effects overview](overview.md)
- [Creating an effect](creating-an-effect.md)
- [Effect config schema](effect-config-schema.md)
