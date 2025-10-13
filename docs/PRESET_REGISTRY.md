# PresetRegistry Documentation

The **PresetRegistry** provides a centralized registry for effect presets, following the same pattern as `EffectRegistry` and `ConfigRegistry`. It allows you to register presets alongside effects and look them up by effect name.

## Overview

When you register an effect with `EffectRegistry`, any presets defined on the effect class are automatically registered in the `PresetRegistry`. You can then look up presets by effect name, just like you look up effects and configs.

## Key Concept

```
Effect Name (Registry Key) → Multiple Presets
```

Just like:
- `EffectRegistry`: Effect Name → Effect Class
- `ConfigRegistry`: Effect Name → Config Class
- `PresetRegistry`: Effect Name → Array of Presets

## Quick Start

### 1. Define Presets on Effect Class

```javascript
import { LayerEffect } from 'my-nft-gen';
import { EffectConfig } from 'my-nft-gen';

class SpiralWaveEffect extends LayerEffect {
    static _name_ = 'SpiralWave';
    
    // Define presets as static property
    static presets = [
        {
            name: 'gentle-spiral',
            effect: 'SpiralWave',
            percentChance: 100,
            currentEffectConfig: {
                spiralCount: 2,
                waveAmplitude: 30,
                rotationSpeed: 1
            }
        },
        {
            name: 'intense-spiral',
            effect: 'SpiralWave',
            percentChance: 100,
            currentEffectConfig: {
                spiralCount: 5,
                waveAmplitude: 80,
                rotationSpeed: 3
            }
        }
    ];
    
    static configClass = class SpiralWaveConfig extends EffectConfig {
        constructor(config = {}) {
            super();
            this.spiralCount = config.spiralCount || 3;
            this.waveAmplitude = config.waveAmplitude || 50;
            this.rotationSpeed = config.rotationSpeed || 2;
        }
    };

    async draw(canvas, context, frameIndex, totalFrames) {
        // Effect implementation
    }
}
```

### 2. Register Effect (Presets Auto-Register)

```javascript
import { EffectRegistry, EffectCategories } from 'my-nft-gen';

// Register effect - presets are automatically registered
EffectRegistry.registerGlobal(SpiralWaveEffect, EffectCategories.PRIMARY);
```

### 3. Look Up Presets by Effect Name

```javascript
import { PresetRegistry } from 'my-nft-gen';

// Get all presets for an effect
const presets = PresetRegistry.getGlobal('SpiralWave');
// Returns: [{ name: 'gentle-spiral', ... }, { name: 'intense-spiral', ... }]

// Get specific preset
const preset = PresetRegistry.getPresetGlobal('SpiralWave', 'gentle-spiral');
// Returns: { name: 'gentle-spiral', effect: 'SpiralWave', ... }

// Get preset names
const names = PresetRegistry.getPresetNamesGlobal('SpiralWave');
// Returns: ['gentle-spiral', 'intense-spiral']

// Check if effect has presets
const hasPresets = PresetRegistry.hasGlobal('SpiralWave');
// Returns: true
```

## API Reference

### Static Methods (Global Registry)

#### `PresetRegistry.registerGlobal(effectName, presets, metadata)`
Register preset(s) for an effect.

**Parameters:**
- `effectName` (string): Effect name (registry key)
- `presets` (Array|Object): Single preset or array of presets
- `metadata` (Object): Optional metadata

**Returns:** PresetRegistry instance (for chaining)

**Example:**
```javascript
PresetRegistry.registerGlobal('MyEffect', [
    { name: 'preset1', effect: 'MyEffect', percentChance: 100 },
    { name: 'preset2', effect: 'MyEffect', percentChance: 50 }
]);
```

#### `PresetRegistry.getGlobal(effectName)`
Get all presets for an effect.

**Parameters:**
- `effectName` (string): Effect name

**Returns:** Array of presets or null

**Example:**
```javascript
const presets = PresetRegistry.getGlobal('SpiralWave');
```

#### `PresetRegistry.getPresetGlobal(effectName, presetName)`
Get a specific preset by effect name and preset name.

**Parameters:**
- `effectName` (string): Effect name
- `presetName` (string): Preset name

**Returns:** Preset object or null

**Example:**
```javascript
const preset = PresetRegistry.getPresetGlobal('SpiralWave', 'gentle-spiral');
```

#### `PresetRegistry.hasGlobal(effectName)`
Check if effect has registered presets.

**Parameters:**
- `effectName` (string): Effect name

**Returns:** boolean

#### `PresetRegistry.getPresetNamesGlobal(effectName)`
Get array of preset names for an effect.

**Parameters:**
- `effectName` (string): Effect name

**Returns:** Array of strings

**Example:**
```javascript
const names = PresetRegistry.getPresetNamesGlobal('SpiralWave');
// ['gentle-spiral', 'intense-spiral', 'chaotic-spiral']
```

#### `PresetRegistry.getMetadataGlobal(effectName)`
Get metadata for effect's presets.

**Parameters:**
- `effectName` (string): Effect name

**Returns:** Metadata object or null

**Example:**
```javascript
const meta = PresetRegistry.getMetadataGlobal('SpiralWave');
// { effectName: 'SpiralWave', presetCount: 3, description: '...', ... }
```

#### `PresetRegistry.getAllGlobal()`
Get all registered presets across all effects.

**Returns:** Array of `{ effectName, presets, metadata }`

**Example:**
```javascript
const all = PresetRegistry.getAllGlobal();
// [
//   { effectName: 'SpiralWave', presets: [...], metadata: {...} },
//   { effectName: 'RadialBurst', presets: [...], metadata: {...} }
// ]
```

