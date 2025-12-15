# Creating an Effect

## When to use this
Follow these steps when adding a new drawable or post-processing effect to the engine.

## Steps
1. **Choose location:** Add files under `src/effects/<category>/<EffectName>/` (e.g., `primaryEffects/MyEffect/`).
2. **Create config class:** Extend `EffectConfig` and expose parameters.
   ```javascript
   // src/effects/primaryEffects/MyEffect/MyEffectConfig.js
   import { EffectConfig } from '../../../core/layer/EffectConfig.js';

   export class MyEffectConfig extends EffectConfig {
       constructor({ strength = 0.5 } = {}) {
           super();
           this.strength = strength;
       }
   }
   ```
3. **Create effect class:** Extend `LayerEffect`, set static metadata, and implement `invoke`.
   ```javascript
   // src/effects/primaryEffects/MyEffect/MyEffectEffect.js
   import { LayerEffect } from '../../../core/layer/LayerEffect.js';
   import { MyEffectConfig } from './MyEffectConfig.js';

   export class MyEffectEffect extends LayerEffect {
       static _name_ = 'my-effect';
       static configClass = MyEffectConfig;

       constructor({ config = new MyEffectConfig({}), ...rest } = {}) {
           super({ name: MyEffectEffect._name_, requiresLayer: true, config, ...rest });
       }

       async invoke(layer, currentFrame, numberOfFrames) {
           // draw or modify the layer here
           await super.invoke(layer, currentFrame, numberOfFrames);
       }
   }
   ```
4. **Register the effect:** Use `EffectRegistry.registerGlobal(name, EffectClass)` or rely on `EnhancedEffectsRegistration.registerEffectsFromPackage()` to auto-register packaged effects.
5. **Use it in a project:**
   ```javascript
   import { Project, LayerConfig } from 'my-nft-gen';
   import { MyEffectEffect } from './src/effects/primaryEffects/MyEffect/MyEffectEffect.js';
   import { EnhancedEffectsRegistration } from './src/core/registry/EnhancedEffectsRegistration.js';

   await EnhancedEffectsRegistration.registerEffectsFromPackage();

   const project = new Project({ numberOfFrame: 60 });
   project.addPrimaryEffect({
       layerConfig: new LayerConfig({
           name: 'my-effect',
           effect: MyEffectEffect,
           percentChance: 100,
           currentEffectConfig: { strength: 0.8 },
       }),
   });
   await project.generate();
   ```

## Hello world overlay example
```javascript
import { Canvas2dFactory } from 'my-nft-gen';
import { LayerEffect } from '../../../core/layer/LayerEffect.js';
import { EffectConfig } from '../../../core/layer/EffectConfig.js';

class HelloConfig extends EffectConfig {
    constructor({ text = 'hello world' } = {}) {
        super();
        this.text = text;
    }
}

export class HelloEffect extends LayerEffect {
    static _name_ = 'hello-overlay';
    static configClass = HelloConfig;

    constructor({ config = new HelloConfig({}), ...rest } = {}) {
        super({ name: HelloEffect._name_, requiresLayer: true, config, ...rest });
    }

    async invoke(layer, currentFrame, totalFrames) {
        const canvas = await Canvas2dFactory.getNewCanvas(layer.finalImageSize?.width || 400, layer.finalImageSize?.height || 400);
        await canvas.drawText(this.config.text, 20, 40, { color: '#ffffff', fontSize: 24 });
        const overlay = await canvas.convertToLayer();
        await layer.compositeLayerOver(overlay, true);
        await super.invoke(layer, currentFrame, totalFrames);
    }
}
```

Related files
- `src/core/layer/LayerEffect.js`
- `src/core/layer/EffectConfig.js`
- `src/core/registry/EffectRegistry.js`
- `src/core/registry/EnhancedEffectsRegistration.js`

See also
- [Effects overview](overview.md)
- [Effect config schema](effect-config-schema.md)
