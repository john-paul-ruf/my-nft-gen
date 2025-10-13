# PresetRegistry Quick Start

## TL;DR

**PresetRegistry** lets you look up presets by effect name, just like you look up effects and configs.

```javascript
// Define presets on effect class
class MyEffect extends LayerEffect {
    static _name_ = 'MyEffect';
    static presets = [
        { name: 'preset1', effect: 'MyEffect', ... },
        { name: 'preset2', effect: 'MyEffect', ... }
    ];
}

// Register effect (presets auto-register)
EffectRegistry.registerGlobal(MyEffect, EffectCategories.PRIMARY);

// Look up by effect name
const presets = PresetRegistry.getGlobal('MyEffect');
const preset1 = PresetRegistry.getPresetGlobal('MyEffect', 'preset1');
```

## Registry Pattern

```
Effect Name → Effect Class     (EffectRegistry)
Effect Name → Config Class     (ConfigRegistry)
Effect Name → Presets Array    (PresetRegistry) ✨
```

## Common Operations

### Get All Presets for Effect
```javascript
const presets = PresetRegistry.getGlobal('SpiralWave');
// Returns: [{ name: 'gentle', ... }, { name: 'intense', ... }]
```

### Get Specific Preset
```javascript
const preset = PresetRegistry.getPresetGlobal('SpiralWave', 'gentle');
// Returns: { name: 'gentle', effect: 'SpiralWave', ... }
```

### Get Preset Names
```javascript
const names = PresetRegistry.getPresetNamesGlobal('SpiralWave');
// Returns: ['gentle', 'intense', 'chaotic']
```

### Check if Has Presets
```javascript
const hasPresets = PresetRegistry.hasGlobal('SpiralWave');
// Returns: true
```

### Get All Presets (All Effects)
```javascript
const all = PresetRegistry.getAllGlobal();
// Returns: [
//   { effectName: 'SpiralWave', presets: [...], metadata: {...} },
//   { effectName: 'RadialBurst', presets: [...], metadata: {...} }
// ]
```

### Statistics
```javascript
const effectCount = PresetRegistry.sizeGlobal();        // Number of effects with presets
const totalPresets = PresetRegistry.totalPresetsGlobal(); // Total number of presets
```

## Use Presets in Your Code

```javascript
import { PresetRegistry, Project } from 'my-nft-gen';

// 1. Get preset from registry
const preset = PresetRegistry.getPresetGlobal('SpiralWave', 'gentle');

// 2. Use preset configuration in your effect
const config = preset.currentEffectConfig;
// Apply config to your effect...
```

## Combine Presets from Multiple Effects

```javascript
// Get presets from different effects
const spiral = PresetRegistry.getPresetGlobal('SpiralWave', 'gentle');
const burst = PresetRegistry.getPresetGlobal('RadialBurst', 'explosive');

// Combine into a single preset array
const combined = [spiral, burst];

// Use combined presets
console.log('Combined preset:', combined);
```

## Complete Example

```javascript
import { LayerEffect, EffectConfig, EffectRegistry, EffectCategories, PresetRegistry } from 'my-nft-gen';

// 1. Define effect with presets
class SpiralWave extends LayerEffect {
    static _name_ = 'SpiralWave';
    
    static presets = [
        {
            name: 'gentle',
            effect: 'SpiralWave',
            percentChance: 100,
            currentEffectConfig: { spiralCount: 2, waveAmplitude: 30 }
        },
        {
            name: 'intense',
            effect: 'SpiralWave',
            percentChance: 100,
            currentEffectConfig: { spiralCount: 5, waveAmplitude: 80 }
        }
    ];
    
    static configClass = class SpiralWaveConfig extends EffectConfig {
        constructor(config = {}) {
            super();
            this.spiralCount = config.spiralCount || 3;
            this.waveAmplitude = config.waveAmplitude || 50;
        }
    };

    async draw(canvas, context, frameIndex, totalFrames) {
        // Implementation
    }
}

// 2. Register effect
EffectRegistry.registerGlobal(SpiralWave, EffectCategories.PRIMARY);

// 3. Use presets
const presets = PresetRegistry.getGlobal('SpiralWave');
console.log(`Found ${presets.length} presets`);

const gentle = PresetRegistry.getPresetGlobal('SpiralWave', 'gentle');
console.log('Gentle preset:', gentle);
```

## API Cheat Sheet

| Method | Purpose | Returns |
|--------|---------|---------|
| `getGlobal(effectName)` | Get all presets for effect | Array or null |
| `getPresetGlobal(effectName, presetName)` | Get specific preset | Object or null |
| `getPresetNamesGlobal(effectName)` | Get preset names | Array of strings |
| `hasGlobal(effectName)` | Check if has presets | boolean |
| `getMetadataGlobal(effectName)` | Get metadata | Object or null |
| `getAllGlobal()` | Get all presets | Array |
| `sizeGlobal()` | Number of effects | number |
| `totalPresetsGlobal()` | Total presets | number |

## See Also

- [PRESET_REGISTRY.md](./PRESET_REGISTRY.md) - Full documentation
- [examples/preset-registry-example.js](../examples/preset-registry-example.js) - Complete example