#### `PresetRegistry.unregisterGlobal(effectName)`
Remove all presets for an effect.

**Parameters:**
- `effectName` (string): Effect name

**Returns:** boolean (true if removed)

#### `PresetRegistry.unregisterPresetGlobal(effectName, presetName)`
Remove a specific preset.

**Parameters:**
- `effectName` (string): Effect name
- `presetName` (string): Preset name

**Returns:** boolean (true if removed)

#### `PresetRegistry.clearGlobal()`
Clear all registered presets.

#### `PresetRegistry.sizeGlobal()`
Get number of effects with presets.

**Returns:** number

#### `PresetRegistry.totalPresetsGlobal()`
Get total number of presets across all effects.

**Returns:** number

## Preset Format

Each preset must have:
- **name** (string): Unique name for the preset
- **effect** (string): Effect class name

Optional fields:
- **percentChance** (number): 0-100
- **ignoreSecondaryEffects** (boolean)
- **currentEffectConfig** (object): Effect-specific configuration
- **possibleSecondaryEffects** (array): Secondary effect names

## Using Presets

Get presets from the registry and use them in your code:

```javascript
import { PresetRegistry } from 'my-nft-gen';

// Get preset from registry
const preset = PresetRegistry.getPresetGlobal('SpiralWave', 'gentle-spiral');

// Use the preset configuration
const config = preset.currentEffectConfig;
console.log('Spiral count:', config.spiralCount);
console.log('Wave amplitude:', config.waveAmplitude);
```

## Combining Presets from Multiple Effects

```javascript
// Get presets from different effects
const spiralPreset = PresetRegistry.getPresetGlobal('SpiralWave', 'gentle-spiral');
const burstPreset = PresetRegistry.getPresetGlobal('RadialBurst', 'explosive-burst');

// Combine into one preset array
const combinedPreset = [spiralPreset, burstPreset];

// Use combined presets
console.log('Combined preset with', combinedPreset.length, 'effects');
```

## Instance Registry

You can also create instance registries (not global):

```javascript
import { PresetRegistry } from 'my-nft-gen';

const myRegistry = new PresetRegistry();

myRegistry.register('MyEffect', [
    { name: 'preset1', effect: 'MyEffect' }
]);

const presets = myRegistry.get('MyEffect');
```

## Best Practices

### 1. Define Presets on Effect Class

```javascript
class MyEffect extends LayerEffect {
    static _name_ = 'MyEffect';
    
    // ✅ Good: Define presets as static property
    static presets = [
        { name: 'preset1', effect: 'MyEffect', ... },
        { name: 'preset2', effect: 'MyEffect', ... }
    ];
}
```

### 2. Use Descriptive Preset Names

```javascript
// ✅ Good: Descriptive names
static presets = [
    { name: 'gentle-spiral', ... },
    { name: 'intense-spiral', ... },
    { name: 'chaotic-spiral', ... }
];

// ❌ Bad: Generic names
static presets = [
    { name: 'preset1', ... },
    { name: 'preset2', ... }
];
```

### 3. Provide Multiple Presets for Different Use Cases

```javascript
static presets = [
    { name: 'subtle', percentChance: 30, ... },    // Low intensity
    { name: 'moderate', percentChance: 60, ... },  // Medium intensity
    { name: 'intense', percentChance: 100, ... }   // High intensity
];
```

### 4. Document Preset Purpose

```javascript
static presets = [
    {
        name: 'gentle-spiral',
        effect: 'SpiralWave',
        // Good for backgrounds and subtle effects
        percentChance: 50,
        currentEffectConfig: { spiralCount: 2, waveAmplitude: 30 }
    },
    {
        name: 'intense-spiral',
        effect: 'SpiralWave',
        // Good for focal points and dramatic effects
        percentChance: 100,
        currentEffectConfig: { spiralCount: 5, waveAmplitude: 80 }
    }
];
```

## Advanced Usage

### Programmatic Preset Registration

```javascript
// Register presets without defining on effect class
PresetRegistry.registerGlobal('MyEffect', [
    { name: 'dynamic-preset', effect: 'MyEffect', ... }
]);
```

### Appending Presets

```javascript
// Register initial presets
PresetRegistry.registerGlobal('MyEffect', [
    { name: 'preset1', effect: 'MyEffect' }
]);

// Append more presets later
PresetRegistry.registerGlobal('MyEffect', [
    { name: 'preset2', effect: 'MyEffect' }
]);

// Now has both presets
const all = PresetRegistry.getGlobal('MyEffect');
// [{ name: 'preset1', ... }, { name: 'preset2', ... }]
```

### Removing Specific Presets

```javascript
// Remove one preset
PresetRegistry.unregisterPresetGlobal('MyEffect', 'preset1');

// Remove all presets for effect
PresetRegistry.unregisterGlobal('MyEffect');
```

## Examples

See `examples/preset-registry-example.js` for a complete working example.

## Related Documentation

- [PLUGINS.md](./PLUGINS.md) - Plugin system documentation
- [PRESET_REGISTRY_QUICK_START.md](./PRESET_REGISTRY_QUICK_START.md) - Quick reference guide
- Effect Registry documentation
- Config Registry documentation

## Summary

The PresetRegistry provides a clean, consistent way to:
1. ✅ Register presets alongside effects
2. ✅ Look up presets by effect name (registry key)
3. ✅ Get specific presets by name
4. ✅ Combine presets from multiple effects
5. ✅ Use presets to configure effects programmatically

It follows the same pattern as EffectRegistry and ConfigRegistry, making it intuitive and easy to use.